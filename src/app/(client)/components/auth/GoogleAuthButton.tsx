'use client';

import { useMemo } from 'react';

import { LogOut } from 'lucide-react';

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	SidebarMenuButton,
} from '@shadcn-ui';

import { useGoogleSignInMutation, useSessionUser, useSignOutMutation } from '@hooks/data';

type Props = {
	variant?: 'button' | 'sidebar';
	className?: string;
};

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

export default function GoogleAuthButton({ variant = 'button', className }: Props) {
	const { user, isLoading: isSessionLoading } = useSessionUser();
	const { mutate: signInWithGoogle, isPending: isSigningIn } = useGoogleSignInMutation();
	const { mutate: signOut, isPending: isSigningOut } = useSignOutMutation();

	const initials = useMemo(() => {
		const basis = user?.name || user?.email || 'U';
		return basis
			.split(' ')
			.map((p) => p[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	}, [user]);

	// Fallback "button" variant (non-sidebar usage)
	if (isSessionLoading) {
		const Trigger = variant === 'sidebar' ? SidebarMenuButton : Button;
		return (
			<Trigger
				className={variant === 'sidebar' ? 'justify-between' : ''}
				disabled
			>
				<div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
				<span className='sr-only'>Loading…</span>
			</Trigger>
		);
	}

	// Signed out → plain Google CTA (no menu)
	if (!user) {
		const Trigger = variant === 'sidebar' ? SidebarMenuButton : Button;
		return (
			<Trigger
				onClick={() => signInWithGoogle({ callbackUrl: '/dashboard' })}
				variant={variant === 'sidebar' ? undefined : 'outline'}
				className={
					variant === 'sidebar'
						? 'justify-between'
						: `inline-flex items-center gap-2 ${className ?? ''}`
				}
				aria-label='Continue with Google'
			>
				<div className='flex items-center gap-2'>
					<GoogleIcon />
					<span className='truncate'>{isSigningIn ? 'Signing in…' : 'Continue with Google'}</span>
				</div>
			</Trigger>
		);
	}

	// Signed in → dropdown menu with Sign out
	const Trigger = variant === 'sidebar' ? SidebarMenuButton : Button;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Trigger className={variant === 'sidebar' ? 'justify-between' : `gap-2 ${className ?? ''}`}>
					<div className='flex items-center gap-2'>
						<Avatar className='h-6 w-6 rounded-md'>
							<AvatarImage
								src={user.avatarUrl ?? undefined}
								alt={user.name || user.email}
							/>
							<AvatarFallback className='text-xs'>{initials}</AvatarFallback>
						</Avatar>
						{variant === 'sidebar' ? (
							<div className='min-w-0'>
								<h2 className='text-foreground truncate text-sm leading-tight font-semibold'>
									{user.name ?? 'Account'}
								</h2>
								<p className='text-muted-foreground max-w-[160px] truncate text-xs leading-tight'>
									{user.email}
								</p>
							</div>
						) : (
							<span className='max-w-[160px] truncate'>{user.name || user.email}</span>
						)}
					</div>
				</Trigger>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align='end'
				side='top'
				className='m-3 w-60'
			>
				<DropdownMenuLabel>
					<div className='flex items-center gap-2'>
						<Avatar className='h-7 w-7 rounded-md'>
							<AvatarImage
								src={user.avatarUrl ?? undefined}
								alt={user.name || user.email}
							/>
							<AvatarFallback className='text-xs'>{initials}</AvatarFallback>
						</Avatar>
						<div className='min-w-0'>
							<p className='truncate text-sm font-medium'>{user.name ?? 'Account'}</p>
							<p className='text-muted-foreground truncate text-xs'>{user.email}</p>
						</div>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					onClick={() => signOut({ callbackUrl: '/' })}
					disabled={isSigningOut}
					className='text-destructive focus:text-destructive'
				>
					<LogOut className='mr-2 h-4 w-4' />
					{isSigningOut ? 'Signing out…' : 'Sign out'}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
