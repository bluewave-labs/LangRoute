/**
 * useSignOutMutation.ts
 * -----------------------------------------------------------------------------
 * TanStack Query mutation hook for signing out from any authentication provider.
 *
 * Wraps NextAuth's signOut function with React Query's mutation pattern,
 * providing consistent loading/error states and integration with the project's
 * Service → Hook → Component architecture.
 *
 * @example
 * ```tsx
 * const { mutate: signOut, isPending, error } = useSignOutMutation()
 *
 * const handleSignOut = () => {
 *   signOut({ callbackUrl: '/' })
 * }
 * ```
 */
import { signOut } from 'next-auth/react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Request parameters for sign-out mutation
 */
export interface SignOutRequest {
	/** Optional URL to redirect to after successful sign-out. Defaults to '/' */
	callbackUrl?: string;
}

/**
 * Response from sign-out mutation
 */
export interface SignOutResponse {
	/** Whether the sign-out was successful */
	success: boolean;
	/** Success message */
	message: string;
}

/**
 * Custom TanStack Query mutation hook for signing out.
 *
 * Provides a clean interface for triggering sign-out with built-in loading states,
 * error handling, and automatic cache invalidation to refresh session state.
 *
 * Uses NextAuth's client-side signOut function with default redirect behavior.
 * Invalidates session queries to ensure UI updates immediately.
 *
 * @returns TanStack Query mutation object with sign-out functionality
 */
export function useSignOutMutation() {
	const queryClient = useQueryClient();

	return useMutation<SignOutResponse, Error, SignOutRequest>({
		mutationFn: async ({ callbackUrl = '/' }: SignOutRequest) => {
			// Call NextAuth's signOut with default redirect behavior
			await signOut({ callbackUrl });

			return {
				success: true,
				message: 'Signed out successfully',
			};
		},
		onSuccess: () => {
			// Invalidate session queries to update UI immediately
			queryClient.invalidateQueries({ queryKey: ['sessionUser'] });
		},
		// Mutation options
		meta: {
			action: 'Sign Out',
		},
	});
}
