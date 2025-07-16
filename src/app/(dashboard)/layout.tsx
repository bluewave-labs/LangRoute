import type { Metadata } from 'next';

import AppSidebar from '@/components/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export const metadata: Metadata = {
	title: 'Dashboard',
	description: 'Dashboard pages',
};

/**
 * Provides the root HTML structure and layout for dashboard pages, rendering the given children within the body element.
 *
 * Intended to wrap all dashboard-related content with a consistent HTML and language configuration.
 *
 * @param children - The content to display within the dashboard layout
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='text-secondary-foreground flex h-screen w-screen flex-col overflow-hidden bg-gray-50 md:flex-row dark:bg-gray-900'>
			<SidebarProvider>
				<AppSidebar />
			</SidebarProvider>
			<div className='flex h-full grow flex-col'>{children}</div>
		</div>
	);
}
