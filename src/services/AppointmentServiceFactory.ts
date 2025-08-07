import type { IAppointmentService } from "@/services/interfaces/IAppointmentService";
import { MockAppointmentService } from "@/services/implementations/MockAppointmentService";
import { GraphQLAppointmentService } from "@/services/implementations/GraphQLAppointmentService";

// Service types
export type ServiceType = "mock" | "graphql";

// Configuration interface
export interface ServiceConfig {
  type: ServiceType;
  graphqlEndpoint?: string;
}

export class AppointmentServiceFactory {
  private static instance: IAppointmentService | null = null;
  private static currentConfig: ServiceConfig | null = null;

  static configure(config: ServiceConfig): void {
    // Only recreate service if config has changed
    if (
      !this.currentConfig ||
      this.currentConfig.type !== config.type ||
      this.currentConfig.graphqlEndpoint !== config.graphqlEndpoint
    ) {
      this.currentConfig = config;
      this.instance = this.createService(config);
    }
  }

  static getInstance(): IAppointmentService {
    if (!this.instance) {
      // Default to mock service if not configured
      const defaultConfig: ServiceConfig = {
        type: this.getDefaultServiceType(),
      };
      this.configure(defaultConfig);
    }

    return this.instance!;
  }

  private static createService(config: ServiceConfig): IAppointmentService {
    switch (config.type) {
      case "mock":
        return new MockAppointmentService();
      case "graphql":
        return new GraphQLAppointmentService(config.graphqlEndpoint);
      default:
        throw new Error(`Unknown service type: ${config.type}`);
    }
  }

  private static getDefaultServiceType(): ServiceType {
    // Check environment variable or use mock as default
    const envServiceType = import.meta.env.VITE_API_TYPE as ServiceType;
    return envServiceType === "graphql" ? "graphql" : "mock";
  }

  // Helper method to switch services at runtime
  static switchToMock(): void {
    this.configure({ type: "mock" });
  }

  static switchToGraphQL(endpoint?: string): void {
    this.configure({
      type: "graphql",
      graphqlEndpoint: endpoint,
    });
  }

  // Helper to check current service type
  static getCurrentServiceType(): ServiceType | null {
    return this.currentConfig?.type || null;
  }
}
