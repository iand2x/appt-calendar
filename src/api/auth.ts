// Mock API service to simulate backend authentication
import type { User, ApiResponse } from "@/types";
import type { LoginCredentials } from "@/features/auth/types";

// Mock user database
const mockUsers: User[] = [
  {
    id: "1",
    username: "john_tech",
    email: "tech@example.com",
    role: "technician",
  },
  {
    id: "2",
    username: "dr_smith",
    email: "dr.smith@clinic.com",
    role: "dentist",
  },
  {
    id: "3",
    username: "admin_user",
    email: "admin@clinic.com",
    role: "admin",
  },
];

// Mock password storage (in real app, this would be hashed in backend)
const mockPasswords: Record<string, string> = {
  "tech@example.com": "password123",
  "dr.smith@clinic.com": "dentist456",
  "admin@clinic.com": "admin789",
};

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

    // Check password
    if (mockPasswords[email] !== password) {
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

  // Get all users (for admin)
  static async getUsers(): Promise<ApiResponse<User[]>> {
    await delay(500);

    return {
      success: true,
      message: "Users fetched successfully",
      data: mockUsers,
    };
  }
}
