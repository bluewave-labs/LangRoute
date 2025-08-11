/* ------------------------------------------------------------------ */
/*  Authentication Domain Models                                      */
/* ------------------------------------------------------------------ */

/**
 * Centralized authentication data transfer objects (DTOs) and
 * domain types used across validation, API routes, and services.
 * These types ensure consistency between frontend forms,
 * validation schemas, and backend processing.
 */

/* ------------------------------------------------------------------ */
/*  Request DTOs                                                      */
/* ------------------------------------------------------------------ */

/**
 * Data structure for user login requests.
 * Used by login forms, validation schemas, and API endpoints.
 *
 * @interface LoginData
 */
export interface LoginData {
	/** User's email address */
	email: string;
	/** User's password for authentication */
	password: string;
}

/**
 * Data structure for user registration requests.
 * Used by registration forms, validation schemas, and API endpoints.
 *
 * @interface RegisterUserData
 */
export interface RegisterUserData {
	/** User's email address - must be unique */
	email: string;
	/** Plain text password to be hashed */
	password: string;
	/** Password confirmation for validation */
	confirmPassword: string;
	/** Optional display name for the user */
	name?: string;
}

/**
 * Data structure for password reset initiation requests.
 * Used by forgot password forms, validation schemas, and API endpoints.
 *
 * @interface ForgotPasswordData
 */
export interface ForgotPasswordData {
	/** User's email address for password reset */
	email: string;
}

/**
 * Data structure for password reset completion requests.
 * Used by reset password forms, validation schemas, and API endpoints.
 *
 * @interface ResetPasswordData
 */
export interface ResetPasswordData {
	/** Password reset token from email/forgot flow */
	token: string;
	/** New password with security requirements */
	newPassword: string;
	/** Password confirmation for validation */
	confirmPassword: string;
}

/**
 * Data structure for password change requests.
 * Used by authenticated users to change their password.
 *
 * @interface ChangePasswordData
 */
export interface ChangePasswordData {
	/** Current password for verification */
	currentPassword: string;
	/** New password with security requirements */
	newPassword: string;
	/** Password confirmation for validation */
	confirmPassword: string;
}

/* ------------------------------------------------------------------ */
/*  Response DTOs                                                     */
/* ------------------------------------------------------------------ */

/**
 * API response structure for forgot password requests.
 * Contains token information or provider management status.
 *
 * @interface ForgotPasswordResult
 */
export interface ForgotPasswordResult {
	/** Reset token (only in development) */
	token?: string;
	/** Whether password is managed by external provider */
	managedByProvider?: boolean;
}

/**
 * Standard API response structure for authentication operations.
 * Used by registration, password reset, and other auth endpoints.
 *
 * @interface AuthApiResponse
 */
export interface AuthApiResponse {
	/** Whether the operation was successful */
	success: boolean;
	/** Optional message for user feedback */
	message?: string;
	/** Optional error details for debugging */
	error?: string;
}

/* ------------------------------------------------------------------ */
/*  Authentication Status Types                                       */
/* ------------------------------------------------------------------ */

/**
 * Enumeration of possible authentication states.
 * Used for session management and route protection.
 *
 * @enum AuthStatus
 */
export enum AuthStatus {
	/** User is authenticated and session is valid */
	AUTHENTICATED = 'authenticated',
	/** User is not authenticated */
	UNAUTHENTICATED = 'unauthenticated',
	/** Authentication state is being determined */
	LOADING = 'loading',
}

/**
 * Password reset token validation result.
 * Used to determine if a reset token is valid and can be used.
 *
 * @interface TokenValidationResult
 */
export interface TokenValidationResult {
	/** Whether the token is valid and not expired */
	isValid: boolean;
	/** Associated user ID if token is valid */
	userId?: string;
	/** Error message if token is invalid */
	error?: string;
}
