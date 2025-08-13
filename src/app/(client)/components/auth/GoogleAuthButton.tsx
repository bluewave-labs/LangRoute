'use client';

import Image from 'next/image';

import { Button } from '@components';

import { useGoogleSignInMutation, useSessionUser, useSignOutMutation } from '../../hooks/data';

/**
 * Smart Google authentication button that adapts to user's current state.
 *
 * - **When signed out**: Shows "Continue with Google" and initiates OAuth sign-in
 * - **When signed in**: Shows "Sign Out" with user info and handles sign-out
 *
 * Uses TanStack Query mutations for consistent loading states and error handling.
 * Integrates with the project's session management through useSessionUser hook.
 */
export function GoogleAuthButton() {
	const { user, isLoading: isSessionLoading } = useSessionUser();
	const {
		mutate: signInWithGoogle,
		isPending: isSigningIn,
		error: signInError,
	} = useGoogleSignInMutation();
	const { mutate: signOut, isPending: isSigningOut, error: signOutError } = useSignOutMutation();

	const isPending = isSigningIn || isSigningOut;
	const error = signInError || signOutError;

	const handleAuthAction = () => {
		if (user) {
			// User is signed in, sign them out
			signOut({ callbackUrl: '/' });
		} else {
			// User is signed out, sign them in
			signInWithGoogle({ callbackUrl: '/key-management' });
		}
	};

	// Show loading state while checking session
	if (isSessionLoading) {
		return (
			<Button
				disabled
				variant='outline'
				className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium'
			>
				<div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
				Loading...
			</Button>
		);
	}

	return (
		<Button
			onClick={handleAuthAction}
			disabled={isPending}
			variant={user ? 'ghost' : 'outline'}
			className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium'
		>
			{user ? (
				// Signed in state - show user info and sign out option
				<>
					{user.avatarUrl && (
						<Image
							src={user.avatarUrl}
							alt={user.name || user.email}
							width={16}
							height={16}
							className='h-4 w-4 rounded-full'
						/>
					)}
					<span className='max-w-[150px] truncate'>{user.name || user.email}</span>
					{isSigningOut ? 'Signing out...' : 'Sign out'}
				</>
			) : (
				// Signed out state - show Google sign in
				<>
					<svg
						className='h-4 w-4'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
							fill='#4285F4'
						/>
						<path
							d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
							fill='#34A853'
						/>
						<path
							d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
							fill='#FBBC05'
						/>
						<path
							d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
							fill='#EA4335'
						/>
					</svg>
					{isSigningIn ? 'Signing in...' : 'Continue with Google'}
				</>
			)}

			{error && (
				<span
					className='sr-only'
					role='alert'
				>
					Error: {error.message}
				</span>
			)}
		</Button>
	);
}

// Backward compatibility alias
export const GoogleSignInButton = GoogleAuthButton;
