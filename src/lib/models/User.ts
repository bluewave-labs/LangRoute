import type { Role } from '@prisma/client';

/* ------------------------------------------------------------------ */
/*  Core User Models                                                  */
/* ------------------------------------------------------------------ */

/**
 * Base user interface matching the Prisma User model structure.
 * Contains core user data that is shared across authentication,
 * session management, and user profile operations.
 *
 * @interface BaseUser
 */
export interface BaseUser {
	/** Unique user identifier from the database */
	id: string;
	/** User's assigned role determining permissions */
	role: Role;
	/** User's email address */
	email: string;
	/** URL to user's avatar image, if available */
	avatarUrl: string | null;
	/** Optional display name for the user */
	name: string | null;
}

/**
 * Extended user interface for authenticated sessions.
 * Used by NextAuth and session management throughout the application.
 * This matches the NextAuth User interface and API responses.
 *
 * @interface AuthUser
 * @extends BaseUser
 */
export interface AuthUser extends BaseUser {
	/** Email verification status */
	emailVerified?: Date | null;
}

/**
 * Simplified user interface for session data and frontend components.
 * Contains only the essential data needed for most UI operations.
 *
 * @interface SessionUser
 */
export interface SessionUser {
	/** Unique user identifier from the database */
	id: string;
	/** User's assigned role determining permissions */
	role: Role;
	/** URL to user's avatar image, if available */
	avatarUrl: string | null;
	/** User's email address */
	email: string;
	/** Optional display name for the user */
	name?: string | null;
}

/* ------------------------------------------------------------------ */
/*  API Response Models                                               */
/* ------------------------------------------------------------------ */

/**
 * API response structure from the /api/auth/me endpoint.
 * Contains the user session data or null if not authenticated.
 *
 * @interface SessionQueryResult
 */
export interface SessionQueryResult {
	/** User data if authenticated, null if not authenticated */
	user: SessionUser | null;
}

/* ------------------------------------------------------------------ */
/*  Hook Return Types                                                 */
/* ------------------------------------------------------------------ */

/**
 * Return type for the useSessionUser hook.
 * Provides user data along with loading states and convenience flags.
 *
 * @interface UseSessionUserReturn
 */
export interface UseSessionUserReturn {
	/** Current authenticated user data, or null if not authenticated */
	user: SessionUser | null;
	/** Whether the current user has administrator privileges */
	isAdmin: boolean;
	/** Whether the session query is currently loading */
	isLoading: boolean;
	/** Whether an error occurred while fetching session data */
	isError: boolean;
}
