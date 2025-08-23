'use client';

import { useMemo } from 'react';

import { LogOut } from 'lucide-react';

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	SidebarMenuButton,
} from '@shadcn-ui';

import { useGoogleSignInMutation, useSessionUser, useSignOutMutation } from '@hooks/data';

import { Button } from '@components';

interface GoogleAuthButtonProps {
	variant?: 'button' | 'sidebar';
	className?: string;
}

interface UserAvatarProps {
	user: NonNullable<ReturnType<typeof useSessionUser>['user']>;
	size?: 'sm' | 'md';
	showName?: boolean;
	className?: string;
}

interface AuthDropdownContentProps {
	user: NonNullable<ReturnType<typeof useSessionUser>['user']>;
	onSignOut: () => void;
	isSigningOut: boolean;
}

/**
 * Google icon component for consistent branding
 */
function GoogleIcon() {
	return (
		<svg
			className='h-4 w-4'
			viewBox='0 0 24 24'
			fill='none'
			aria-hidden
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
	);
}

/**
 * Reusable user avatar component with name display
 */
function UserAvatar({ user, size = 'sm', showName = false, className = '' }: UserAvatarProps) {
	const initials = useMemo(() => {
		const basis = user.name || user.email || 'U';
		return basis
			.split(' ')
			.map((p) => p[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	}, [user]);

	const avatarSizeClasses = {
		sm: 'h-6 w-6',
		md: 'h-7 w-7',
	};

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<Avatar className={`${avatarSizeClasses[size]} rounded-md`}>
				<AvatarImage
					src={user.avatarUrl ?? undefined}
					alt={user.name || user.email}
				/>
				<AvatarFallback className='text-xs'>{initials}</AvatarFallback>
			</Avatar>
			{showName && (
				<div className='min-w-0'>
					<h2 className='text-foreground truncate text-sm leading-tight font-semibold'>
						{user.name ?? 'Account'}
					</h2>
					<p className='text-muted-foreground max-w-[160px] truncate text-xs leading-tight'>
						{user.email}
					</p>
				</div>
			)}
		</div>
	);
}

/**
 * Reusable dropdown menu content for authenticated user
 */
function AuthDropdownContent({ user, onSignOut, isSigningOut }: AuthDropdownContentProps) {
	return (
		<DropdownMenuContent
			align='end'
			side='top'
			className='m-3 w-60'
		>
			<DropdownMenuLabel>
				<UserAvatar
					user={user}
					size='md'
					showName
				/>
			</DropdownMenuLabel>

			<DropdownMenuSeparator />

			<DropdownMenuItem
				onClick={onSignOut}
				disabled={isSigningOut}
				className='text-destructive focus:text-destructive'
			>
				<LogOut className='mr-2' />
				{isSigningOut ? 'Signing out…' : 'Sign out'}
			</DropdownMenuItem>
		</DropdownMenuContent>
	);
}

/**
 * Loading state component that adapts to variant
 */
function LoadingState({ variant }: { variant: 'button' | 'sidebar' }) {
	const Trigger = variant === 'sidebar' ? SidebarMenuButton : Button;

	return (
		<Trigger
			className={variant === 'sidebar' ? 'justify-between' : ''}
			loading
			aria-label='Loading authentication'
		/>
	);
}

/**
 * Sign-in state component that adapts to variant
 */
function SignInState({
	variant,
	className,
	onSignIn,
	isSigningIn,
}: {
	variant: 'button' | 'sidebar';
	className?: string;
	onSignIn: () => void;
	isSigningIn: boolean;
}) {
	const Trigger = variant === 'sidebar' ? SidebarMenuButton : Button;

	return (
		<Trigger
			onClick={onSignIn}
			variant={variant === 'sidebar' ? undefined : 'outline'}
			className={variant === 'sidebar' ? 'justify-between' : className}
			aria-label='Continue with Google'
			loading={isSigningIn}
			loadingText='Signing in...'
			startIcon={<GoogleIcon />}
		>
			{!isSigningIn && 'Continue with Google'}
		</Trigger>
	);
}

/**
 * Professional Google authentication button with DRY principles
 *
 * Features:
 * - Unified component for both button and sidebar variants
 * - Extracted reusable sub-components for better maintainability
 * - Consistent loading and error states
 * - Proper accessibility attributes
 * - Clean separation of concerns
 */
export default function GoogleAuthButton({ variant = 'button', className }: GoogleAuthButtonProps) {
	const { user, isLoading: isSessionLoading } = useSessionUser();
	const { mutate: signInWithGoogle, isPending: isSigningIn } = useGoogleSignInMutation();
	const { mutate: signOut, isPending: isSigningOut } = useSignOutMutation();

	const handleSignIn = () => signInWithGoogle({ callbackUrl: '/dashboard' });
	const handleSignOut = () => signOut({ callbackUrl: '/' });

	// Loading state
	if (isSessionLoading) {
		return <LoadingState variant={variant} />;
	}

	// Signed out state
	if (!user) {
		return (
			<SignInState
				variant={variant}
				className={className}
				onSignIn={handleSignIn}
				isSigningIn={isSigningIn}
			/>
		);
	}

	// Signed in state with dropdown menu
	if (variant === 'sidebar') {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuButton className='justify-between'>
						<UserAvatar
							user={user}
							showName
						/>
					</SidebarMenuButton>
				</DropdownMenuTrigger>

				<AuthDropdownContent
					user={user}
					onSignOut={handleSignOut}
					isSigningOut={isSigningOut}
				/>
			</DropdownMenu>
		);
	}

	// Regular button variant with dropdown
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					startIcon={<UserAvatar user={user} />}
				>
					<span className='max-w-[160px] truncate'>{user.name || user.email}</span>
				</Button>
			</DropdownMenuTrigger>

			<AuthDropdownContent
				user={user}
				onSignOut={handleSignOut}
				isSigningOut={isSigningOut}
			/>
		</DropdownMenu>
	);
}
