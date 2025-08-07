import { beforeAll, afterEach, vi } from "vitest";
import "@testing-library/jest-dom";

// Mock environment variables
beforeAll(() => {
  // Mock environment variables for testing
  vi.stubEnv("VITE_GRAPHQL_ENDPOINT", "http://localhost:3001/graphql");

  // Set timezone to UTC for consistent test results
  process.env.TZ = "UTC";
  vi.setSystemTime(new Date("2024-01-15T00:00:00.000Z"));

  // Global test setup
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Mock fetch for API calls
global.fetch = vi.fn();

// Reset all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
