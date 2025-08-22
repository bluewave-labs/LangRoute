import { ReactNode } from 'react';

import { cn } from '@lib/utils';

interface AuthFormWrapperProps {
	children: ReactNode;
	className?: string;
}

export default function AuthFormWrapper({ children, className }: AuthFormWrapperProps) {
	return (
		<main className={cn('flex min-h-screen items-center justify-center', className)}>
			<div className='container flex min-w-lg flex-col items-center gap-10'>{children}</div>
		</main>
	);
}
