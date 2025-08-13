import { ReactNode } from 'react';

import { Button } from '@/app/(client)/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/app/(client)/components/ui/card';

interface GetStartedCardProps {
	title: string;
	description: string;
	icon: ReactNode;
	actionLabel: string;
	actionIcon?: ReactNode;
	onAction?: () => void;
	className?: string;
}

/**
 * Reusable "Get Started" card component for onboarding flows
 * Features responsive layout and call-to-action button
 */
export default function GetStartedCard({
	title,
	description,
	icon,
	actionLabel,
	actionIcon,
	onAction,
	className = '',
}: GetStartedCardProps) {
	return (
		<Card className={`shadow-sm ${className}`}>
			<CardHeader>
				<div className='flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0'>
					<div className='flex items-center space-x-3'>
						<div className='bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
							{icon}
						</div>
						<div className='min-w-0 flex-1'>
							<CardTitle className='text-lg font-semibold'>{title}</CardTitle>
							<CardDescription className='text-muted-foreground text-sm'>
								{description}
							</CardDescription>
						</div>
					</div>
					<Button
						variant='outline'
						size='sm'
						className='shrink-0'
						onClick={onAction}
					>
						{actionIcon && <span className='mr-2'>{actionIcon}</span>}
						{actionLabel}
					</Button>
				</div>
			</CardHeader>
		</Card>
	);
}
