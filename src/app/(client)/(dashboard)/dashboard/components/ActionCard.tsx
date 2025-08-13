import { ReactNode } from 'react';

import Link from 'next/link';

import { Button } from '@/app/(client)/components/ui/button';

import DashboardCard from './DashboardCard';

interface ActionCardProps {
	title: string;
	description: string;
	actionLabel: string;
	actionIcon?: ReactNode;
	href?: string;
	onClick?: () => void;
	variant?: 'default' | 'outline';
	external?: boolean;
	className?: string;
}

/**
 * Reusable action card component for dashboard navigation
 * Supports both internal navigation and external links
 */
export default function ActionCard({
	title,
	description,
	actionLabel,
	actionIcon,
	href,
	onClick,
	variant = 'outline',
	external = false,
	className = '',
}: ActionCardProps) {
	const buttonContent = (
		<Button
			variant={variant}
			className='w-full'
			size='sm'
			onClick={onClick}
		>
			{actionIcon && <span className='mr-2'>{actionIcon}</span>}
			{actionLabel}
		</Button>
	);

	const actionElement = href ? (
		<Button
			variant={variant}
			className='w-full'
			size='sm'
			asChild
		>
			{external ? (
				<a
					href={href}
					target='_blank'
					rel='noopener noreferrer'
				>
					{actionIcon && <span className='mr-2'>{actionIcon}</span>}
					{actionLabel}
				</a>
			) : (
				<Link href={href}>
					{actionIcon && <span className='mr-2'>{actionIcon}</span>}
					{actionLabel}
				</Link>
			)}
		</Button>
	) : (
		buttonContent
	);

	return (
		<DashboardCard
			title={title}
			description={description}
			footer={actionElement}
			className={className}
		/>
	);
}
