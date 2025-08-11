import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and merges class names, resolving Tailwind CSS conflicts.
 *
 * Accepts any number of class name values, combines them using `clsx`, and merges them with `twMerge` to produce an optimized Tailwind CSS class string.
 *
 * @returns The merged and deduplicated class name string
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
