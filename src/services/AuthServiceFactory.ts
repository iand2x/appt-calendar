import type { IAuthService } from "@/services/interfaces/IAuthService";
import { MockAuthService } from "@/services/implementations/MockAuthService";
import { GraphQLAuthService } from "@/services/implementations/GraphQLAuthService";

export class AuthServiceFactory {
  private static instance: IAuthService | null = null;

  static getInstance(): IAuthService {
    if (!this.instance) {
      this.instance = this.createService();
    }
    return this.instance;
  }

  static createService(): IAuthService {
    const apiType = import.meta.env.VITE_API_TYPE || "mock";

    switch (apiType.toLowerCase()) {
      case "graphql":
        return new GraphQLAuthService();
      case "mock":
      default:
        return new MockAuthService();
    }
  }

  static switchToMock(): void {
    this.instance = new MockAuthService();
  }

  static switchToGraphQL(endpoint?: string): void {
    this.instance = new GraphQLAuthService(endpoint);
  }

  static reset(): void {
    this.instance = null;
  }
}
