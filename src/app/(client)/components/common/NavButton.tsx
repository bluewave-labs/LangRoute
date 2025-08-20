import * as React from 'react';

import { cn } from '@lib/utils';

import { Button, type ButtonProps } from './Buttons';

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

	/**
	 * Override color (defaults to neutral for nav items)
	 * @default "neutral"
	 */
	color?: ButtonProps['color'];
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
 *
 * Usage:
 * ```tsx
 * <NavButton asChild isActive={pathname === '/dashboard'}>
 *   <Link href="/dashboard">
 *     <Icon className="w-4 h-4" />
 *     Dashboard
 *   </Link>
 * </NavButton>
 * ```
 */
export const NavButton = React.forwardRef<HTMLButtonElement, NavButtonProps>(
	(
		{ className, isActive = false, variant = 'ghost', color = 'neutral', children, ...props },
		ref,
	) => {
		// Active state classes - additive to Button's base styling
		const activeClasses = isActive
			? cn(
					// Active background and text colors using design tokens
					'bg-primary/10 text-primary',
					'hover:bg-primary/15 hover:text-primary',
					'dark:bg-primary/20 dark:text-primary-foreground',
					'dark:hover:bg-primary/25',
					// Enhanced focus ring for active items
					'focus-visible:ring-primary/30',
					// Font weight emphasis for active state
					'font-medium',
				)
			: '';

		return (
			<Button
				ref={ref}
				variant={variant}
				color={color}
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
