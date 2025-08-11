/**
 * Password validation rules and patterns used across the application.
 * These constants ensure consistent password requirements for security.
 */
export const PASSWORD_RULES = {
	/** Minimum password length required for security */
	MIN_LEN: 8,
	/** Regular expression to check for at least one uppercase letter */
	NEEDS_UPPERCASE: /[A-Z]/,
	/** Regular expression to check for at least one special symbol/character */
	NEEDS_SYMBOL: /[!@#$%^&*(),.?":{}|<>]/,
} as const;

/**
 * Validates password complexity based on predefined rules.
 * @param password - The password to validate
 * @returns boolean - True if the password meets complexity rules, false otherwise
 */
export function validatePasswordComplexity(password: string): boolean {
	return password.length >= 8 && /[A-Z]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password);
}
