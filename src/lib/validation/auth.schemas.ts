import { z } from 'zod';

import { PASSWORD_RULES } from '@lib/validation/validationUtils';

/* ─── Re-usable primitives ─────────────────────────────── */

/**
 * Reusable email field validation with proper error messaging.
 */
export const EmailField = z
	.email({ error: 'Invalid e-mail address' })
	.min(1, { error: 'Email is required' });

/**
 * Reusable password field validation with security requirements.
 * Enforces minimum length, uppercase letters, and special symbols.
 */
export const PasswordField = z
	.string({ error: 'Password is required' })
	.min(PASSWORD_RULES.MIN_LEN, { error: `Must be at least ${PASSWORD_RULES.MIN_LEN} characters` })
	.regex(PASSWORD_RULES.NEEDS_UPPERCASE, { error: 'Must contain an uppercase letter' })
	.regex(PASSWORD_RULES.NEEDS_SYMBOL, { error: 'Must include a symbol' });

/* ─── Route-level schemas ───────────────────────────────── */

/**
 * Validation schema for user registration requests.
 * Ensures email format, minimum password length, and optional name constraints.
 */
export const RegisterSchema = z
	.object({
		/** User's email address - must be valid email format */
		email: EmailField,
		/** Password with security requirements */
		password: PasswordField,
		/** Password confirmation for validation */
		confirmPassword: z.string(),
		/** Optional display name - 1-100 characters when provided */
		name: z.string().min(1).max(100).optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: 'Passwords do not match',
		path: ['confirmPassword'],
	});

/**
 * Validation schema for user login requests.
 * Validates email format and password for authentication.
 */
export const LoginSchema = z.object({
	/** User's email address - must be valid email format */
	email: EmailField,
	/** Password for authentication - no complexity rules on login */
	password: z.string().min(1, { error: 'Password is required' }),
});

/**
 * Validation schema for forgot password requests.
 * Requires a valid email address to initiate password reset flow.
 */
export const ForgotPasswordSchema = z.object({
	/** User's email address for password reset */
	email: EmailField,
});

/**
 * Validation schema for password reset completion.
 * Validates the reset token and new password requirements with confirmation.
 */
export const ResetPasswordSchema = z
	.object({
		/** Password reset token - minimum 32 characters (hex string) */
		token: z.string().min(32),
		/** New password with security requirements */
		newPassword: PasswordField,
		/** Password confirmation for validation */
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		error: 'Passwords do not match',
		path: ['confirmPassword'],
	});

/**
 * Validation schema for password change requests by authenticated users.
 * Validates current password and new password requirements with confirmation.
 * Produces types compatible with ChangePasswordData domain model.
 */
export const ChangePasswordSchema = z
	.object({
		/** Current password for verification */
		currentPassword: z.string({ error: 'Current password is required' }),
		/** New password with security requirements */
		newPassword: PasswordField,
		/** Password confirmation for validation */
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		error: 'Passwords do not match',
		path: ['confirmPassword'],
	});

/* ─── Type Inference Exports ───────────────────────────── */

/**
 * Type inference exports that match domain models in @lib/models/Auth.
 * These provide validated data types for use in API routes and services.
 */

/** Type inference for LoginSchema - matches LoginData domain model */
export type LoginData = z.infer<typeof LoginSchema>;

/** Type inference for RegisterSchema - matches RegisterUserData domain model */
export type RegisterData = z.infer<typeof RegisterSchema>;

/** Type inference for ForgotPasswordSchema - matches ForgotPasswordData domain model */
export type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>;

/** Type inference for ResetPasswordSchema - matches ResetPasswordData domain model */
export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;

/** Type inference for ChangePasswordSchema - matches ChangePasswordData domain model */
export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;
