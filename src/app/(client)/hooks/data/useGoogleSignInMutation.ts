/**
 * useGoogleSignInMutation.ts
 * -----------------------------------------------------------------------------
 * TanStack Query mutation hook for Google OAuth sign-in.
 *
 * Wraps NextAuth's Google provider sign-in with React Query's mutation pattern,
 * providing consistent loading/error states and integration with the project's
 * Service → Hook → Component architecture.
 *
 * @example
 * ```tsx
 * const { mutate: signInWithGoogle, isPending, error } = useGoogleSignInMutation()
 *
 * const handleClick = () => {
 *   signInWithGoogle({ callbackUrl: '/dashboard' })
 * }
 * ```
 */
import { signIn } from 'next-auth/react';

import { useMutation } from '@tanstack/react-query';

/**
 * Request parameters for Google sign-in mutation
 */
export interface GoogleSignInRequest {
	/** Optional URL to redirect to after successful sign-in. Defaults to '/' */
	callbackUrl?: string;
}

/**
 * Response from Google sign-in mutation
 */
export interface GoogleSignInResponse {
	/** Whether the sign-in was successful */
	success: boolean;
	/** Success message */
	message: string;
}

/**
 * Custom TanStack Query mutation hook for Google OAuth sign-in.
 *
 * Provides a clean interface for triggering Google authentication with
 * built-in loading states, error handling, and consistent typing across
 * the application.
 *
 * Uses NextAuth's client-side signIn function with default redirect behavior.
 * For non-redirect flows, use NextAuth's signIn directly with redirect: false.
 *
 * @returns TanStack Query mutation object with Google sign-in functionality
 */
export function useGoogleSignInMutation() {
	return useMutation<GoogleSignInResponse, Error, GoogleSignInRequest>({
		mutationFn: async ({ callbackUrl = '/' }: GoogleSignInRequest) => {
			// Call NextAuth's signIn with default redirect behavior
			// This will redirect the browser to Google OAuth, so the promise
			// typically won't resolve in the normal flow
			await signIn('google', { callbackUrl });

			// This return will only be reached in edge cases where redirect fails
			// In normal operation, the browser redirects to Google before this point
			return {
				success: true,
				message: 'Redirecting to Google for authentication...',
			};
		},
		// Mutation options
		meta: {
			// Add metadata for potential error boundary handling
			action: 'Google Sign-In',
		},
	});
}
