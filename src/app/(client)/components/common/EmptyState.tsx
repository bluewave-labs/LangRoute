import { HTMLAttributes, ReactNode } from 'react';

import { EmptyStateIcon } from '@icons';

import { Button } from '@components';

import { cn } from '@lib/utils';

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
	message: string;
	icon?: ReactNode;
	buttonText?: string;
	buttonAction?: () => void;
	children?: ReactNode;
}

/**
 * A reusable empty state component for empty items, such as tables, that are completely out of data.
 * For example, in the parent component, we can handle the following code:
 * {!data.length && <EmptyState message="No contacts found." icon={<EmptyStateIcon />}}
 *
 * @param {string} [message] - The message of empty states. Required.
 * @param {ReactNode} [icon = <EmptyStateIcon />] - The icon of empty states. Optional.
 * @param {string} [buttonText] - The button text of empty states. Optional.
 * @param {() => void} [buttonAction] - The button action of empty states. Optional.
 * @param {ReactNode} [children] - Custom JSX elements for more complex empty states (e.g., multiple buttons or additional text). Optional.
 *
 * @returns {JSX.Element} A scalable and responsive design including a message, icon, button, or passed children.
 */

export default function EmptyState({
	message,
	icon = <EmptyStateIcon />,
	buttonText,
	buttonAction,
	children,
	className,
	...props
}: EmptyStateProps) {
	return (
		<div
			className={cn('container flex flex-col items-center py-10 md:py-12 lg:py-16', className)}
			{...props}
		>
			{icon && <div className='mb-1 box-border md:mb-2 lg:mb-4'>{icon}</div>}

			<div>
				<p>{message}</p>
			</div>

			{buttonText && buttonAction ? (
				<div className='mt-12 md:mt-14 lg:mt-16'>
					<Button onClick={buttonAction}>{buttonText}</Button>
				</div>
			) : (
				children && <div className='mt-12 md:mt-14 lg:mt-16'>{children}</div>
			)}
		</div>
	);
}
