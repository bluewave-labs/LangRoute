import { ReactNode } from 'react';

import { Separator } from '@/components';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
	children: ReactNode;
	className?: string;
}

export default function PageHeader({ children, className, ...props }: PageHeaderProps) {
	return (
		<div
			className={cn(className)}
			{...props}
		>
			<div className='p-5 pl-20'>
				<header className='h3'>{children}</header>
			</div>
			<Separator />
		</div>
	);
}
