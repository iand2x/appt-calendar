// Import shared types
import type { User } from "@/types/shared";

// Re-export for convenience
export type { User };

// Auth feature types - only used within authentication functionality
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Component-specific auth types
export interface LoginFormState {
  email: string;
  password: string;
  isSubmitting: boolean;
  errors: Record<string, string>;
}
