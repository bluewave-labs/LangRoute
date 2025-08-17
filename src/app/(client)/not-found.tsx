import Link from 'next/link';

import { Button } from '@components';

export default function NotFound() {
	return (
		<div>
			<h2>Not Found</h2>
			<p>Could not find requested resource</p>
			<Button
				variant='default'
				color='primary'
				asChild
			>
				<Link href='/'>Return Home</Link>
			</Button>
		</div>
	);
}
