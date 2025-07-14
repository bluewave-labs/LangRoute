import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Auth',
	description: 'Authentication pages',
};

/**
 * Provides the HTML layout structure for authentication pages, setting the language to English and rendering the given content inside the body.
 *
 * @param children - The content to display within the authentication layout
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	);
}
