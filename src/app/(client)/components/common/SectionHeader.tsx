import { ReactNode } from 'react';

interface SectionHeaderProps {
	title: string;
	icon?: ReactNode;
	className?: string;
}

/**
 * Reusable section header component with optional icon
 * Used for organizing dashboard sections
 */
export default function SectionHeader({ title, icon, className = '' }: SectionHeaderProps) {
	return (
		<div className={`flex items-center space-x-2 ${className}`}>
			{icon && (
				<div className='bg-muted flex h-6 w-6 items-center justify-center rounded-full'>{icon}</div>
			)}
			<h3 className='text-lg font-semibold'>{title}</h3>
		</div>
	);
}
