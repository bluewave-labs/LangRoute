import Link from 'next/link';

export default function UnauthorizedPage() {
	return (
		<main>
			<h1>401 - Unauthorized</h1>
			<p>Please log in to access this page.</p>
			<Link href='/login'>
				<button className='btn-primary'>Go to Login</button>
			</Link>
		</main>
	);
}
