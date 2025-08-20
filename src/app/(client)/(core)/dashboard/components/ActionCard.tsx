import { ReactNode } from 'react';

import Link from 'next/link';

import { Button, ButtonProps } from '@components';

import DashboardCard from './DashboardCard';

interface ActionCardProps {
	title: string;
	description: string;
	actionLabel: string;
	actionIcon?: ReactNode;
	href?: string;
	onClick?: () => void;
	variant?: ButtonProps['variant']; // Align with Button's expected variant type
	external?: boolean;
	className?: string;
}

/**
 * Reusable action card component for dashboard navigation
 * Primary actions use the Figma blue (#334155). Secondary actions are outline buttons.
 * Uses app-level Button wrapper to keep styles DRY and consistent.
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
	const isPrimary = variant === 'default';

	// Determine button color based on variant
	const buttonColor = isPrimary ? 'primary' : variant === 'link' ? 'primary' : 'neutral';

	const buttonProps = {
		variant,
		color: buttonColor,
		fullWidth: true,
		startIcon: actionIcon,
		className: !isPrimary ? 'self-end' : undefined,
	} as const;

	const ButtonInner = href ? (
		<Button
			asChild
			{...buttonProps}
		>
			{external ? (
				<a
					href={href}
					target='_blank'
					rel='noopener noreferrer'
				>
					{actionLabel}
				</a>
			) : (
				<Link href={href}>{actionLabel}</Link>
			)}
		</Button>
	) : (
		<Button
			onClick={onClick}
			{...buttonProps}
		>
			{actionLabel}
		</Button>
	);

	return (
		<DashboardCard
			title={title}
			description={description}
			footer={ButtonInner}
			className={className}
		/>
	);
}
