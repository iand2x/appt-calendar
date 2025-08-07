# Dental Equipment Calendar API

A serverless GraphQL API for managing dental equipment appointments and maintenance scheduling. Built with Apollo Server, AWS Lambda, and DynamoDB.

## 🚀 Features

- **GraphQL API** with Apollo Server and authentication
- **Serverless Architecture** using AWS Lambda
- **DynamoDB** for data persistence
- **JWT-based authentication** with bcrypt password hashing
- **Role-based access control** (admin, technician)
- **CORS enabled** with comprehensive header support for frontend integration
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

   This will start your API locally, simulating AWS Lambda and DynamoDB. The server will be available at `http://localhost:3001/graphql`.

2. **Local DynamoDB setup (optional, for full offline experience):**

   - Download DynamoDB Local from AWS: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html
   - Start DynamoDB Local:
     ```powershell
     java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
     ```

3. **GraphQL Playground** will be available at:

   - Local: `http://localhost:3001/graphql` (configured in serverless.yml)

4. **Seed sample data for local DynamoDB:**

   ```powershell
   npm run seed:offline
   ```

5. **View logs for offline server:**
   ```powershell
   # Note: Logs are visible in the terminal where you ran `npm run dev`
   # For deployed API logs:
   npm run logs
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

- **User**: System users with authentication (admin, technicians)
- **Appointment**: Equipment appointments and maintenance schedules
- **AuthPayload**: Authentication response with user and token

### Queries

```graphql
query {
  # Get all appointments
  appointments {
    id
    date
    dentist
    equipment
    notes
    createdBy
  }

  # Get appointments for specific user
  appointmentsByUser(userEmail: "tech@example.com") {
    id
    date
    dentist
    equipment
    notes
  }

  # Get appointments by date range
  appointmentsByDateRange(
    userEmail: "tech@example.com"
    startDate: "2024-01-01"
    endDate: "2024-01-31"
  ) {
    id
    date
    dentist
    equipment
  }

  # Get specific appointment
  getAppointment(id: "appt_001") {
    id
    date
    dentist
    equipment
    notes
    createdBy
  }

  # Get user profile (requires token)
  getProfile(token: "your-jwt-token") {
    id
    username
    email
    role
  }

  # Get all users
  getUsers {
    id
    username
    email
    role
    createdAt
  }
}
```

### Mutations

```graphql
mutation {
  # User authentication
  login(email: "admin@apptcalendar.com", password: "admin123") {
    success
    message
    user {
      id
      username
      email
      role
    }
    token
  }

  # Logout user
  logout(token: "your-jwt-token") {
    success
    message
  }

  # Create new equipment appointment
  createAppointment(
    input: {
      date: "2024-01-20T10:00:00Z"
      dentist: "Dr. Smith"
      equipment: "Scanner"
      notes: "Routine maintenance check"
    }
    userEmail: "tech@example.com"
  ) {
    id
    date
    dentist
    equipment
    notes
    createdBy
  }

  # Update appointment (user can only update their own, admin can update any)
  updateAppointment(
    id: "appt_001"
    input: { notes: "Updated notes", equipment: "Compressor" }
    userEmail: "tech@example.com"
    userRole: "technician"
  ) {
    id
    updatedAt
  }

  # Delete appointment (user can only delete their own, admin can delete any)
  deleteAppointment(
    id: "appt_001"
    userEmail: "tech@example.com"
    userRole: "technician"
  )
}
```

## 🗄️ Database Tables

### Appointments Table

- **Primary Key**: `id` (String)
- **Attributes**:
  - `date` (String) - ISO 8601 datetime
  - `dentist` (String) - Dentist name
  - `equipment` (String) - Equipment type (Compressor, Scanner, Suction Machine, Hygiene Equipment)
  - `notes` (String, optional) - Additional notes
  - `createdBy` (String) - User email who created the appointment
  - `createdAt` (String) - ISO 8601 timestamp
  - `updatedAt` (String) - ISO 8601 timestamp

### Users Table

- **Primary Key**: `id` (String)
- **Attributes**:
  - `username` (String) - User display name
  - `email` (String) - User email (unique)
  - `password` (String) - Bcrypt hashed password
  - `role` (String) - User role (admin, technician)
  - `createdAt` (String) - ISO 8601 timestamp

## 🌍 Environment Variables

The following environment variables are automatically set by Serverless:

- `APPOINTMENTS_TABLE`: DynamoDB table name for appointments (default: "AppointmentsTable")
- `USERS_TABLE`: DynamoDB table name for users (default: "UsersTable")
- `JWT_SECRET`: Secret key for JWT token generation (change in production!)
- `AWS_REGION`: AWS region for deployment (default: "ap-southeast-2")
- `IS_OFFLINE`: Set to "true" when running with serverless-offline

## 💰 Cost Optimization

- Uses **PAY_PER_REQUEST** billing for DynamoDB (no minimum charges)
- **Lambda** only charges for actual usage
- **API Gateway** charges per request
- Estimated cost for low traffic: **$1-5/month**

## 🔗 Integration with Frontend

Your Vue.js frontend can connect to this API using GraphQL:

```javascript
// Example GraphQL queries
const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      message
      user {
        id
        username
        email
        role
      }
      token
    }
  }
