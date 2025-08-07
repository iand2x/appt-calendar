import type { IAuthService } from "@/services/interfaces/IAuthService";
import { MockAuthAPI } from "@/mockApi/authApi";
import { PasswordUtil } from "@/utils/PasswordUtil";
import type { User, ApiResponse } from "@/types";
import type { LoginCredentials } from "@/features/auth/authTypes";

export class MockAuthService implements IAuthService {
  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    return MockAuthAPI.login(credentials);
  }

  async getProfile(token: string): Promise<ApiResponse<User>> {
    return MockAuthAPI.getProfile(token);
  }

  async getUsers(): Promise<ApiResponse<User[]>> {
    return MockAuthAPI.getUsers();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async logout(_token: string): Promise<ApiResponse<boolean>> {
    // Mock logout - just return success
    return {
      success: true,
      message: "Logged out successfully",
      data: true,
    };
  }

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return PasswordUtil.verifyPassword(plainPassword, hashedPassword);
  }

  async hashPassword(plainPassword: string): Promise<string> {
    return PasswordUtil.hashPassword(plainPassword);
  }
}
