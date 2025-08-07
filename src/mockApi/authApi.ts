// Mock API service to simulate backend authentication
import type { User, ApiResponse } from "@/types";
import type { LoginCredentials } from "@/features/auth/authTypes";
import { PasswordUtil } from "@/utils/PasswordUtil";

// Function to generate new hashed passwords (for development/testing)
// Usage: Call this function when you need to add new users or change passwords
// Example: (paste directly in browser console)
// import("./src/mockApi/authApi.ts").then((module) => {
//   module.generateHashedPasswords();
// });
async function generateHashedPasswords() {
  const passwords = {
    "tech@example.com": "password123",
    "admin@clinic.com": "admin789",
    "admin@apptcalendar.com": "admin123",
    "tech1@apptcalendar.com": "tech123",
  };

  await PasswordUtil.logHashedPasswords(passwords);
}

// Mock user database
const mockUsers: User[] = [
  {
    id: "1",
    username: "john_tech",
    email: "tech@example.com",
    role: "technician",
    password: "$2b$12$Nww9ND23o0JQP/sQvMeUG.oigENGCpUAYp3bxA3ey0uvHlxNUejNe",
  },
  {
    id: "2",
    username: "admin_user",
    email: "admin@clinic.com",
    role: "admin",
    password: "$2b$12$AFDKda8W8kulqEgcAVIinu.Mvr3/NqHHEWzpKzhEbxWDvcf/a8UQK",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockAuthAPI {
  // Simulate login API call
  static async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    // Simulate network delay
    await delay(800);

    const { email, password } = credentials;

    // Find user by email
    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      return {
        success: false,
        message: "User not found",
        data: {} as { user: User; token: string },
      };
    }

    // Check password against hashed version
    const hashedPassword = user.password;
    if (!hashedPassword) {
      return {
        success: false,
        message: "User configuration error",
        data: {} as { user: User; token: string },
      };
    }

    const isPasswordValid = await PasswordUtil.verifyPassword(
      password,
      hashedPassword
    );
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid password",
        data: {} as { user: User; token: string },
      };
    }

    // Generate mock token
    const token = `mock_token_${user.id}_${Date.now()}`;

    return {
      success: true,
      message: "Login successful",
      data: {
        user,
        token,
      },
    };
  }

  // Simulate user profile fetch
  static async getProfile(token: string): Promise<ApiResponse<User>> {
    await delay(300);

    // Extract user ID from mock token
    const userId = token.split("_")[2];
    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return {
        success: false,
        message: "Invalid token",
        data: {} as User,
      };
    }

    return {
      success: true,
      message: "Profile fetched successfully",
      data: user,
    };
  }

  // Get all users
  static async getUsers(): Promise<ApiResponse<User[]>> {
    await delay(500);

    return {
      success: true,
      message: "Users fetched successfully",
      data: mockUsers,
    };
  }

  // Utility method to generate hashed passwords (for development)
  static async generateHashedPassword(plainPassword: string): Promise<string> {
    return await PasswordUtil.hashPassword(plainPassword);
  }

  // Utility method to verify passwords (for testing)
  static async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await PasswordUtil.verifyPassword(plainPassword, hashedPassword);
  }
}

// Export utility for external use
export { generateHashedPasswords };
