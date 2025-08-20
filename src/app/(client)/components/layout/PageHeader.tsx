'use client';

import { HTMLAttributes } from 'react';

import { usePathname } from 'next/navigation';

import { Separator } from '@shadcn-ui';

import { useIsMobile } from '@hooks';

import { matchNav } from '@lib/config/nav';
import { cn } from '@lib/utils';

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
	className?: string;
}

export default function PageHeader({ className, ...props }: PageHeaderProps) {
	const pathname = usePathname();
	const current = matchNav(pathname);
	const isMobile = useIsMobile();

	// Hide on mobile and when route is not in the nav map
	if (!current || isMobile) return null;

	return (
		<div
			className={cn(className)}
			{...props}
		>
			<div className='p-5 pl-20'>
				<header className='h3'>{current.label}</header>
			</div>
			<Separator />
		</div>
	);
}
