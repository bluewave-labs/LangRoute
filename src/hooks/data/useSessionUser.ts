import { Role } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

import type { SessionQueryResult, UseSessionUserReturn } from '@/lib/models';

/**
 * Queries the /api/auth/me endpoint to retrieve authenticated user information,
 * providing loading states and role-based helpers. The data is cached for 5 minutes
 * to minimize unnecessary API calls while maintaining fresh session state.
 *
 * @returns Object containing user data, loading state, and convenience flags
 * @throws Will set isError to true if the session fetch fails
 */
export function useSessionUser(): UseSessionUserReturn {
	const { data, isLoading, isError } = useQuery<SessionQueryResult>({
		queryKey: ['sessionUser'],
		queryFn: async (): Promise<SessionQueryResult> => {
			const response = await fetch('/_api/auth/me', {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch session: ${response.status} ${response.statusText}`);
			}

			return response.json();
		},
		staleTime: 5 * 60 * 1000, // Cache for 5 minutes
		refetchOnWindowFocus: false, // Don't refetch when window regains focus
		retry: 2, // Retry failed requests up to 2 times
	});

	const user = data?.user ?? null;

	return {
		user,
		isAdmin: user?.role === Role.ADMIN,
		isLoading,
		isError,
	};
}
