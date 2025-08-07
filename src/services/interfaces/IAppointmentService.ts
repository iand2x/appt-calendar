import type {
  Appointment,
  AppointmentFormData,
} from "@/features/appointments/appointmentTypes";
import type { ApiResponse } from "@/types";

export interface IAppointmentService {
  // Get appointments for a specific user
  getAppointmentsByUser(userEmail: string): Promise<ApiResponse<Appointment[]>>;

  // Get all appointments (admin only)
  getAllAppointments(): Promise<ApiResponse<Appointment[]>>;

  // Create new appointment
  createAppointment(
    appointmentData: AppointmentFormData,
    userEmail: string
  ): Promise<ApiResponse<Appointment>>;

  // Update appointment
  updateAppointment(
    id: string,
    updates: Partial<AppointmentFormData>,
    userEmail: string
  ): Promise<ApiResponse<Appointment>>;

  // Delete appointment
  deleteAppointment(
    id: string,
    userEmail: string
  ): Promise<ApiResponse<{ id: string }>>;

  // Get appointments by date range
  getAppointmentsByDateRange(
    userEmail: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<Appointment[]>>;
}
