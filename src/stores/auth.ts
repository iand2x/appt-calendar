import { defineStore } from "pinia";
import { MockAuthAPI } from "@/api/auth";
import type { User } from "@/types";
import type { LoginCredentials } from "@/features/auth/types";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    token: "",
    isLoading: false,
    error: "",
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated && !!state.token,
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.isLoading = true;
      this.error = "";

      try {
        const response = await MockAuthAPI.login(credentials);

        if (response.success) {
          this.user = response.data.user;
          this.token = response.data.token;
          this.isAuthenticated = true;

          // Store in localStorage for persistence
          localStorage.setItem("auth_token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          return { success: true, message: response.message };
        } else {
          this.error = response.message || "Login failed";
          return { success: false, message: response.message };
        }
      } catch {
        this.error = "Network error occurred";
        return { success: false, message: "Network error occurred" };
      } finally {
        this.isLoading = false;
      }
    },

    async loadStoredAuth() {
      const token = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          // Verify token is still valid
          const response = await MockAuthAPI.getProfile(token);

          if (response.success) {
            this.user = response.data;
            this.token = token;
            this.isAuthenticated = true;
          } else {
            // Token invalid, clear storage
            this.clearAuth();
          }
        } catch {
          this.clearAuth();
        }
      }
    },

    logout() {
      this.clearAuth();
    },

    clearAuth() {
      this.user = null;
      this.token = "";
      this.isAuthenticated = false;
      this.error = "";

      // Clear localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    },
  },
});
