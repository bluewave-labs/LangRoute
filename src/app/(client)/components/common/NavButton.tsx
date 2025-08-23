import * as React from 'react';

import { cn } from '@lib/utils';

import { Button, type ButtonProps } from './Button';

export interface NavButtonProps extends Omit<ButtonProps, 'variant' | 'color'> {
	/**
	 * Whether this navigation item is currently active/selected
	 * When true, applies brand-colored active state styling
	 * @default false
	 */
	isActive?: boolean;

	/**
	 * Override variant (defaults to ghost for nav items)
	 * @default "ghost"
	 */
	variant?: ButtonProps['variant'];
}

/**
 * Navigation button component that wraps the shared Button with active state handling.
 *
 * Features:
 * - Uses variant="ghost" by default for navigation items
 * - Applies additive active state styling when isActive=true
 * - Supports asChild for Next.js Link integration
 * - Maintains full Button API compatibility
 * - Brand-colored active states using design tokens
 */
export const NavButton = React.forwardRef<HTMLButtonElement, NavButtonProps>(
	({ className, isActive = false, variant = 'ghost', children, ...props }, ref) => {
		// Active state classes - additive to Button's base styling
		const activeClasses = isActive
			? cn(
					'bg-primary/10 text-primary',
					'hover:bg-primary/15 hover:text-primary',
					'dark:bg-primary/20 dark:text-primary-foreground',
					'dark:hover:bg-primary/25',
					'focus-visible:ring-primary/30',
					'font-medium',
				)
			: '';

		return (
			<Button
				ref={ref}
				variant={variant}
				className={cn(activeClasses, className)}
				aria-current={isActive ? 'page' : undefined}
				{...props}
			>
				{children}
			</Button>
		);
	},
);

NavButton.displayName = 'NavButton';

export default NavButton;
