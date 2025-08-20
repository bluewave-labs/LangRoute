'use client';

import { Toaster } from 'react-hot-toast';

import { QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';

import { getQueryClient } from './QueryClientProvider';
import ThemeProvider from './ThemeProvider';

/**
 * Global providers wrapper for the LangRoute application.
 * Provides React Query state management, NextAuth session management,
 * and react-hot-toast notification system.
 *
 * @param children - The app content to wrap with providers
 */

export default function AppProviders({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<ThemeProvider>
					{children}

					{/* React Hot Toast - positioned top-right with 5s default duration */}
					<Toaster
						position='top-right'
						toastOptions={{
							duration: 5000,
							style: {
								background: 'var(--color-background)',
								color: 'var(--color-foreground)',
								border: '1px solid var(--color-border)',
							},
							success: {
								iconTheme: {
									primary: 'var(--primary)',
									secondary: 'var(--primary-foreground)',
								},
							},
							error: {
								iconTheme: {
									primary: 'var(--destructive)',
									secondary: 'var(--color-background)',
								},
							},
						}}
					/>
				</ThemeProvider>
			</SessionProvider>
		</QueryClientProvider>
	);
}
