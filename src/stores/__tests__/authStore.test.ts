import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "../authStore";
import type { LoginCredentials } from "@/features/auth/authTypes";
import type { User } from "@/types";

// Mock the AuthServiceFactory
const mockLogin = vi.fn();
const mockLogout = vi.fn();
const mockGetProfile = vi.fn();
const mockGetUsers = vi.fn();

vi.mock("@/services/AuthServiceFactory", () => ({
  AuthServiceFactory: {
    getInstance: vi.fn(() => ({
      login: mockLogin,
      logout: mockLogout,
      getProfile: mockGetProfile,
      getUsers: mockGetUsers,
    })),
  },
}));

// Mock SecurityUtils
vi.mock("@/utils/security", () => ({
  SecurityUtils: {
    validateStoredAuth: vi.fn(() => true),
    logSecurityEvent: vi.fn(),
  },
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("Auth Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    // Reset specific mocks
    mockLogin.mockReset();
    mockLogout.mockReset();
    mockGetProfile.mockReset();
    mockGetUsers.mockReset();
  });

  it("should initialize with default state", () => {
    const authStore = useAuthStore();

    expect(authStore.user).toBeNull();
    expect(authStore.token).toBe("");
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.isLoading).toBe(false);
    expect(authStore.error).toBe("");
  });

  it("should handle successful login", async () => {
    const mockUser: User = {
      id: "1",
      email: "test@example.com",
      username: "test",
      role: "admin",
      password: "hashedpassword",
    };
    const mockToken = "test-token";

    // Configure the mock response
    mockLogin.mockResolvedValue({
      success: true,
      data: { user: mockUser, token: mockToken },
      message: "Login successful",
    });

    const authStore = useAuthStore();

    const credentials: LoginCredentials = {
      email: "test@example.com",
      password: "password",
    };

    const result = await authStore.login(credentials);

    console.log("Login result:", result);
    console.log("Auth service mock calls:", mockLogin.mock.calls);

    expect(result.success).toBe(true);
    expect(authStore.user).toEqual(mockUser);
    expect(authStore.token).toBe(mockToken);
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.error).toBe("");
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "auth_token",
      mockToken
    );
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify(mockUser)
    );
  });

  it("should handle login failure", async () => {
    mockLogin.mockResolvedValue({
      success: false,
      data: { user: {} as User, token: "" },
      message: "Invalid credentials",
    });

    const authStore = useAuthStore();

    const credentials: LoginCredentials = {
      email: "test@example.com",
      password: "wrong-password",
    };

    const result = await authStore.login(credentials);

    expect(result.success).toBe(false);
    expect(authStore.user).toBeNull();
    expect(authStore.token).toBe("");
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.error).toBe("Invalid credentials");
  });

  it("should handle network errors during login", async () => {
    mockLogin.mockRejectedValue(new Error("Network error"));

    const authStore = useAuthStore();

    const credentials: LoginCredentials = {
      email: "test@example.com",
      password: "password",
    };

    const result = await authStore.login(credentials);

    expect(result.success).toBe(false);
    expect(authStore.error).toBe("Network error occurred");
    expect(authStore.isLoading).toBe(false);
  });

  it("should clear state on logout", () => {
    const authStore = useAuthStore();

    // Set initial authenticated state
    authStore.user = {
      id: "1",
      email: "test@example.com",
      username: "test",
      role: "admin",
      password: "hashedpassword",
    };
    authStore.token = "test-token";
    authStore.isAuthenticated = true;

    authStore.logout();

    expect(authStore.user).toBeNull();
    expect(authStore.token).toBe("");
    expect(authStore.isAuthenticated).toBe(false);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("auth_token");
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("user");
  });

  it("should load stored auth successfully", async () => {
    const mockUser: User = {
      id: "1",
      email: "test@example.com",
      username: "test",
      role: "admin",
      password: "hashedpassword",
    };
    const mockToken = "mock_token_1_2"; // Must have exactly 4 parts after splitting by _

    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "auth_token") return mockToken;
      if (key === "user") return JSON.stringify(mockUser);
      return null;
    });

    mockGetProfile.mockImplementation((token) => {
      console.log("getProfile called with token:", token);
      if (token === mockToken) {
        console.log("Token matches, returning success");
        return Promise.resolve({
          success: true,
          data: mockUser,
        });
      }
      console.log("Token does not match, returning failure");
      return Promise.resolve({
        success: false,
        data: {} as User,
        message: "Invalid token",
      });
    });

    const authStore = useAuthStore();
    await authStore.loadStoredAuth();

    expect(authStore.user).toEqual(mockUser);
    expect(authStore.token).toBe(mockToken);
    expect(authStore.isAuthenticated).toBe(true);
  });

  it("should clear auth when stored token is invalid", async () => {
    const authStore = useAuthStore();

    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "auth_token") return "invalid_token";
      if (key === "user") return JSON.stringify({ id: "1", username: "test" });
      return null;
    });

    // Ensure background verification returns a token-invalid response
    mockGetProfile.mockResolvedValue({
      success: false,
      data: {} as User,
      message: "Invalid token",
    });

    await authStore.loadStoredAuth();

    // Poll for up to 500ms for the background verification to clear auth
    const start = Date.now();
    while (Date.now() - start < 500) {
      if (!authStore.isAuthenticated) break;
      // yield to event loop
      await new Promise((r) => setTimeout(r, 20));
    }

    expect(authStore.user).toBeNull();
    expect(authStore.token).toBe("");
    expect(authStore.isAuthenticated).toBe(false);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("auth_token");
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("user");
  });
});
