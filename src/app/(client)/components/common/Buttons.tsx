import * as React from 'react';

import { cva } from 'class-variance-authority';

import { Button as ShadcnButton } from '@shadcn-ui';

import { cn } from '@lib/utils';

// Explicit type definitions for strong IntelliSense (matches shadcn exactly)
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

/** Brand color options for enhanced visual hierarchy */
export type ButtonColor = 'primary' | 'secondary' | 'neutral' | 'destructive';

/** Additive color variants that extend shadcn's base styling */
const buttonColorVariants = cva('', {
	variants: {
		variant: {
			default: '',
			destructive: '',
			outline: '',
			secondary: '',
			ghost: '',
			link: '',
		},
		color: {
			primary: '',
			secondary: '',
			neutral: '',
			destructive: '',
		},
	},
	compoundVariants: [
		// Primary brand styling for solid buttons
		{
			variant: 'default',
			color: 'primary',
			class: 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/50',
		},
		// Primary brand styling for outline buttons
		{
			variant: 'outline',
			color: 'primary',
			class:
				'border-primary text-primary hover:bg-primary/10 hover:text-primary/90 dark:hover:bg-primary/20 focus-visible:ring-primary/20',
		},
		// Primary brand styling for link buttons
		{
			variant: 'link',
			color: 'primary',
			class: 'text-primary hover:text-primary/80 underline-offset-4 hover:underline',
		},
		// Destructive outline styling
		{
			variant: 'outline',
			color: 'destructive',
			class:
				'border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
		},
		// Destructive link styling
		{
			variant: 'link',
			color: 'destructive',
			class: 'text-destructive hover:text-destructive/80 underline-offset-4 hover:underline',
		},
	],
	defaultVariants: {
		variant: 'default',
		color: 'primary',
	},
});

/** Loading spinner component */
const Spinner = ({ size }: { size: ButtonSize }) => {
	const spinnerSizeClasses = {
		sm: 'size-3.5',
		default: 'size-4',
		lg: 'size-5',
		icon: 'size-4',
	};

	return (
		<svg
			className={cn('animate-spin', spinnerSizeClasses[size || 'default'])}
			viewBox='0 0 24 24'
			fill='none'
			aria-hidden='true'
		>
			<circle
				className='opacity-25'
				cx='12'
				cy='12'
				r='10'
				stroke='currentColor'
				strokeWidth='4'
			/>
			<path
				className='opacity-75'
				fill='currentColor'
				d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
			/>
		</svg>
	);
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/**
	 * Visual variant following shadcn's design system
	 * @default "default"
	 */
	variant?: ButtonVariant;

	/**
	 * Size following shadcn's design system
	 * @default "default"
	 */
	size?: ButtonSize;

	/**
	 * Brand color theme for enhanced visual hierarchy
	 * - primary: Brand color (#334155)
	 * - secondary: Secondary theme color
	 * - neutral: Default theme neutral
	 * - destructive: Destructive/error color
	 * @default "primary"
	 */
	color?: ButtonColor;

	/**
	 * Shows loading spinner and disables interaction
	 * Sets aria-busy="true" for accessibility
	 * @default false
	 */
	loading?: boolean;

	/**
	 * Optional text to show when loading
	 * If not provided, shows spinner alongside existing children
	 */
	loadingText?: string;

	/**
	 * Icon to display before button text
	 * Size automatically matches button size
	 */
	startIcon?: React.ReactNode;

	/**
	 * Icon to display after button text
	 * Size automatically matches button size
	 */
	endIcon?: React.ReactNode;

	/**
	 * Makes button take full width of container
	 * @default false
	 */
	fullWidth?: boolean;

	/**
	 * Renders as child element using Radix Slot
	 * Useful for rendering as Link or other components
	 * @default false
	 */
	asChild?: boolean;
}

/**
 * Professional UI-library-grade Button component built on shadcn/ui
 *
 * Features:
 * - Preserves shadcn's variant and size system exactly
 * - Adds brand color theming with Figma blue (#334155)
 * - Loading states with spinner and aria-busy
 * - Start/end icon slots with proper sizing
 * - Full TypeScript support with excellent IntelliSense
 * - Accessibility by default (ARIA, focus, keyboard)
 * - Polymorphic rendering with asChild (Radix Slot)
 *
 * @example
 * ```tsx
 * // Solid primary (brand) — default
 * <Button>Save</Button>
 *
 * // Outline primary (brand border/text)
 * <Button variant="outline" color="primary">Edit</Button>
 *
 * // Link primary (brand text)
 * <Button variant="link" color="primary" asChild>
 *   <a href="/docs">Learn more</a>
 * </Button>
 *
 * // Loading with text
 * <Button loading loadingText="Saving…">Save</Button>
 *
 * // With icons
 * <Button startIcon={<PlusIcon />}>New Project</Button>
 *
 * // Icon-only (requires aria-label)
 * <Button size="icon" aria-label="Close">
 *   <XIcon />
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = 'default',
			size = 'default',
			color = 'primary',
			loading = false,
			loadingText,
			startIcon,
			endIcon,
			fullWidth = false,
			asChild = false,
			disabled,
			type,
			children,
			...props
		},
		ref,
	) => {
		// Determine if button is disabled (loading or explicitly disabled)
		const isDisabled = disabled || loading;

		// Get icon size classes based on button size
		const iconSizeClasses = {
			sm: 'size-3.5',
			default: 'size-4',
			lg: 'size-5',
			icon: 'size-4',
		};

		const iconSize = iconSizeClasses[size || 'default'];

		// Apply icon sizing to React elements
		const renderIcon = (icon: React.ReactNode) => {
			if (!icon) return null;
			return (
				<span
					className={iconSize}
					aria-hidden='true'
				>
					{icon}
				</span>
			);
		};

		// Build color classes
		const colorClasses = buttonColorVariants({ variant, color });

		// Content to render
		const content = loading && loadingText ? loadingText : children;

		// Dev-time warning for icon buttons without aria-label
		if (process.env.NODE_ENV === 'development' && size === 'icon' && !props['aria-label']) {
			console.warn('Button with size="icon" should have an aria-label for accessibility');
		}

		// Handle asChild case - pass through to ShadcnButton
		if (asChild) {
			return (
				<ShadcnButton
					ref={ref}
					variant={variant}
					size={size}
					asChild
					disabled={isDisabled}
					type={type || 'button'}
					aria-busy={loading}
					className={cn(
						colorClasses,
						variant !== 'link' && 'no-underline',
						fullWidth && 'w-full',
						className,
					)}
					{...props}
				>
					{children}
				</ShadcnButton>
			);
		}

		return (
			<ShadcnButton
				ref={ref}
				variant={variant}
				size={size}
				disabled={isDisabled}
				type={type || 'button'}
				aria-busy={loading}
				className={cn(
					colorClasses,
					variant !== 'link' && 'no-underline',
					fullWidth && 'w-full',
					className,
				)}
				{...props}
			>
				{loading && !loadingText && <Spinner size={size} />}
				{startIcon && renderIcon(startIcon)}
				{content}
				{endIcon && renderIcon(endIcon)}
			</ShadcnButton>
		);
	},
);

Button.displayName = 'Button';

export default Button;
export { buttonColorVariants };
