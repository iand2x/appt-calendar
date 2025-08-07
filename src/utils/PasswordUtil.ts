import bcrypt from "bcryptjs";

/**
 * Password utility class for handling encryption and decryption
 * Uses bcrypt for secure password hashing with salt rounds
 */
export class PasswordUtil {
  private static readonly saltRounds = 12;

  /**
   * Hash a plain text password
   * @param plainPassword - The plain text password to hash
   * @returns Promise<string> - The hashed password
   */
  static async hashPassword(plainPassword: string): Promise<string> {
    try {
      return await bcrypt.hash(plainPassword, this.saltRounds);
    } catch (error) {
      throw new Error(
        `Password hashing failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Verify a plain text password against its hash
   * @param plainPassword - The plain text password to verify
   * @param hashedPassword - The hashed password to compare against
   * @returns Promise<boolean> - True if password matches, false otherwise
   */
  static async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error(
        `Password verification failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generate multiple hashed passwords for development/testing
   * @param passwords - Object with email as key and plain password as value
   * @returns Promise<Record<string, string>> - Object with email as key and hashed password as value
   */
  static async generateHashedPasswords(
    passwords: Record<string, string>
  ): Promise<Record<string, string>> {
    const hashedPasswords: Record<string, string> = {};

    for (const [email, password] of Object.entries(passwords)) {
      hashedPasswords[email] = await this.hashPassword(password);
    }

    return hashedPasswords;
  }

  /**
   * Utility function to log hashed passwords for development
   * @param passwords - Object with email as key and plain password as value
   */
  static async logHashedPasswords(
    passwords: Record<string, string>
  ): Promise<void> {
    console.log("Generated hashed passwords:");
    for (const [email, password] of Object.entries(passwords)) {
      const hashed = await this.hashPassword(password);
      console.log(`"${email}": "${hashed}",`);
    }
  }
}
