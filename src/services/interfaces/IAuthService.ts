import type { User, ApiResponse } from "@/types";
import type { LoginCredentials } from "@/features/auth/authTypes";

export interface IAuthService {
  // Login user
  login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User; token: string }>>;

  // Get user profile by token
  getProfile(token: string): Promise<ApiResponse<User>>;

  // Get all users
  getUsers(): Promise<ApiResponse<User[]>>;

  // Logout user (optional, mainly for cleanup)
  logout?(token: string): Promise<ApiResponse<boolean>>;

  // Utility methods for password handling
  verifyPassword?(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  hashPassword?(plainPassword: string): Promise<string>;
}
