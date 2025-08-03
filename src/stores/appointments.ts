import { defineStore } from "pinia";
import { MockAppointmentsAPI } from "@/api/appointments";
import type {
  Appointment,
  AppointmentFormData,
} from "@/features/appointments/types";

export const useAppointmentStore = defineStore("appointments", {
  state: () => ({
    appointments: [] as Appointment[],
    isLoading: false,
    error: "",
  }),

  getters: {
    getAppointmentsForUser: (state) => {
      return (userEmail: string) =>
        state.appointments.filter((a) => a.createdBy === userEmail);
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
        const response = await MockAppointmentsAPI.getAppointmentsByUser(
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

    async addAppointment(
      appointmentData: AppointmentFormData,
      userEmail: string
    ) {
      this.isLoading = true;
      this.error = "";

      try {
        const response = await MockAppointmentsAPI.createAppointment(
          appointmentData,
          userEmail
        );

        if (response.success) {
          this.appointments.push(response.data);
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
      updates: Partial<AppointmentFormData>,
      userEmail: string
    ) {
      this.isLoading = true;
      this.error = "";

      try {
        const response = await MockAppointmentsAPI.updateAppointment(
          id,
          updates,
          userEmail
        );

        if (response.success) {
          const index = this.appointments.findIndex((a) => a.id === id);
          if (index !== -1) {
            this.appointments[index] = response.data;
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

    async deleteAppointment(id: string, userEmail: string) {
      this.isLoading = true;
      this.error = "";

      try {
        const response = await MockAppointmentsAPI.deleteAppointment(
          id,
          userEmail
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
