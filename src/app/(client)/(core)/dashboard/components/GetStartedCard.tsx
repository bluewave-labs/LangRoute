import { ReactNode } from 'react';

import { Card, CardDescription, CardHeader, CardTitle } from '@shadcn-ui';

import { Button } from '@components';

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
 * Matches Figma sizing and CTA color.
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
		<Card className={`bg-card rounded-xl border shadow-sm ${className}`}>
			<CardHeader className='p-5'>
				<div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
					<div className='flex items-center space-x-3'>
						<div className='bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg'>
							{icon}
						</div>
						<div className='min-w-0 flex-1'>
							<CardTitle className='text-base font-semibold md:text-lg'>{title}</CardTitle>
							<CardDescription className='text-muted-foreground text-sm'>
								{description}
							</CardDescription>
						</div>
					</div>
					<Button
						variant='default'
						color='primary'
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
