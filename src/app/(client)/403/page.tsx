import { Metadata } from 'next';

export const metadata: Metadata = {
	title: '403 - Forbidden | LangRoute',
	description: 'Access forbidden - insufficient permissions',
};

/**
 * 403 Forbidden page component
 *
 * Displays a user-friendly error message when users attempt to access
 * resources they don't have permission to view. This page is used as
 * a redirect target for unauthorized access attempts.
 *
 * @returns JSX element containing the 403 error page
 */
export default function ForbiddenPage() {
	return (
		<main className='grid min-h-screen place-content-center p-8 text-center'>
			<h1 className='mb-4 text-3xl font-semibold'>403 – Forbidden</h1>
			<p className='text-muted-foreground'>You don&apos;t have permission to access this page.</p>
		</main>
	);
}
