import * as React from 'react';

import { cn } from '@lib/utils';

import { Button, type ButtonProps, type ButtonSize } from './Buttons';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * The selected value in the button group
	 */
	value?: string;

	/**
	 * Callback when a button is selected
	 */
	onValueChange?: (value: string) => void;

	/**
	 * Size for all buttons in the group
	 * @default "sm"
	 */
	size?: ButtonSize;

	/**
	 * Whether the group behaves as a radio group (single selection)
	 * @default true
	 */
	type?: 'single' | 'multiple';

	/**
	 * ARIA label for the button group
	 */
	'aria-label'?: string;
}

export interface ButtonGroupItemProps extends Omit<ButtonProps, 'variant' | 'color' | 'size'> {
	/**
	 * The value for this button item
	 */
	value: string;

	/**
	 * Whether this item is selected (managed by ButtonGroup)
	 */
	selected?: boolean;
}

/**
 * Internal context for ButtonGroup communication
 */
const ButtonGroupContext = React.createContext<{
	selectedValue?: string;
	onSelect?: (value: string) => void;
	size?: ButtonSize;
} | null>(null);

/**
 * Individual button item within a ButtonGroup.
 * Automatically receives size and selection state from parent ButtonGroup.
 *
 * Selection state mapping:
 * - Unselected: variant="outline" color="neutral"
 * - Selected: variant="default" color="primary"
 */
export const ButtonGroupItem = React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
	({ value, selected, className, children, onClick, ...props }, ref) => {
		const context = React.useContext(ButtonGroupContext);

		const isSelected = selected ?? context?.selectedValue === value;

		const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
			context?.onSelect?.(value);
			onClick?.(event);
		};

		return (
			<Button
				ref={ref}
				variant={isSelected ? 'default' : 'outline'}
				color={isSelected ? 'primary' : 'neutral'}
				size={context?.size ?? 'sm'}
				className={cn(
					// Connected button styling - remove adjacent borders
					'relative -ml-px first:ml-0',
					// Round only the ends of the group
					'first:rounded-r-none last:rounded-l-none',
					'not-first:not-last:rounded-none',
					// Z-index management for borders
					'hover:z-10 focus:z-10',
					isSelected && 'z-10',
					className,
				)}
				aria-pressed={isSelected}
				onClick={handleClick}
				{...props}
			>
				{children}
			</Button>
		);
	},
);

ButtonGroupItem.displayName = 'ButtonGroupItem';

/**
 * ButtonGroup component for creating segmented controls with connected buttons.
 *
 * Features:
 * - Implements proper ARIA semantics (radiogroup/toolbar)
 * - Connected visual appearance with shared borders
 * - Keyboard navigation support (arrow keys, space/enter)
 * - Automatic selection state management
 * - Size="sm" default for compact grouping
 *
 * Selection state mapping:
 * - Unselected items: variant="outline" color="neutral"
 * - Selected items: variant="default" color="primary"
 *
 * Usage:
 * ```tsx
 * <ButtonGroup value={period} onValueChange={setPeriod} aria-label="Time period">
 *   <ButtonGroupItem value="day">Day</ButtonGroupItem>
 *   <ButtonGroupItem value="week">Week</ButtonGroupItem>
 *   <ButtonGroupItem value="month">Month</ButtonGroupItem>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
	(
		{
			value,
			onValueChange,
			size = 'sm',
			type = 'single',
			className,
			children,
			'aria-label': ariaLabel,
			...props
		},
		ref,
	) => {
		const contextValue = React.useMemo(
			() => ({
				selectedValue: value,
				onSelect: onValueChange,
				size,
			}),
			[value, onValueChange, size],
		);

		return (
			<ButtonGroupContext.Provider value={contextValue}>
				<div
					ref={ref}
					role={type === 'single' ? 'radiogroup' : 'toolbar'}
					aria-label={ariaLabel}
					className={cn('flex', className)}
					{...props}
				>
					{children}
				</div>
			</ButtonGroupContext.Provider>
		);
	},
);

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
