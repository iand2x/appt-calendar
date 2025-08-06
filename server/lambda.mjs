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
import process from "process";

// Initialize DynamoDB client
const isOffline = process.env.IS_OFFLINE === "true";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-southeast-2",
  ...(isOffline && { endpoint: "http://localhost:8000" }),
});
const dynamoDB = DynamoDBDocumentClient.from(client);

// GraphQL schema
const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String!
  }

  type Appointment {
    id: ID!
    patientName: String!
    patientEmail: String!
    appointmentDate: String!
    appointmentTime: String!
    serviceType: String!
    technician: String!
    status: String!
    notes: String
    createdBy: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreateAppointmentInput {
    patientName: String!
    patientEmail: String!
    appointmentDate: String!
    appointmentTime: String!
    serviceType: String!
    technician: String!
    notes: String
  }

  input UpdateAppointmentInput {
    patientName: String
    patientEmail: String
    appointmentDate: String
    appointmentTime: String
    serviceType: String
    technician: String
    status: String
    notes: String
  }

  type Query {
    hello: String
    getAppointments: [Appointment!]!
    getAppointment(id: ID!): Appointment
    getUsers: [User!]!
  }

  type Mutation {
    createAppointment(input: CreateAppointmentInput!): Appointment!
    updateAppointment(id: ID!, input: UpdateAppointmentInput!): Appointment!
    deleteAppointment(id: ID!): Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello: () => "Hello from AWS Lambda + DynamoDB!",

    getAppointments: async () => {
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
    createAppointment: async (_, { input }) => {
      try {
        const appointment = {
          id: `appt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...input,
          status: "scheduled",
          createdBy: "system", // You can get this from context/auth
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

    updateAppointment: async (_, { id, input }) => {
      try {
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

    deleteAppointment: async (_, { id }) => {
      try {
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
