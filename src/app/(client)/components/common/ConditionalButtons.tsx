'use client';

import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { useSessionUser } from '@hooks/data';

import { Button } from '@components';

/**
 * Navigation buttons component that conditionally renders based on authentication state.
 * Shows "Sign In" for unauthenticated users and "Go to Dashboard" for authenticated users.
 */
export function NavButtons() {
	const { user, isLoading } = useSessionUser();

	if (isLoading) {
		return (
			<Button
				variant='ghost'
				loading
				loadingText='Loading...'
			/>
		);
	}

	return user ? (
		<Button
			variant='ghost'
			asChild
		>
			<Link href='/dashboard'>Go to Dashboard</Link>
		</Button>
	) : (
		<Button
			variant='ghost'
			asChild
		>
			<Link href='/login'>Sign In</Link>
		</Button>
	);
}

/**
 * Hero CTA buttons component that conditionally renders based on authentication state.
 * Shows different CTAs for authenticated vs unauthenticated users.
 */
export function HeroCTAButtons() {
	const { user, isLoading } = useSessionUser();

	if (isLoading) {
		return (
			<>
				<Button
					size='lg'
					loading
					loadingText='Loading...'
				/>
				<Button
					variant='outline'
					size='lg'
					loading
					loadingText='Loading...'
				/>
			</>
		);
	}

	return user ? (
		<>
			<Button
				size='lg'
				endIcon={<ArrowRight className='h-4 w-4' />}
				asChild
			>
				<Link href='/dashboard'>Go to Dashboard</Link>
			</Button>
			<Button
				variant='outline'
				size='lg'
				asChild
			>
				<Link href='/key-management'>Manage API Keys</Link>
			</Button>
		</>
	) : (
		<>
			<Button
				size='lg'
				endIcon={<ArrowRight className='h-4 w-4' />}
				asChild
			>
				<Link href='/register'>Start Free Trial</Link>
			</Button>
			<Button
				variant='outline'
				size='lg'
				asChild
			>
				<Link href='/login'>Sign In to Dashboard</Link>
			</Button>
		</>
	);
}
