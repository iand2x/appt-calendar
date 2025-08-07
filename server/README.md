# Appointment Calendar API

A serverless GraphQL API built with Apollo Server, AWS Lambda, and DynamoDB.

## 🚀 Features

- **GraphQL API** with Apollo Server
- **Serverless Architecture** using AWS Lambda
- **DynamoDB** for data persistence
- **CORS enabled** for frontend integration
- **Local development** with Serverless Offline

## 📋 Prerequisites

- Node.js 18+
- AWS CLI configured with appropriate credentials
- Serverless Framework installed globally: `npm install -g serverless`

## 🛠️ Setup

1. **Install dependencies:**

   ```powershell
   cd server
   npm install
   ```

2. **Configure AWS credentials** (if not already done):
   ```powershell
   aws configure
   ```

## 🏃‍♂️ Running Locally

### Using Serverless Offline

1. **Start the Serverless Offline emulator:**

   ```powershell
   npm run dev
   ```

   This will start your API locally, simulating AWS Lambda and DynamoDB. Make sure you have a local DynamoDB instance running (see below).

2. **Local DynamoDB setup (optional, for full offline experience):**

   - Download DynamoDB Local from AWS: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html
   - Start DynamoDB Local:
     ```powershell
     java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
     ```

3. **GraphQL Playground** will be available at:

   - Local: `http://localhost:3000/graphql` (or the port specified in your serverless config)

4. **Seed sample data for local DynamoDB:**

   ```powershell
   npm run seed:offline
   ```

5. **View logs for offline server:**
   ```powershell
   npm run logs:offline
   ```

## 🚀 Deployment

1. **Deploy to AWS:**

   ```powershell
   npm run deploy
   ```

2. **Seed sample data** (after deployment):

   ```powershell
   npm run seed
   ```

3. **View logs:**

   ```powershell
   npm run logs
   ```

4. **Remove stack:**
   ```powershell
   npm run remove
   ```

## 📊 GraphQL Schema

### Types

- **User**: System users (admin, technicians)
- **Appointment**: Patient appointments

### Queries

```graphql
query {
  # Get all appointments
  getAppointments {
    id
    patientName
    appointmentDate
    appointmentTime
  }

  # Get specific appointment
  getAppointment(id: "appt_001") {
    id
    patientName
    patientEmail
    notes
  }

  # Get all users
  getUsers {
    id
    username
    email
    role
  }
}
```

### Mutations

```graphql
mutation {
  # Create new appointment
  createAppointment(
    input: {
      patientName: "John Doe"
      patientEmail: "john@email.com"
      appointmentDate: "2024-01-20"
      appointmentTime: "10:00"
      serviceType: "Consultation"
      technician: "Dr. Smith"
      notes: "Initial consultation"
    }
  ) {
    id
    createdAt
  }

  # Update appointment
  updateAppointment(id: "appt_001") {
    id
    updatedAt
  }

  # Delete appointment
  deleteAppointment(id: "appt_001")
}
```

## 🗄️ Database Tables

### Appointments Table

- **Primary Key**: `id` (String)
- **GSI**: `DateIndex` on `appointmentDate`

### Users Table

- **Primary Key**: `id` (String)
- **GSI**: `EmailIndex` on `email`

## 🌍 Environment Variables

The following environment variables are automatically set by Serverless:

- `APPOINTMENTS_TABLE`: DynamoDB table name for appointments
- `USERS_TABLE`: DynamoDB table name for users
- `AWS_REGION`: AWS region for deployment

## 💰 Cost Optimization

- Uses **PAY_PER_REQUEST** billing for DynamoDB (no minimum charges)
- **Lambda** only charges for actual usage
- **API Gateway** charges per request
- Estimated cost for low traffic: **$1-5/month**

## 🔗 Integration with Frontend

Your Vue.js frontend can connect to this API:

```javascript
// Apollo Client setup
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client/core";

const httpLink = createHttpLink({
  uri: "https://your-api-id.execute-api.ap-southeast-2.amazonaws.com/graphql",
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

## 🔧 Architecture

```
Vue.js Frontend (S3 + CloudFront)
         ↓
API Gateway + Lambda (GraphQL)
         ↓
DynamoDB Tables
```

## 📝 Next Steps

1. Add authentication (AWS Cognito)
2. Implement real-time subscriptions
3. Add input validation
4. Set up monitoring and alerts
5. Add automated testing
