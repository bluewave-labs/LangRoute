import { HTMLAttributes, ReactNode } from 'react';

import { Separator } from '@shadcn-ui';

import { cn } from '@lib/utils';

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
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
