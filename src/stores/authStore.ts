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

        // Parse stored user and restore optimistically so refresh doesn't immediately log out
        let parsedUser: User | null = null;
        try {
          parsedUser = JSON.parse(storedUser);
        } catch (err) {
          SecurityUtils.logSecurityEvent("Stored user parse failed", {
            error: String(err),
          });
          this.clearAuth();
          return;
        }

        // Optimistically restore auth from storage (helps when network/API is temporarily unavailable)
        this.user = parsedUser;
        this.token = token;
        this.isAuthenticated = true;

        (async () => {
          try {
            const authService = AuthServiceFactory.getInstance();
            const response = await authService.getProfile(token);

            if (response.success) {
              // Verify stored user matches API response
              if (
                parsedUser &&
                parsedUser.id === response.data.id &&
                parsedUser.email === response.data.email
              ) {
                // Update with canonical server data
                this.user = response.data;
                SecurityUtils.logSecurityEvent("Auth restored and verified", {
                  userId: response.data.id,
                });
              } else {
                SecurityUtils.logSecurityEvent("User data mismatch detected", {
                  storedId: parsedUser ? parsedUser.id : null,
                  apiId: response.data.id,
                });
                this.clearAuth();
              }
            } else {
              // Token explicitly invalid according to API -> clear auth
              SecurityUtils.logSecurityEvent("Token validation failed", {
                message: response.message,
              });
              this.clearAuth();
            }
          } catch (error) {
            // Network or other transient error: keep optimistic auth instead of logging user out immediately
            SecurityUtils.logSecurityEvent(
              "Auth verification network error (keeping optimistic auth)",
              {
                error: String(error),
              }
            );
            // Do not clear auth here; a subsequent API call or user action can trigger a re-validation.
          }
        })();
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
