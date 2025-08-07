# Password Encryption Implementation

This document explains how password encryption and decryption is implemented across both Mock and GraphQL authentication services using bcrypt.

## Architecture Overview

The password handling is centralized in a shared utility class that both services use, ensuring consistency and security across different authentication backends.

### Core Components

1. **PasswordUtil** (`src/utils/PasswordUtil.ts`) - Centralized bcrypt utility
2. **MockAuthService** - Uses PasswordUtil for mock authentication
3. **GraphQLAuthService** - Uses PasswordUtil for GraphQL authentication
4. **IAuthService** - Interface defining password-related methods

## Password Security Features

### Hashing Algorithm

- **Algorithm**: bcrypt
- **Salt Rounds**: 12 (provides strong security)
- **Security Level**: Highly secure for production use

### Key Security Benefits

- **Salt-based hashing**: Each password gets a unique salt
- **Adaptive cost**: Salt rounds can be increased as computing power grows
- **Time-tested**: bcrypt is industry standard for password hashing
- **Brute-force resistant**: High computational cost makes attacks impractical

## Implementation Details

### PasswordUtil Class

```typescript
export class PasswordUtil {
  private static readonly saltRounds = 12;

  // Hash a plain text password
  static async hashPassword(plainPassword: string): Promise<string>;

  // Verify a password against its hash
  static async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean>;

  // Generate multiple hashed passwords for development
  static async generateHashedPasswords(
    passwords: Record<string, string>
  ): Promise<Record<string, string>>;

  // Log hashed passwords for development use
  static async logHashedPasswords(
    passwords: Record<string, string>
  ): Promise<void>;
}
```

### Service Integration

Both authentication services implement the same password-related methods:

```typescript
interface IAuthService {
  // Core authentication methods
  login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User; token: string }>>;
  getProfile(token: string): Promise<ApiResponse<User>>;
  getUsers(): Promise<ApiResponse<User[]>>;
  logout?(token: string): Promise<ApiResponse<boolean>>;
}
```

## Usage Examples

### 1. Direct Password Utility Usage

```typescript
import { PasswordUtil } from "@/utils/PasswordUtil";

// Hash a password
const hashedPassword = await PasswordUtil.hashPassword("myPassword123");

// Verify a password
const isValid = await PasswordUtil.verifyPassword(
  "myPassword123",
  hashedPassword
);
```

### 2. Through Mock Service

```typescript
import { AuthServiceFactory } from "@/services/AuthServiceFactory";

AuthServiceFactory.switchToMock();
const authService = AuthServiceFactory.getInstance();

// Verify password
const isValid = await authService.verifyPassword?.(
  "plainPassword123",
  hashedPassword
);
```

### 3. Through GraphQL Service

```typescript
import { AuthServiceFactory } from "@/services/AuthServiceFactory";

AuthServiceFactory.switchToGraphQL("http://localhost:3000/graphql");
const authService = AuthServiceFactory.getInstance();
```

## Password Flow

### Registration/User Creation Flow

1. **Input**: Plain text password from user
2. **Hashing**: PasswordUtil.hashPassword() with 12 salt rounds
3. **Storage**: Hashed password stored in database (never plain text)
4. **Response**: User object returned (without password in response)

### Login/Authentication Flow

1. **Input**: Plain text password from user
2. **Retrieval**: Hashed password retrieved from database
3. **Verification**: PasswordUtil.verifyPassword() compares plain text with hash
4. **Response**: Success/failure with user token if valid

### GraphQL Integration

When using GraphQL backend, passwords are:

- **Hashed on frontend** before sending to GraphQL server
- **Sent as hashed values** in GraphQL mutations
- **Verified on backend** using the same bcrypt algorithm

## Development Utilities

### Generate Test Passwords

```typescript
import { PasswordUtil } from "@/utils/PasswordUtil";

const passwords = {
  "admin@example.com": "adminPassword123",
  "tech@example.com": "techPassword456",
};

// Get hashed passwords for database seeding
const hashed = await PasswordUtil.generateHashedPasswords(passwords);

// Or log them for copying to code
await PasswordUtil.logHashedPasswords(passwords);
```

### Environment Configuration

Both services use the same password utilities regardless of environment:

```bash
# Mock API (default)
VITE_API_TYPE=mock

# GraphQL API
VITE_API_TYPE=graphql
VITE_GRAPHQL_ENDPOINT=http://localhost:3000/graphql
```

## Security Best Practices

### Implemented Security Measures

1. **Never store plain text passwords**
2. **Use strong salt rounds (12)**
3. **Hash passwords on client side before transmission**
4. **Implement proper error handling for password operations**
5. **Use time-tested bcrypt algorithm**

### Production Considerations

1. **Server-side hashing**: In production, consider hashing on server side for additional security
2. **Rate limiting**: Implement login attempt rate limiting
3. **Password complexity**: Enforce strong password requirements
4. **Audit logging**: Log authentication attempts for security monitoring

## Testing

### Unit Testing Password Functions

```typescript
import { PasswordUtil } from "@/utils/PasswordUtil";

describe("PasswordUtil", () => {
  test("should hash password correctly", async () => {
    const password = "testPassword123";
    const hash = await PasswordUtil.hashPassword(password);
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(50);
  });

  test("should verify correct password", async () => {
    const password = "testPassword123";
    const hash = await PasswordUtil.hashPassword(password);
    const isValid = await PasswordUtil.verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  test("should reject incorrect password", async () => {
    const password = "testPassword123";
    const wrongPassword = "wrongPassword456";
    const hash = await PasswordUtil.hashPassword(password);
    const isValid = await PasswordUtil.verifyPassword(wrongPassword, hash);
    expect(isValid).toBe(false);
  });
});
```

## Migration Guide

### From Plain Text to Hashed Passwords

If migrating from plain text passwords:

1. **Create migration script** using PasswordUtil.hashPassword()
2. **Update all existing passwords** in database
3. **Update login logic** to use bcrypt verification
4. **Test thoroughly** before production deployment

### Example Migration Script

```typescript
import { PasswordUtil } from "@/utils/PasswordUtil";

async function migratePasswords(users: User[]) {
  for (const user of users) {
    if (user.password && !user.password.startsWith("$2b$")) {
      // Only hash if not already hashed
      user.password = await PasswordUtil.hashPassword(user.password);
      // Update user in database
      await updateUserInDatabase(user);
    }
  }
}
```

This implementation ensures that password handling is secure, consistent, and easily maintainable across both Mock and GraphQL authentication services.
