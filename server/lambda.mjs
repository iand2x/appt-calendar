import { ApolloServer } from "@apollo/server";
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import process from "process";

// Initialize DynamoDB client
const isOffline = process.env.IS_OFFLINE === "true";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-southeast-2",
  ...(isOffline && { endpoint: "http://localhost:8000" }),
});
const dynamoDB = DynamoDBDocumentClient.from(client);

// Authentication utilities
const JWT_SECRET =
  process.env.JWT_SECRET || "your-jwt-secret-key-change-in-production";

// Password verification utility
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// JWT token generation
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
};

// JWT token verification
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// GraphQL schema
const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String!
  }

  type AuthPayload {
    success: Boolean!
    message: String!
    user: User
    token: String
  }

  type LogoutPayload {
    success: Boolean!
    message: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Appointment {
    id: ID!
    date: String!
    dentist: String!
    equipment: String!
    notes: String
    createdBy: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreateAppointmentInput {
    date: String!
    dentist: String!
    equipment: String!
    notes: String
  }

  input UpdateAppointmentInput {
    date: String
    dentist: String
    equipment: String
    notes: String
  }

  type Query {
    hello: String
    appointments: [Appointment!]!
    appointmentsByUser(userEmail: String!): [Appointment!]!
    appointmentsByDateRange(userEmail: String!, startDate: String!, endDate: String!): [Appointment!]!
    getAppointment(id: ID!): Appointment
    getUsers: [User!]!
    getProfile(token: String!): User
  }

  type Mutation {
    # Authentication mutations
    login(email: String!, password: String!): AuthPayload!
    logout(token: String!): LogoutPayload!
    
    # Appointment mutations
    createAppointment(input: CreateAppointmentInput!, userEmail: String!): Appointment!
    updateAppointment(id: ID!, input: UpdateAppointmentInput!, userEmail: String!, userRole: String): Appointment!
    deleteAppointment(id: ID!, userEmail: String!, userRole: String): Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello: () => "Hello from AWS Lambda + DynamoDB!",

    getProfile: async (_, { token }) => {
      try {
        const decoded = verifyToken(token);

        const command = new GetCommand({
          TableName: process.env.USERS_TABLE || "UsersTable",
          Key: { id: decoded.id },
        });

        const result = await dynamoDB.send(command);

        if (!result.Item) {
          throw new Error("User not found");
        }

        // Remove password from response
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = result.Item;
        return userWithoutPassword;
      } catch (error) {
        console.error("Error getting profile:", error);
        // More specific error messages
        if (error.message === "User not found") {
          throw error;
        }
        if (error.name === "JsonWebTokenError") {
          throw new Error("Invalid token");
        }

        throw new Error("Failed to get profile");
      }
    },

    appointments: async () => {
      try {
        const command = new ScanCommand({
          TableName: process.env.APPOINTMENTS_TABLE || "AppointmentsTable",
        });
        const result = await dynamoDB.send(command);
        return result.Items || [];
      } catch (error) {
        console.error("Error fetching appointments:", error);
        throw new Error("Failed to fetch appointments");
      }
    },

    appointmentsByUser: async (_, { userEmail }) => {
      try {
        const command = new ScanCommand({
          TableName: process.env.APPOINTMENTS_TABLE || "AppointmentsTable",
          FilterExpression: "createdBy = :userEmail",
          ExpressionAttributeValues: {
            ":userEmail": userEmail,
          },
        });
        const result = await dynamoDB.send(command);
        return result.Items || [];
      } catch (error) {
        console.error("Error fetching appointments by user:", error);
        throw new Error("Failed to fetch appointments by user");
      }
    },

    appointmentsByDateRange: async (_, { userEmail, startDate, endDate }) => {
      try {
        const command = new ScanCommand({
          TableName: process.env.APPOINTMENTS_TABLE || "AppointmentsTable",
          FilterExpression:
            "createdBy = :userEmail AND #date BETWEEN :startDate AND :endDate",
          ExpressionAttributeNames: {
            "#date": "date",
          },
          ExpressionAttributeValues: {
            ":userEmail": userEmail,
            ":startDate": startDate,
            ":endDate": endDate,
          },
        });
        const result = await dynamoDB.send(command);
        return result.Items || [];
      } catch (error) {
        console.error("Error fetching appointments by date range:", error);
        throw new Error("Failed to fetch appointments by date range");
      }
    },

    getAppointment: async (_, { id }) => {
      try {
        const command = new GetCommand({
          TableName: process.env.APPOINTMENTS_TABLE || "AppointmentsTable",
          Key: { id },
        });
        const result = await dynamoDB.send(command);
        return result.Item || null;
      } catch (error) {
        console.error("Error fetching appointment:", error);
        throw new Error("Failed to fetch appointment");
      }
    },

    getUsers: async () => {
      try {
        const command = new ScanCommand({
          TableName: process.env.USERS_TABLE || "UsersTable",
        });
        const result = await dynamoDB.send(command);
        return result.Items || [];
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },
  },

  Mutation: {
    // Authentication mutations
    login: async (_, { email, password }) => {
      try {
        // Find user by email
        const command = new ScanCommand({
          TableName: process.env.USERS_TABLE || "UsersTable",
          FilterExpression: "email = :email",
          ExpressionAttributeValues: {
            ":email": email,
          },
        });

        const result = await dynamoDB.send(command);

        if (!result.Items || result.Items.length === 0) {
          return {
            success: false,
            message: "User not found",
            user: null,
            token: null,
          };
        }

        const user = result.Items[0];

        // Verify password
        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
          return {
            success: false,
            message: "Invalid password",
            user: null,
            token: null,
          };
        }

        // Generate token
        const token = generateToken(user);

        // Remove password from response
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;

        return {
          success: true,
          message: "Login successful",
          user: userWithoutPassword,
          token,
        };
      } catch (error) {
        console.error("Error during login:", error);
        return {
          success: false,
          message: "Login failed",
          user: null,
          token: null,
        };
      }
    },

    logout: async (_, { token }) => {
      try {
        // Verify token is valid
        verifyToken(token);

        return {
          success: true,
          message: "Logout successful",
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return {
          success: false,
          message: "Invalid token",
        };
      }
    },

    // Appointment mutations
    createAppointment: async (_, { input, userEmail }) => {
      try {
        const appointment = {
          id: `appt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...input,
          createdBy: userEmail || "system",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const command = new PutCommand({
          TableName: process.env.APPOINTMENTS_TABLE || "AppointmentsTable",
          Item: appointment,
        });

        await dynamoDB.send(command);
        return appointment;
      } catch (error) {
        console.error("Error creating appointment:", error);
        throw new Error("Failed to create appointment");
      }
    },

    updateAppointment: async (_, { id, input, userEmail, userRole }) => {
      try {
        // Check if user is admin
        const isAdmin = userRole === "admin";

        if (!isAdmin) {
          // For regular users, verify they own the appointment
          const getCommand = new GetCommand({
            TableName: process.env.APPOINTMENTS_TABLE || "AppointmentsTable",
            Key: { id },
          });

          const existingItem = await dynamoDB.send(getCommand);

          if (!existingItem.Item) {
            throw new Error("Appointment not found");
          }

          if (existingItem.Item.createdBy !== userEmail) {
            throw new Error(
              "Unauthorized: You can only update your own appointments"
            );
          }
        }

        const updateExpression = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};

        Object.keys(input).forEach((key, index) => {
          if (input[key] !== undefined) {
            const attrName = `#attr${index}`;
            const attrValue = `:val${index}`;
            updateExpression.push(`${attrName} = ${attrValue}`);
            expressionAttributeNames[attrName] = key;
            expressionAttributeValues[attrValue] = input[key];
          }
        });

        // Always update the updatedAt field
        updateExpression.push("#updatedAt = :updatedAt");
        expressionAttributeNames["#updatedAt"] = "updatedAt";
        expressionAttributeValues[":updatedAt"] = new Date().toISOString();

        const command = new UpdateCommand({
          TableName: process.env.APPOINTMENTS_TABLE || "AppointmentsTable",
          Key: { id },
          UpdateExpression: `SET ${updateExpression.join(", ")}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: "ALL_NEW",
        });

        const result = await dynamoDB.send(command);
        return result.Attributes;
      } catch (error) {
        console.error("Error updating appointment:", error);
        throw new Error("Failed to update appointment");
      }
    },

    deleteAppointment: async (_, { id, userEmail, userRole }) => {
      try {
        // Check if user is admin
        const isAdmin = userRole === "admin";

        if (!isAdmin) {
          // For regular users, verify they own the appointment
          const getCommand = new GetCommand({
            TableName: process.env.APPOINTMENTS_TABLE || "AppointmentsTable",
            Key: { id },
          });

          const existingItem = await dynamoDB.send(getCommand);

          if (!existingItem.Item) {
            throw new Error("Appointment not found");
          }

          if (existingItem.Item.createdBy !== userEmail) {
            throw new Error(
              "Unauthorized: You can only delete your own appointments"
            );
          }
        }

        const command = new DeleteCommand({
          TableName: process.env.APPOINTMENTS_TABLE || "AppointmentsTable",
          Key: { id },
        });

        await dynamoDB.send(command);
        return true;
      } catch (error) {
        console.error("Error deleting appointment:", error);
        throw new Error("Failed to delete appointment");
      }
    },
  },
};

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Export the Lambda handler
export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  // Transform the request/response for Lambda
  handlers.createAPIGatewayProxyEventV2RequestHandler()
);
