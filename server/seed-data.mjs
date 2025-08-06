import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import process from "process";

// Initialize DynamoDB client
const isOffline = process.env.IS_OFFLINE === "true";
console.log("Is offline:", isOffline);

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-southeast-2",
  // For local development with serverless-offline
  ...(isOffline && {
    endpoint: "http://localhost:8000",
  }),
});
const dynamoDB = DynamoDBDocumentClient.from(client);

// Sample users data
const sampleUsers = [
  {
    id: "user_001",
    username: "admin",
    email: "admin@apptcalendar.com",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_002",
    username: "technician1",
    email: "tech1@apptcalendar.com",
    role: "technician",
    createdAt: new Date().toISOString(),
  },
];

// Sample appointments data
const sampleAppointments = [
  {
    id: "appt_001",
    patientName: "John Doe",
    patientEmail: "john.doe@email.com",
    appointmentDate: "2024-01-15",
    appointmentTime: "10:00",
    serviceType: "Consultation",
    technician: "Dr. Smith",
    status: "scheduled",
    notes: "Initial consultation for new patient",
    createdBy: "user_001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "appt_002",
    patientName: "Jane Smith",
    patientEmail: "jane.smith@email.com",
    appointmentDate: "2024-01-15",
    appointmentTime: "14:30",
    serviceType: "Follow-up",
    technician: "Dr. Johnson",
    status: "scheduled",
    notes: "Follow-up appointment",
    createdBy: "user_001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "appt_003",
    patientName: "Bob Wilson",
    patientEmail: "bob.wilson@email.com",
    appointmentDate: "2024-01-16",
    appointmentTime: "09:00",
    serviceType: "Therapy Session",
    technician: "Dr. Brown",
    status: "completed",
    notes: "Physical therapy session completed successfully",
    createdBy: "user_002",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seedData() {
  try {
    console.log("🌱 Seeding sample data...");
    console.log("Is offline:", isOffline);

    // Seed users
    console.log("📝 Adding sample users...");
    for (const user of sampleUsers) {
      const command = new PutCommand({
        TableName: process.env.USERS_TABLE || "UsersTable",
        Item: user,
      });
      await dynamoDB.send(command);
      console.log(`✅ Added user: ${user.username}`);
    }

    // Seed appointments
    console.log("📅 Adding sample appointments...");
    for (const appointment of sampleAppointments) {
      const command = new PutCommand({
        TableName: process.env.APPOINTMENTS_TABLE || "AppointmentsTable",
        Item: appointment,
      });
      await dynamoDB.send(command);
      console.log(
        `✅ Added appointment: ${appointment.patientName} - ${appointment.appointmentDate}`
      );
    }

    console.log("🎉 Sample data seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedData();
