// Shared types used across multiple features
export interface User {
  id: string;
  username: string;
  email?: string;
  role?: "admin" | "technician";
  password: string;
}

// Common utility types
export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

// Common form states
export interface BaseFormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
}
