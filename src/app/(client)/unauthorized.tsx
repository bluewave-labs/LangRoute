import Link from 'next/link';

import { Button } from '@components';

export default function UnauthorizedPage() {
	return (
		<main>
			<h1>401 - Unauthorized</h1>
			<p>Please log in to access this page.</p>
			<Button
				variant='default'
				color='primary'
				asChild
			>
				<Link href='/login'>Go to Login</Link>
			</Button>
		</main>
	);
}
