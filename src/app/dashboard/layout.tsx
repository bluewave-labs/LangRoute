import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Dashboard',
	description: 'Dashboard pages',
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
