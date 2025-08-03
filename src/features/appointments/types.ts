// Appointment feature types - only used within appointment functionality
export interface Appointment {
  id: string;
  date: string;
  dentist: string;
  equipment: string;
  notes?: string;
  createdBy: string;
}

export type AppointmentFormData = Omit<Appointment, "id">;
export type AppointmentUpdateData = Partial<Omit<Appointment, "id">>;

// Component-specific types (keep local when only used in one component)
export interface AppointmentListProps {
  appointments: Appointment[];
  showActions?: boolean;
}

export interface AppointmentFormProps {
  initialData?: Partial<AppointmentFormData>;
  isEditing?: boolean;
}
