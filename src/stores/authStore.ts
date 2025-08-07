import { defineStore } from "pinia";
import { AuthServiceFactory } from "@/services/AuthServiceFactory";
import { SecurityUtils } from "@/utils/security";
import type { User } from "@/types";
import type { LoginCredentials } from "@/features/auth/authTypes";

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
        const authService = AuthServiceFactory.getInstance();
        const response = await authService.login(credentials);

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
        // Run security validation first
        if (!SecurityUtils.validateStoredAuth()) {
          SecurityUtils.logSecurityEvent("Invalid stored auth detected", {
            hasToken: !!token,
            hasUser: !!storedUser,
          });
          this.clearAuth();
          return;
        }

        try {
          // Basic token format validation for mock tokens
          if (
            !token.startsWith("mock_token_") ||
            token.split("_").length !== 4
          ) {
            SecurityUtils.logSecurityEvent("Invalid token format", {
              tokenPrefix: token.substring(0, 10),
            });
            this.clearAuth();
            return;
          }

          // Verify token is still valid
          const authService = AuthServiceFactory.getInstance();
          const response = await authService.getProfile(token);

          if (response.success) {
            // Verify the stored user data matches the API response
            const parsedUser = JSON.parse(storedUser);
            if (
              parsedUser.id === response.data.id &&
              parsedUser.email === response.data.email
            ) {
              this.user = response.data;
              this.token = token;
              this.isAuthenticated = true;
              SecurityUtils.logSecurityEvent("Auth restored successfully", {
                userId: response.data.id,
              });
            } else {
              // Stored user doesn't match API response, clear auth
              SecurityUtils.logSecurityEvent("User data mismatch detected", {
                storedId: parsedUser.id,
                apiId: response.data.id,
              });
              this.clearAuth();
            }
          } else {
            // Token invalid, clear storage
            SecurityUtils.logSecurityEvent("Token validation failed", {
              message: response.message,
            });
            this.clearAuth();
          }
        } catch (error) {
          SecurityUtils.logSecurityEvent("Auth restoration error", {
            error: String(error),
          });
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
