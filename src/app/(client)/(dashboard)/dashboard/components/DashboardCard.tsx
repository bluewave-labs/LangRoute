import { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@components';

interface DashboardCardProps {
	title: string;
	description: string;
	icon?: ReactNode;
	children?: ReactNode;
	footer?: ReactNode;
	className?: string;
}

/**
 * Reusable dashboard card component following Figma design specs
 * Features consistent spacing, typography, and hover effects
 */
export default function DashboardCard({
	title,
	description,
	icon,
	children,
	footer,
	className = '',
}: DashboardCardProps) {
	return (
		<Card className={`group transition-shadow hover:shadow-md ${className}`}>
			<CardHeader className='space-y-2'>
				{icon && <div className='flex h-6 w-6 items-center justify-center'>{icon}</div>}
				<CardTitle className='text-lg font-semibold'>{title}</CardTitle>
				<CardDescription className='text-muted-foreground text-sm'>{description}</CardDescription>
			</CardHeader>
			{children && <CardContent>{children}</CardContent>}
			{footer && <CardFooter>{footer}</CardFooter>}
		</Card>
	);
}
