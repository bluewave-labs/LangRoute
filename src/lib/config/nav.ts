import type { LucideIcon } from 'lucide-react';
import { BarChart3, BookOpen, Brain, KeyRound, LayoutDashboard } from 'lucide-react';

export type NavItem = {
	label: string;
	href: string;
	icon: LucideIcon;
};

/**
 * - Dashboard: /dashboard
 * - Analytics: /analytics
 * - Logs: /logs
 * - Key Management: /key-management
 * - Models: /models
 */
export const NAV_ITEMS = [
	{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
	{ label: 'Analytics', href: '/analytics', icon: BarChart3 },
	{ label: 'Logs', href: '/logs', icon: BookOpen },
	{ label: 'Key Management', href: '/key-management', icon: KeyRound },
	{ label: 'Models', href: '/models', icon: Brain },
] as const satisfies ReadonlyArray<NavItem>;

/** Returns the longest matching nav item for the current pathname. */
export function matchNav(pathname: string | null | undefined): NavItem | undefined {
	if (!pathname) return undefined;
	// Prefer the longest matching prefix so nested paths (e.g. /logs/123) resolve correctly.
	return [...NAV_ITEMS]
		.sort((a, b) => b.href.length - a.href.length)
		.find((item) => pathname === item.href || pathname.startsWith(item.href + '/'));
}
