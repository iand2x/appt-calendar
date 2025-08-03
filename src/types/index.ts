// Only export truly shared types that are used across multiple features
export * from "./shared";

// Feature-specific types should be imported directly from their feature folders
// Example:
// import type { Appointment } from '@/features/appointments/appointmentTypes'
// import type { LoginCredentials } from '@/features/auth/authTypes'
