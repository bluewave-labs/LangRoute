import {
	type Query,
	QueryClient,
	defaultShouldDehydrateQuery,
	isServer,
} from '@tanstack/react-query';

/**
 * Shared QueryClient configuration for both server and client environments.
 * Ensures consistent behavior across SSR and client-side rendering.
 */
const queryClientConfig = {
	defaultOptions: {
		queries: {
			// With SSR, we set a default staleTime above 0 to avoid refetching immediately on the client
			staleTime: 60 * 1000, // 1 minute
			refetchOnWindowFocus: false,
			retry: 0,
		},
		mutations: {
			retry: 0,
		},
		dehydrate: {
			// Include pending queries in dehydration for streaming
			shouldDehydrateQuery: (query: Query) =>
				defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
		},
	},
} as const;

/**
 * Creates a QueryClient instance with shared configuration.
 * Used both for server-side rendering and client-side providers.
 */
export function createQueryClient() {
	return new QueryClient(queryClientConfig);
}

// Browser-only singleton QueryClient to prevent re-creation on React suspense
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Gets or creates a QueryClient instance following Next.js App Router best practices.
 * - Server: Always creates a new query client for each request
 * - Browser: Reuses existing client to prevent re-creation on React suspense
 */
export function getQueryClient() {
	if (isServer) {
		// Server: always make a new query client for each request
		return createQueryClient();
	} else {
		if (!browserQueryClient) browserQueryClient = createQueryClient();
		return browserQueryClient;
	}
}
