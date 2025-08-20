import { Role } from '@prisma/client';
import argon2 from 'argon2';
import crypto from 'crypto';

import { ServiceError } from '@services';

import { auth } from '@lib/auth';

import type {
	ChangePasswordData,
	ForgotPasswordData,
	ForgotPasswordResult,
	RegisterUserData,
	ResetPasswordData,
} from '@lib/models/Auth';
import { logWarn } from '@lib/utils';
import { validatePasswordComplexity } from '@lib/validation/validationUtils';

import prisma from '@/db/prisma';

/* ------------------------------------------------------------------ */
/*  Guards                                                            */
/* ------------------------------------------------------------------ */

/**
 * Ensures the caller is authenticated.
 * @throws ServiceError(401) when no session.
 * @returns The authenticated user's database ID.
 */
export async function authenticate(): Promise<string> {
	const session = await auth();
	if (!session?.user?.id) throw new ServiceError('Unauthenticated', 401);
	return session.user.id;
}

/**
 * Ensures the caller has at least one of the required roles.
 * @param roles list of Role enums that are allowed for this action
 * @throws ServiceError(403) when role mismatch
 * @returns void
 */
export async function requireRole(roles: Role[]): Promise<void> {
	const session = await auth();
	if (!session?.user?.role || !roles.includes(session.user.role)) {
		throw new ServiceError('Forbidden', 403);
	}
}

/**
 * Placeholder for future team-scoped RBAC.
 * Currently always allows (no TeamMembership rows yet).
 */
export async function requireTeamRole(_roles: Role[]): Promise<void> {
	logWarn('[AuthService] requireTeamRole not yet implemented');
	logWarn(`${_roles.join(', ')} roles are not enforced yet`);
	return; // no-op until Phase 5
}

/* ------------------------------------------------------------------ */
/*  Auth Service                                                      */
/* ------------------------------------------------------------------ */
export const AuthService = {
	/**
	 * Registers a new user account with email and password.
	 * Creates an admin user by default for initial setup.
	 *
	 * @param data - User registration information following RegisterUserData domain model
	 * @throws ServiceError(409) when email is already registered
	 * @returns Promise<void>
	 */
	async registerUser(data: RegisterUserData): Promise<void> {
		const { email, password, name } = data;

		// Hash password and create user with admin role
		const hashed = await argon2.hash(password);
		try {
			await prisma.user.create({
				data: { email, hashedPassword: hashed, role: Role.ADMIN, name },
			});
			// TODO: EmailService.sendWelcomeEmail(user)
		} catch (err: unknown) {
			if (err && typeof err === 'object' && 'code' in err && err.code === 'P2002') {
				throw new ServiceError('Email already registered', 409);
			}
			throw err;
		}
	},

	/**
	 * Initiates password reset flow by generating a secure token.
	 * For OAuth users or non-existent accounts, returns a safe response
	 * to prevent email enumeration attacks.
	 *
	 * @param data - Password reset request following ForgotPasswordData domain model
	 * @returns Promise<ForgotPasswordResult>
	 */
	async forgotPassword(data: ForgotPasswordData): Promise<ForgotPasswordResult> {
		const { email } = data;

		// Find user by email
		const user = await prisma.user.findUnique({
			where: { email },
			select: { hashedPassword: true },
		});

		// If user doesn't exist or is OAuth-only, return safe response
		if (!user?.hashedPassword) {
			return { managedByProvider: true };
		}

		// Generate secure token and expiration (24 hours)
		const token = crypto.randomBytes(32).toString('hex');
		const expires = new Date(Date.now() + 86_400_000);

		// Store verification token for password reset
		await prisma.verificationToken.create({
			data: { identifier: email, token, expires },
		});

		return { token }; // Token exposed only for development by route handler
	},

	/**
	 * Completes password reset using a valid token.
	 * Atomically updates the user's password and removes the token.
	 *
	 * @param data - Password reset request following ResetPasswordData domain model
	 * @throws ServiceError(400) when token is invalid or expired
	 * @throws ServiceError(404) when user is not found
	 * @returns Promise<void>
	 */
	async resetPassword(data: ResetPasswordData): Promise<void> {
		const { token, newPassword } = data;

		// Validate token and check expiration
		const rec = await prisma.verificationToken.findUnique({
			where: { token },
			select: { identifier: true, expires: true },
		});
		if (!rec || rec.expires < new Date()) {
			throw new ServiceError('Token invalid or expired', 400);
		}

		// Find associated user
		const user = await prisma.user.findUnique({
			where: { email: rec.identifier },
			select: { id: true },
		});
		if (!user) throw new ServiceError('User missing', 404);

		// Hash new password and update atomically
		const hashedPassword = await argon2.hash(newPassword);
		await prisma.$transaction([
			prisma.user.update({
				where: { id: user.id },
				data: { hashedPassword },
			}),
			prisma.verificationToken.delete({ where: { token } }),
		]);
	},

	/**
	 * Changes the password for an authenticated user.
	 * @param userId - The authenticated user's ID
	 * @param data - Password change request following ChangePasswordData domain model
	 * @throws ServiceError(404) when user not found
	 * @throws ServiceError(400) when current password is incorrect or password managed by external provider
	 * @throws ServiceError(422) when new password does not meet complexity rules
	 * @returns void
	 */
	async changePassword(userId: string, data: ChangePasswordData): Promise<void> {
		const { currentPassword, newPassword } = data;

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { hashedPassword: true },
		});
		if (!user) throw new ServiceError('User not found', 404);
		if (!user.hashedPassword) {
			throw new ServiceError('Password managed by external provider', 400);
		}

		// Validate password complexity - can be moved to a schema in the future
		if (!validatePasswordComplexity(newPassword)) {
			throw new ServiceError('Password does not meet complexity rules', 422);
		}

		const valid = await argon2.verify(user.hashedPassword, currentPassword);
		if (!valid) throw new ServiceError('Current password incorrect', 400);

		const newHash = await argon2.hash(newPassword);
		await prisma.user.update({
			where: { id: userId },
			data: { hashedPassword: newHash },
		});
	},
};

/* ------------------------------------------------------------------ */
/*  Email Service (Future)                         */
/* ------------------------------------------------------------------ */
export async function sendResetPasswordEmail(): Promise<void> {
	console.warn('[AuthService] sendResetPasswordEmail not yet implemented');
}
