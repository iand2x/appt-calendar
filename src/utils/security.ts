// Security utility to detect potential authentication bypass attempts
export class SecurityUtils {
  /**
   * Check for signs of localStorage manipulation
   */
  static validateStoredAuth(): boolean {
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("user");

    if (!token || !user) return false;

    try {
      // Basic token format validation
      if (!token.startsWith("mock_token_") || token.split("_").length !== 4) {
        console.warn(
          "🚨 Potential security threat: Invalid token format detected"
        );
        return false;
      }

      // Validate user data structure
      const userData = JSON.parse(user);
      const requiredFields = ["id", "username", "email", "role"];

      for (const field of requiredFields) {
        if (!userData[field]) {
          console.warn(
            `🚨 Potential security threat: Missing user field: ${field}`
          );
          return false;
        }
      }

      // Check for suspicious values
      if (
        userData.role === "admin" &&
        !userData.email.includes("@clinic.com")
      ) {
        console.warn(
          "🚨 Potential security threat: Suspicious admin account detected"
        );
        return false;
      }

      return true;
    } catch {
      console.warn("🚨 Potential security threat: Invalid user data format");
      return false;
    }
  }

  /**
   * Log security events for monitoring
   */
  static logSecurityEvent(event: string, details?: Record<string, unknown>) {
    console.log(`🔒 Security Event: ${event}`, details);

    // In a real app, send this to your security monitoring service
    // analytics.track('security_event', { event, details, timestamp: new Date() });
  }
}
