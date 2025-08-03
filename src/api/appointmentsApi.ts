// Mock Appointments API service
import type {
  Appointment,
  AppointmentFormData,
} from "@/features/appointments/types";
import type { ApiResponse } from "@/types";

// Mock appointments database - organized by user email
const mockAppointments: Record<string, Appointment[]> = {
  "tech@example.com": [
    {
      id: "1",
      date: "2025-08-05T09:00",
      dentist: "Dr. Johnson",
      equipment: "Compressor",
      notes: "Regular maintenance check on air compressor unit 1",
      createdBy: "tech@example.com",
    },
    {
      id: "2",
      date: "2025-08-05T14:30",
      dentist: "Dr. Martinez",
      equipment: "Suction Machine",
      notes: "Suction pump making unusual noise - needs inspection",
      createdBy: "tech@example.com",
    },
    {
      id: "3",
      date: "2025-08-06T11:15",
      dentist: "Dr. Wilson",
      equipment: "Scanner",
      notes: "Calibration needed for 3D scanner in room 3",
      createdBy: "tech@example.com",
    },
    {
      id: "4",
      date: "2025-08-07T08:45",
      dentist: "Dr. Brown",
      equipment: "Hygiene Equipment",
      notes: "Ultrasonic scaler replacement and testing",
      createdBy: "tech@example.com",
    },
  ],
  "dr.smith@clinic.com": [
    {
      id: "5",
      date: "2025-08-05T10:30",
      dentist: "Dr. Smith",
      equipment: "Scanner",
      notes: "Pre-appointment scanner setup for crown fitting",
      createdBy: "dr.smith@clinic.com",
    },
    {
      id: "6",
      date: "2025-08-05T16:00",
      dentist: "Dr. Smith",
      equipment: "Compressor",
      notes: "Air pressure adjustment for precise drilling",
      createdBy: "dr.smith@clinic.com",
    },
    {
      id: "7",
      date: "2025-08-06T13:30",
      dentist: "Dr. Smith",
      equipment: "Hygiene Equipment",
      notes: "Equipment prep for deep cleaning procedures",
      createdBy: "dr.smith@clinic.com",
    },
  ],
  "admin@clinic.com": [
    {
      id: "8",
      date: "2025-08-05T08:00",
      dentist: "All Departments",
      equipment: "Compressor",
      notes: "Monthly maintenance review - all compressor units",
      createdBy: "admin@clinic.com",
    },
    {
      id: "9",
      date: "2025-08-06T09:30",
      dentist: "Equipment Team",
      equipment: "Suction Machine",
      notes: "Budget review for suction machine upgrades",
      createdBy: "admin@clinic.com",
    },
    {
      id: "10",
      date: "2025-08-07T15:00",
      dentist: "Technical Staff",
      equipment: "Scanner",
      notes: "Training session on new scanner software updates",
      createdBy: "admin@clinic.com",
    },
    {
      id: "11",
      date: "2025-08-08T10:00",
      dentist: "All Staff",
      equipment: "Hygiene Equipment",
      notes: "Safety protocol review for all hygiene equipment",
      createdBy: "admin@clinic.com",
    },
  ],
};

// Counter for generating new appointment IDs
let appointmentIdCounter = 12;

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockAppointmentsAPI {
  // Get appointments for a specific user
  static async getAppointmentsByUser(
    userEmail: string
  ): Promise<ApiResponse<Appointment[]>> {
    await delay(600);

    const userAppointments = mockAppointments[userEmail] || [];

    // Sort by date (newest first)
    const sortedAppointments = [...userAppointments].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      success: true,
      message: "Appointments fetched successfully",
      data: sortedAppointments,
    };
  }

  // Get all appointments (admin only)
  static async getAllAppointments(): Promise<ApiResponse<Appointment[]>> {
    await delay(800);

    const allAppointments = Object.values(mockAppointments).flat();

    // Sort by date
    const sortedAppointments = allAppointments.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      success: true,
      message: "All appointments fetched successfully",
      data: sortedAppointments,
    };
  }

  // Create new appointment
  static async createAppointment(
    appointmentData: AppointmentFormData,
    userEmail: string
  ): Promise<ApiResponse<Appointment>> {
    await delay(400);

    const newAppointment: Appointment = {
      id: (appointmentIdCounter++).toString(),
      ...appointmentData,
      createdBy: userEmail,
    };

    // Add to mock database
    if (!mockAppointments[userEmail]) {
      mockAppointments[userEmail] = [];
    }
    mockAppointments[userEmail].push(newAppointment);

    return {
      success: true,
      message: "Appointment created successfully",
      data: newAppointment,
    };
  }

  // Update appointment
  static async updateAppointment(
    id: string,
    updates: Partial<AppointmentFormData>,
    userEmail: string
  ): Promise<ApiResponse<Appointment>> {
    await delay(400);

    const userAppointments = mockAppointments[userEmail] || [];
    const appointmentIndex = userAppointments.findIndex((apt) => apt.id === id);

    if (appointmentIndex === -1) {
      return {
        success: false,
        message: "Appointment not found",
        data: {} as Appointment,
      };
    }

    // Update the appointment
    const updatedAppointment = {
      ...userAppointments[appointmentIndex],
      ...updates,
    };
    mockAppointments[userEmail][appointmentIndex] = updatedAppointment;

    return {
      success: true,
      message: "Appointment updated successfully",
      data: updatedAppointment,
    };
  }

  // Delete appointment
  static async deleteAppointment(
    id: string,
    userEmail: string
  ): Promise<ApiResponse<{ id: string }>> {
    await delay(300);

    const userAppointments = mockAppointments[userEmail] || [];
    const appointmentIndex = userAppointments.findIndex((apt) => apt.id === id);

    if (appointmentIndex === -1) {
      return {
        success: false,
        message: "Appointment not found",
        data: {} as { id: string },
      };
    }

    // Remove the appointment
    mockAppointments[userEmail].splice(appointmentIndex, 1);

    return {
      success: true,
      message: "Appointment deleted successfully",
      data: { id },
    };
  }

  // Get appointments by date range
  static async getAppointmentsByDateRange(
    userEmail: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<Appointment[]>> {
    await delay(500);

    const userAppointments = mockAppointments[userEmail] || [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredAppointments = userAppointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate >= start && aptDate <= end;
    });

    return {
      success: true,
      message: "Appointments filtered by date range",
      data: filteredAppointments,
    };
  }
}
