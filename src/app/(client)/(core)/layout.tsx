import type { Metadata } from 'next';

import { SidebarProvider } from '@shadcn-ui';

import { PageHeader, Sidebar } from '@components';

export const metadata: Metadata = {
	title: 'Dashboard',
	description: 'Dashboard pages',
};
/**
 * Provides the layout for dashboard pages, rendering the given children within the body element.
 *
 * Intended to wrap all dashboard-related content with a consistent HTML and language configuration.
 *
 * @param children - The content to display within the dashboard layout
 */
export default function CoreLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<div className='bg-background text-foreground flex min-h-svh w-full flex-col md:flex-row'>
				<Sidebar />
				<div className='flex min-h-svh flex-1 flex-col'>
					<PageHeader />
					<main className='flex-1 overflow-auto'>{children}</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