`;

const GET_APPOINTMENTS = `
  query GetAppointmentsByUser($userEmail: String!) {
    appointmentsByUser(userEmail: $userEmail) {
      id
      date
      dentist
      equipment
      notes
      createdBy
    }
  }
`;

const CREATE_APPOINTMENT = `
  mutation CreateAppointment($input: CreateAppointmentInput!, $userEmail: String!) {
    createAppointment(input: $input, userEmail: $userEmail) {
      id
      date
      dentist
      equipment
      notes
    }
  }
`;
```

## � Key Dependencies

### Production Dependencies

- **@apollo/server** - GraphQL server implementation
- **@as-integrations/aws-lambda** - Apollo Server integration for AWS Lambda
- **@aws-sdk/client-dynamodb** & **@aws-sdk/lib-dynamodb** - AWS DynamoDB SDK
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation and verification
- **graphql** - GraphQL implementation

### Development Dependencies

- **serverless** - Serverless Framework for deployment
- **serverless-offline** - Local development server
- **cross-env** - Cross-platform environment variables

## �🔧 Equipment Types

The system supports scheduling for the following dental equipment:

- **Compressor** - Air compressor units for dental tools
- **Suction Machine** - Dental suction systems
- **Scanner** - 3D dental scanners and imaging equipment
- **Hygiene Equipment** - Ultrasonic scalers and cleaning tools

## 🔧 Architecture

```
Vue.js Frontend (Vite + TypeScript)
         ↓
API Gateway + Lambda (GraphQL with JWT Auth)
         ↓
DynamoDB Tables (Appointments + Users)
```

## 👥 Default Users

The seed data includes these default users:

- **Admin**: `admin@apptcalendar.com` / `admin123`
- **Technician**: `tech1@apptcalendar.com` / `tech123`

## � Troubleshooting

### CORS Issues

If you encounter CORS errors when calling the API from a frontend application:

1. **Verify the API Gateway CORS configuration** is properly deployed:

   ```powershell
   npm run deploy
   ```

2. **Check the API endpoint URL** - ensure you're using the correct deployed URL, not localhost

3. **For development**, make sure your frontend is sending requests to the correct endpoint:

   - Local: `http://localhost:3001/graphql`
   - Deployed: `https://your-api-id.execute-api.ap-southeast-2.amazonaws.com/graphql`

4. **Common CORS headers** are automatically handled:

   - `Content-Type`
   - `Authorization`
   - `X-Api-Key`

5. **Check CloudWatch logs** for any Lambda errors that might cause non-2xx responses:
   ```powershell
   npm run logs
   ```

### GraphQL Debugging

- **Introspection is enabled** for all environments to help with debugging
- Use GraphQL Playground or any GraphQL client to test queries
- Check the Lambda logs for detailed error messages

## �📝 Next Steps

1. ✅ Add JWT authentication with bcrypt password hashing
2. ✅ Implement role-based access control
3. ✅ Add user profile management
4. Add input validation and sanitization
5. Implement real-time subscriptions for appointment updates
6. Set up monitoring and alerts
7. Add automated testing
8. Add equipment availability checking
9. Implement appointment conflict detection
10. Add email notifications for appointments
