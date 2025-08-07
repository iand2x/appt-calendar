import type { IAppointmentService } from "@/services/interfaces/IAppointmentService";
import type {
  Appointment,
  AppointmentFormData,
  AppointmentUpdateData,
} from "@/features/appointments/appointmentTypes";
import type { ApiResponse } from "@/types";

// GraphQL queries and mutations
const GRAPHQL_QUERIES = {
  GET_APPOINTMENTS_BY_USER: `
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
  `,

  GET_ALL_APPOINTMENTS: `
    query GetAllAppointments {
      appointments {
        id
        date
        dentist
        equipment
        notes
        createdBy
      }
    }
  `,

  GET_APPOINTMENTS_BY_DATE_RANGE: `
    query GetAppointmentsByDateRange($userEmail: String!, $startDate: String!, $endDate: String!) {
      appointmentsByDateRange(userEmail: $userEmail, startDate: $startDate, endDate: $endDate) {
        id
        date
        dentist
        equipment
        notes
        createdBy
      }
    }
  `,
};

const GRAPHQL_MUTATIONS = {
  CREATE_APPOINTMENT: `
    mutation CreateAppointment($input: CreateAppointmentInput!, $userEmail: String!) {
      createAppointment(input: $input, userEmail: $userEmail) {
        id
        date
        dentist
        equipment
        notes
        createdBy
      }
    }
  `,

  UPDATE_APPOINTMENT: `
    mutation UpdateAppointment($id: ID!, $input: UpdateAppointmentInput!, $userEmail: String!, $userRole: String) {
      updateAppointment(id: $id, input: $input, userEmail: $userEmail, userRole: $userRole) {
        id
        date
        dentist
        equipment
        notes
        createdBy
      }
    }
  `,

  DELETE_APPOINTMENT: `
    mutation DeleteAppointment($id: ID!, $userEmail: String!, $userRole: String) {
      deleteAppointment(id: $id, userEmail: $userEmail, userRole: $userRole)
    }
  `,
};

export class GraphQLAppointmentService implements IAppointmentService {
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
          // Add authentication headers if needed
          // 'Authorization': `Bearer ${token}`,
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

  async getAppointmentsByUser(
    userEmail: string
  ): Promise<ApiResponse<Appointment[]>> {
    const result = await this.makeGraphQLRequest<{
      appointmentsByUser: Appointment[];
    }>(GRAPHQL_QUERIES.GET_APPOINTMENTS_BY_USER, { userEmail });

    if (result.success) {
      return {
        ...result,
        data: result.data.appointmentsByUser,
      };
    }

    return {
      success: false,
      message: result.message,
      data: [],
    };
  }

  async getAllAppointments(): Promise<ApiResponse<Appointment[]>> {
    const result = await this.makeGraphQLRequest<{
      appointments: Appointment[];
    }>(GRAPHQL_QUERIES.GET_ALL_APPOINTMENTS);

    if (result.success) {
      return {
        ...result,
        data: result.data.appointments,
      };
    }

    return {
      success: false,
      message: result.message,
      data: [],
    };
  }

  async createAppointment(
    appointmentData: AppointmentFormData,
    userEmail: string
  ): Promise<ApiResponse<Appointment>> {
    const result = await this.makeGraphQLRequest<{
      createAppointment: Appointment;
    }>(GRAPHQL_MUTATIONS.CREATE_APPOINTMENT, {
      input: appointmentData,
      userEmail,
    });

    if (result.success) {
      return {
        ...result,
        data: result.data.createAppointment,
      };
    }

    return {
      success: false,
      message: result.message,
      data: {} as Appointment,
    };
  }

  async updateAppointment(
    id: string,
    updates: AppointmentUpdateData,
    userEmail: string,
    userRole?: string
  ): Promise<ApiResponse<Appointment>> {
    const result = await this.makeGraphQLRequest<{
      updateAppointment: Appointment;
    }>(GRAPHQL_MUTATIONS.UPDATE_APPOINTMENT, {
      id,
      input: updates,
      userEmail,
      userRole,
    });

    if (result.success) {
      return {
        ...result,
        data: result.data.updateAppointment,
      };
    }

    return {
      success: false,
      message: result.message,
      data: {} as Appointment,
    };
  }

  async deleteAppointment(
    id: string,
    userEmail: string,
    userRole?: string
  ): Promise<ApiResponse<{ id: string }>> {
    const result = await this.makeGraphQLRequest<boolean>(
      GRAPHQL_MUTATIONS.DELETE_APPOINTMENT,
      { id, userEmail, userRole }
    );

    if (result.success) {
      return {
        ...result,
        data: { id },
      };
    }

    return {
      success: false,
      message: result.message,
      data: { id: "" },
    };
  }

  async getAppointmentsByDateRange(
    userEmail: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<Appointment[]>> {
    const result = await this.makeGraphQLRequest<{
      appointmentsByDateRange: Appointment[];
    }>(GRAPHQL_QUERIES.GET_APPOINTMENTS_BY_DATE_RANGE, {
      userEmail,
      startDate,
      endDate,
    });

    if (result.success) {
      return {
        ...result,
        data: result.data.appointmentsByDateRange,
      };
    }

    return {
      success: false,
      message: result.message,
      data: [],
    };
  }
}
