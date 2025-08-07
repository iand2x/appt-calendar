import type { IAppointmentService } from "@/services/interfaces/IAppointmentService";
import { MockAppointmentsAPI } from "@/mockApi/appointmentsApi";
import type {
  Appointment,
  AppointmentFormData,
  AppointmentUpdateData,
} from "@/features/appointments/appointmentTypes";
import type { ApiResponse } from "@/types";

export class MockAppointmentService implements IAppointmentService {
  async getAppointmentsByUser(
    userEmail: string
  ): Promise<ApiResponse<Appointment[]>> {
    return MockAppointmentsAPI.getAppointmentsByUser(userEmail);
  }

  async getAllAppointments(): Promise<ApiResponse<Appointment[]>> {
    return MockAppointmentsAPI.getAllAppointments();
  }

  async createAppointment(
    appointmentData: AppointmentFormData,
    userEmail: string
  ): Promise<ApiResponse<Appointment>> {
    return MockAppointmentsAPI.createAppointment(appointmentData, userEmail);
  }

  async updateAppointment(
    id: string,
    updates: AppointmentUpdateData,
    userEmail: string,
    userRole?: string
  ): Promise<ApiResponse<Appointment>> {
    return MockAppointmentsAPI.updateAppointment(
      id,
      updates,
      userEmail,
      userRole
    );
  }

  async deleteAppointment(
    id: string,
    userEmail: string,
    userRole?: string
  ): Promise<ApiResponse<{ id: string }>> {
    return MockAppointmentsAPI.deleteAppointment(id, userEmail, userRole);
  }

  async getAppointmentsByDateRange(
    userEmail: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<Appointment[]>> {
    return MockAppointmentsAPI.getAppointmentsByDateRange(
      userEmail,
      startDate,
      endDate
    );
  }
}
