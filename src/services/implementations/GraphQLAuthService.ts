import type { IAuthService } from "@/services/interfaces/IAuthService";
import type { User, ApiResponse } from "@/types";
import type { LoginCredentials } from "@/features/auth/authTypes";
import { PasswordUtil } from "@/utils/PasswordUtil";

// GraphQL queries and mutations for authentication
const AUTH_GRAPHQL_QUERIES = {
  GET_USERS: `
    query GetUsers {
      getUsers {
        id
        username
        email
        role
        createdAt
      }
    }
  `,

  GET_PROFILE: `
    query GetProfile($token: String!) {
      getProfile(token: $token) {
        id
        username
        email
        role
        createdAt
      }
    }
  `,
};

const AUTH_GRAPHQL_MUTATIONS = {
  LOGIN: `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        success
        message
        user {
          id
          username
          email
          role
          createdAt
        }
        token
      }
    }
  `,

  LOGOUT: `
    mutation Logout($token: String!) {
      logout(token: $token) {
        success
        message
      }
    }
  `,
};

export class GraphQLAuthService implements IAuthService {
  private graphqlEndpoint: string;

  constructor(endpoint?: string) {
    this.graphqlEndpoint =
      endpoint ||
      import.meta.env.VITE_GRAPHQL_ENDPOINT ||
      "http://localhost:3000/graphql";
  }

  private async makeGraphQLRequest<T>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.graphqlEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        return {
          success: false,
          message: result.errors[0]?.message || "GraphQL error occurred",
          data: {} as T,
        };
      }

      return {
        success: true,
        message: "Operation successful",
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Network error occurred",
        data: {} as T,
      };
    }
  }

  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    const result = await this.makeGraphQLRequest<{
      login: {
        success: boolean;
        message: string;
        user: User;
        token: string;
      };
    }>(AUTH_GRAPHQL_MUTATIONS.LOGIN, {
      email: credentials.email,
      password: credentials.password,
    });

    if (result.success && result.data.login) {
      const loginData = result.data.login;

      if (loginData.success) {
        return {
          success: true,
          message: loginData.message,
          data: {
            user: loginData.user,
            token: loginData.token,
          },
        };
      } else {
        return {
          success: false,
          message: loginData.message,
          data: {} as { user: User; token: string },
        };
      }
    }

    return {
      success: false,
      message: result.message,
      data: {} as { user: User; token: string },
    };
  }

  async getProfile(token: string): Promise<ApiResponse<User>> {
    const result = await this.makeGraphQLRequest<{
      getProfile: User;
    }>(AUTH_GRAPHQL_QUERIES.GET_PROFILE, { token });

    if (result.success) {
      return {
        ...result,
        data: result.data.getProfile,
      };
    }

    return {
      success: false,
      message: result.message,
      data: {} as User,
    };
  }

  async getUsers(): Promise<ApiResponse<User[]>> {
    const result = await this.makeGraphQLRequest<{
      getUsers: User[];
    }>(AUTH_GRAPHQL_QUERIES.GET_USERS);

    if (result.success) {
      return {
        ...result,
        data: result.data.getUsers,
      };
    }

    return {
      success: false,
      message: result.message,
      data: [],
    };
  }

  async logout(token: string): Promise<ApiResponse<boolean>> {
    const result = await this.makeGraphQLRequest<{
      logout: {
        success: boolean;
        message: string;
      };
    }>(AUTH_GRAPHQL_MUTATIONS.LOGOUT, { token });

    if (result.success && result.data.logout) {
      return {
        success: result.data.logout.success,
        message: result.data.logout.message,
        data: result.data.logout.success,
      };
    }

    return {
      success: false,
      message: result.message,
      data: false,
    };
  }

  /**
   * Verify a password against its hash (utility method)
   * @param plainPassword - Plain text password
   * @param hashedPassword - Hashed password to compare against
   * @returns Promise<boolean>
   */
  async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await PasswordUtil.verifyPassword(plainPassword, hashedPassword);
  }

  /**
   * Hash a password (utility method)
   * @param plainPassword - Plain text password to hash
   * @returns Promise<string>
   */
  async hashPassword(plainPassword: string): Promise<string> {
    return await PasswordUtil.hashPassword(plainPassword);
  }
}
