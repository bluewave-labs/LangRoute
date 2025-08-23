import * as React from 'react';

import { Button as ShadcnButton } from '@shadcn-ui';

import { cn } from '@lib/utils';

// Export individual types for backward compatibility
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'ghost' | 'link' | 'secondary';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

// Spinner size mapping based on button size
const SPINNER_SIZE = {
	sm: 'size-4',
	default: 'size-4',
	lg: 'size-5',
	icon: 'size-4',
} as const;

// Icon size mapping for lucide icons
const ICON_SIZE = {
	sm: 16,
	default: 18,
	lg: 20,
	icon: 18,
} as const;

// Simple spinner component
function Spinner({ className }: { className?: string }) {
	return (
		<svg
			className={cn('animate-spin', className)}
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
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
}

// Helper to size lucide icons
function sizeLucideIcon(node: React.ReactNode, size: ButtonSize): React.ReactNode {
	if (!React.isValidElement(node)) return node;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const t = node.type as any;
	const isLucide =
		typeof t === 'function' &&
		(t.displayName?.startsWith('Lucide') || t.name?.startsWith('Lucide'));
	if (!isLucide) return node;

	// If caller already provided size prop or explicit tailwind size classes, skip.
	// (Allows caller overrides like h-4 w-4 or !h-5)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const props: any = node.props;
	const className: string | undefined = props.className;
	const hasExplicitSizeClass =
		typeof className === 'string' && /\b(!?h-|!?w-|!?size-)/.test(className);

	if (props.size || hasExplicitSizeClass) return node;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return React.cloneElement(node as any, {
		size: ICON_SIZE[size],
	});
}

/**
 * Button component that wraps shadcn/ui Button with enhanced features.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Visual variant of the button */
	variant?: ButtonVariant;
	/** Size of the button */
	size?: ButtonSize;
	/** Icon to display before button text */
	startIcon?: React.ReactNode;
	/** Icon to display after button text */
	endIcon?: React.ReactNode;
	/** Makes button take full width of container */
	fullWidth?: boolean;
	/** Renders as child element (polymorphic component) */
	asChild?: boolean;
	/** Shows loading spinner and disables button */
	loading?: boolean;
	/** Text to display when loading (replaces children) */
	loadingText?: string;
	/** Explicitly marks button as icon-only */
	iconOnly?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant,
			size = 'default',
			startIcon,
			endIcon,
			fullWidth = false,
			asChild = false,
			type = 'button',
			className,
			children,
			loading = false,
			loadingText,
			iconOnly = false,
			disabled,
			...props
		},
		ref,
	) => {
		// ----- iconOnly source resolution -----
		// When asChild is used, treat the child element's own children as the effective content.
		const childWrapperEl =
			asChild && React.isValidElement(children) ? (children as React.ReactElement) : null;
		const effectiveChildren = childWrapperEl
			? (childWrapperEl.props as { children?: React.ReactNode }).children
			: children;

		let validChildElement: React.ReactElement | null = null;
		if (Array.isArray(effectiveChildren)) {
			if (effectiveChildren.length === 1 && React.isValidElement(effectiveChildren[0])) {
				validChildElement = effectiveChildren[0];
			}
		} else if (React.isValidElement(effectiveChildren)) {
			validChildElement = effectiveChildren;
		}

		const hasStart = !!startIcon;
		const hasEnd = !!endIcon;
		const hasValidChildIcon = !!validChildElement;

		const totalIconSources = (hasStart ? 1 : 0) + (hasEnd ? 1 : 0) + (hasValidChildIcon ? 1 : 0);

		if (process.env.NODE_ENV !== 'production' && iconOnly) {
			if (totalIconSources !== 1) {
				console.error(
					`Button: iconOnly requires exactly one icon source (found ${totalIconSources}).`,
				);
			}
			if (!props['aria-label']) {
				console.error('Button: iconOnly requires aria-label for accessibility.');
			}
			if (loadingText) {
				console.warn('Button: loadingText ignored in iconOnly mode.');
			}
			if (size !== 'icon') {
				console.warn(`Button: iconOnly typically used with size="icon" (current: "${size}").`);
			}
			if (!hasValidChildIcon && effectiveChildren && !React.isValidElement(effectiveChildren)) {
				console.error('Button: iconOnly children must be a single React element (icon).');
			}
		}

		let sizedIconOnly: React.ReactNode = null;
		if (iconOnly && totalIconSources === 1) {
			if (hasValidChildIcon) {
				sizedIconOnly = sizeLucideIcon(validChildElement, size);
			} else if (hasStart) {
				sizedIconOnly = sizeLucideIcon(startIcon, size);
			} else if (hasEnd) {
				sizedIconOnly = sizeLucideIcon(endIcon, size);
			}
		}

		// Size start/end icons (non-iconOnly path)
		const sizedStartIcon = startIcon ? sizeLucideIcon(startIcon, size) : null;
		const sizedEndIcon = endIcon ? sizeLucideIcon(endIcon, size) : null;

		const baseContent = iconOnly ? (
			sizedIconOnly
		) : (
			<>
				{sizedStartIcon && <span className='shrink-0'>{sizedStartIcon}</span>}
				{effectiveChildren}
				{sizedEndIcon && <span className='shrink-0'>{sizedEndIcon}</span>}
			</>
		);

		// Construct inner spans (no outer wrapper div so asChild root is correct element)
		const baseSpan = (
			<span className={cn('inline-flex items-center gap-2', loading && 'invisible')}>
				{baseContent}
			</span>
		);
		const overlaySpan = loading ? (
			<span className='absolute inset-0 flex items-center justify-center gap-2'>
				<Spinner className={SPINNER_SIZE[size]} />
				{!iconOnly && loadingText && <span>{loadingText}</span>}
			</span>
		) : null;

		const rootClasses = cn(
			fullWidth && 'w-full',
			loading && 'relative',
			'no-underline cursor-pointer',
			className,
		);

		if (asChild) {
			if (process.env.NODE_ENV !== 'production' && !childWrapperEl) {
				console.error('Button: asChild requires a single valid React element as its child.');
				return null;
			}
			const injected = (
				<>
					{baseSpan}
					{overlaySpan}
				</>
			);
			const cloned = React.cloneElement(childWrapperEl!, {}, injected);
			return (
				<ShadcnButton
					ref={ref}
					variant={variant}
					size={size}
					asChild
					type={type}
					disabled={disabled || loading}
					aria-busy={loading || undefined}
					data-loading={loading ? '' : undefined}
					className={rootClasses}
					{...props}
				>
					{cloned}
				</ShadcnButton>
			);
		}

		// Normal (non-asChild) path
		return (
			<ShadcnButton
				ref={ref}
				variant={variant}
				size={size}
				type={type}
				disabled={disabled || loading}
				aria-busy={loading || undefined}
				data-loading={loading ? '' : undefined}
				className={rootClasses}
				{...props}
			>
				{baseSpan}
				{overlaySpan}
			</ShadcnButton>
		);
	},
);

Button.displayName = 'Button';

export default Button;
