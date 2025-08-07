import { defineStore } from "pinia";
import { AppointmentServiceFactory } from "@/services/AppointmentServiceFactory";
import type {
  Appointment,
  AppointmentFormData,
  AppointmentUpdateData,
} from "@/features/appointments/appointmentTypes";

export const useAppointmentStore = defineStore("appointments", {
  state: () => ({
    appointments: [] as Appointment[],
    isLoading: false,
    error: "",
  }),

  getters: {
    getAppointmentsForUser: (state) => {
      return (userEmail: string) =>
        state.appointments
          .filter((a) => a.createdBy === userEmail)
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
    },

    appointmentsByDate: (state) => {
      return [...state.appointments].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    },
  },

  actions: {
    async fetchAppointments(userEmail: string) {
      this.isLoading = true;
      this.error = "";

      try {
        const appointmentService = AppointmentServiceFactory.getInstance();
        const response = await appointmentService.getAppointmentsByUser(
          userEmail
        );

        if (response.success) {
          this.appointments = response.data;
        } else {
          this.error = response.message || "Failed to fetch appointments";
        }
      } catch {
        this.error = "Network error occurred";
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAllAppointments() {
      this.isLoading = true;
      this.error = "";

      try {
        const appointmentService = AppointmentServiceFactory.getInstance();
        const response = await appointmentService.getAllAppointments();

        if (response.success) {
          this.appointments = response.data;
        } else {
          this.error = response.message || "Failed to fetch all appointments";
        }
      } catch {
        this.error = "Network error occurred";
      } finally {
        this.isLoading = false;
      }
    },

    async addAppointment(
      appointmentData: AppointmentFormData,
      userEmail: string
    ) {
      this.isLoading = true;
      this.error = "";

      try {
        const appointmentService = AppointmentServiceFactory.getInstance();
        const response = await appointmentService.createAppointment(
          appointmentData,
          userEmail
        );

        if (response.success) {
          this.appointments.push(response.data);
          // Sort the array to maintain date order
          this.appointments.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          return { success: true, message: response.message };
        } else {
          this.error = response.message || "Failed to create appointment";
          return { success: false, message: response.message };
        }
      } catch {
        this.error = "Network error occurred";
        return { success: false, message: "Network error occurred" };
      } finally {
        this.isLoading = false;
      }
    },

    async updateAppointment(
      id: string,
      updates: AppointmentUpdateData,
      userEmail: string,
      userRole?: string
    ) {
      this.isLoading = true;
      this.error = "";

      try {
        const appointmentService = AppointmentServiceFactory.getInstance();
        const response = await appointmentService.updateAppointment(
          id,
          updates,
          userEmail,
          userRole
        );

        if (response.success) {
          const index = this.appointments.findIndex((a) => a.id === id);
          if (index !== -1) {
            this.appointments[index] = response.data;
            // Re-sort the array after update to maintain date order
            this.appointments.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );
          }
          return { success: true, message: response.message };
        } else {
          this.error = response.message || "Failed to update appointment";
          return { success: false, message: response.message };
        }
      } catch {
        this.error = "Network error occurred";
        return { success: false, message: "Network error occurred" };
      } finally {
        this.isLoading = false;
      }
    },

    async deleteAppointment(id: string, userEmail: string, userRole?: string) {
      this.isLoading = true;
      this.error = "";

      try {
        const appointmentService = AppointmentServiceFactory.getInstance();
        const response = await appointmentService.deleteAppointment(
          id,
          userEmail,
          userRole
        );

        if (response.success) {
          this.appointments = this.appointments.filter((a) => a.id !== id);
          return { success: true, message: response.message };
        } else {
          this.error = response.message || "Failed to delete appointment";
          return { success: false, message: response.message };
        }
      } catch {
        this.error = "Network error occurred";
        return { success: false, message: "Network error occurred" };
      } finally {
        this.isLoading = false;
      }
    },

    clearAppointments() {
      this.appointments = [];
      this.error = "";
    },
  },
});
