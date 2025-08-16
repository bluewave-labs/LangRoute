import type { Metadata } from 'next';

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
		<html lang='en'>
			<body>{children}</body>
		</html>
	);
}
