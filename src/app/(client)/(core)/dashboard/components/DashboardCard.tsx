import { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@shadcn-ui';

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
 * - Tighter paddings and type scale
 * - Subtle hover
 * - Footer right-aligned and pinned to bottom
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
		<Card
			className={`group bg-card text-card-foreground flex h-full flex-col rounded-xl border shadow-sm transition-shadow hover:shadow-md ${className}`}
		>
			<CardHeader className='gap-2 pb-3'>
				{icon && <div className='flex h-6 w-6 items-center justify-center'>{icon}</div>}
				<CardTitle className='text-base font-semibold md:text-lg'>{title}</CardTitle>
				<CardDescription className='text-muted-foreground text-sm leading-relaxed'>
					{description}
				</CardDescription>
			</CardHeader>
			{children && <CardContent className='px-5 pb-0'>{children}</CardContent>}
			{footer && <CardFooter className='mt-auto flex justify-end pt-0'>{footer}</CardFooter>}
		</Card>
	);
}
