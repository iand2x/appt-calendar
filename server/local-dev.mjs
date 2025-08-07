import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client for local development
const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://localhost:8000", // Always use local DynamoDB
});
const dynamoDB = DynamoDBDocumentClient.from(client);

// Import your schema and resolvers from lambda.mjs
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

const resolvers = {
  Query: {
    hello: () => "Hello from Local Development Server + DynamoDB!",

    getAppointments: async () => {
      try {
        const command = new ScanCommand({
          TableName: "AppointmentsTable",
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
          TableName: "AppointmentsTable",
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
          TableName: "UsersTable",
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
          createdBy: "system",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const command = new PutCommand({
          TableName: "AppointmentsTable",
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

        updateExpression.push("#updatedAt = :updatedAt");
        expressionAttributeNames["#updatedAt"] = "updatedAt";
        expressionAttributeValues[":updatedAt"] = new Date().toISOString();

        const command = new UpdateCommand({
          TableName: "AppointmentsTable",
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
          TableName: "AppointmentsTable",
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

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use("/graphql", cors(), express.json(), expressMiddleware(server));

const PORT = 4000;
await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(
  `🚀 Local Development Server ready at http://localhost:${PORT}/graphql`
);
