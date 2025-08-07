# GraphQL Integration Setup

This project is now prepared for easy switching between Mock API and GraphQL API services.

## Architecture

### Service Layer Structure

```
src/services/
├── interfaces/
│   └── IAppointmentService.ts     # Service interface
├── implementations/
│   ├── MockAppointmentService.ts  # Mock API implementation
│   └── GraphQLAppointmentService.ts # GraphQL API implementation
└── AppointmentServiceFactory.ts   # Service factory for switching
```

### Key Components

1. **Service Interface** (`IAppointmentService`): Defines the contract for all appointment services
2. **Mock Service**: Wraps the existing mock API
3. **GraphQL Service**: Ready-to-use GraphQL implementation
4. **Service Factory**: Manages service instantiation and switching
5. **Composable**: Vue composable for easy service management

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Mock API (default)
VITE_API_TYPE=mock

# GraphQL API
VITE_API_TYPE=graphql
VITE_GRAPHQL_ENDPOINT=http://localhost:3000/graphql
```

### Production GraphQL Setup

```bash
VITE_API_TYPE=graphql
VITE_GRAPHQL_ENDPOINT=https://your-lambda-endpoint.amazonaws.com/graphql
```

## Usage

### Automatic Service Selection

The service is automatically configured based on environment variables when the app starts.

## GraphQL Queries & Mutations

The GraphQL service includes pre-defined queries and mutations:

### Queries

- `appointmentsByUser(userEmail: String!)`: Get appointments for a user
- `appointments`: Get all appointments (admin)
- `appointmentsByDateRange(userEmail: String!, startDate: String!, endDate: String!)`: Filter by date range

### Mutations

- `createAppointment(input: CreateAppointmentInput!, userEmail: String!)`: Create appointment
- `updateAppointment(id: ID!, input: UpdateAppointmentInput!, userEmail: String!)`: Update appointment
- `deleteAppointment(id: ID!, userEmail: String!)`: Delete appointment

## Migration Steps

### From Mock to GraphQL

1. Set environment variable: `VITE_API_TYPE=graphql`
2. Set GraphQL endpoint: `VITE_GRAPHQL_ENDPOINT=your-endpoint`
3. Restart the application
4. All existing functionality will work with GraphQL backend

### Backend Requirements

Your GraphQL server should implement the following schema:

```graphql
type Appointment {
  id: ID!
  date: String!
  dentist: String!
  equipment: String!
  notes: String
  createdBy: String!
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
  appointmentsByUser(userEmail: String!): [Appointment!]!
  appointments: [Appointment!]!
  appointmentsByDateRange(
    userEmail: String!
    startDate: String!
    endDate: String!
  ): [Appointment!]!
}

type Mutation {
  createAppointment(
    input: CreateAppointmentInput!
    userEmail: String!
  ): Appointment!
  updateAppointment(
    id: ID!
    input: UpdateAppointmentInput!
    userEmail: String!
  ): Appointment!
  deleteAppointment(id: ID!, userEmail: String!): Boolean!
}
```

## Benefits

1. **Zero Component Changes**: All Vue components remain unchanged
2. **Easy Switching**: Change service with environment variables or at runtime
3. **Type Safety**: Full TypeScript support for both services
4. **Consistent Interface**: Same API contract regardless of backend
5. **Development Flexibility**: Switch between services during development
6. **Production Ready**: GraphQL service ready for production deployment

## Testing

Both services can be tested independently:

```typescript
// Test mock service
AppointmentServiceFactory.configure({ type: "mock" });

// Test GraphQL service
AppointmentServiceFactory.configure({
  type: "graphql",
  graphqlEndpoint: "http://test-endpoint/graphql",
});
```

The abstraction layer ensures consistent behavior across both implementations.
