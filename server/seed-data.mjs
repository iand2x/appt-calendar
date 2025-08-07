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
    password: "$2b$12$spRgWv24CGzklA1rfZ6WVOV1qgnU4T5Qsn22V2QfLT.YJevdd9loC", // admin123
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_002",
    username: "technician1",
    email: "tech1@apptcalendar.com",
    role: "technician",
    password: "$2b$12$Vi3MJKTgMsvfBOV4wrZXCOd9XwcNB7vESbVP4BFAckeDIC4qXOSMa", // tech123
    createdAt: new Date().toISOString(),
  },
];

// Sample appointments data
const sampleAppointments = [
  {
    id: "appt_001",
    date: "2024-01-15",
    time: "10:00",
    dentist: "Dr. Smith",
    equipment: "Hygiene Equipment",
    notes: "Initial consultation for new patient",
    createdBy: "admin@apptcalendar.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "appt_002",
    date: "2024-01-15",
    time: "14:30",
    dentist: "Dr. Johnson",
    equipment: "Scanner",
    notes: "Follow-up appointment",
    createdBy: "admin@apptcalendar.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "appt_003",
    date: "2024-01-16",
    time: "09:00",
    dentist: "Dr. Brown",
    equipment: "Compressor",
    notes: "Cleaning session completed successfully",
    createdBy: "tech1@apptcalendar.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "appt_004",
    date: "2024-01-17",
    time: "11:30",
    dentist: "Dr. Smith",
    equipment: "Suction Machine",
    notes: "Root canal procedure",
    createdBy: "tech1@apptcalendar.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "appt_005",
    date: "2024-01-18",
    time: "15:00",
    dentist: "Dr. Johnson",
    equipment: "Scanner",
    notes: "Regular checkup",
    createdBy: "admin@apptcalendar.com",
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
        `✅ Added appointment: ${appointment.dentist} - ${appointment.date} ${appointment.time}`
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
