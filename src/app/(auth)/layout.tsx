import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Auth',
	description: 'Authentication pages',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	);
}
