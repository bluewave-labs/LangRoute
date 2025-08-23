import React from 'react';

import { Button } from '@components';

/**
 * Renders a centered "Forgot Password" page with a form for users to request a password reset by entering their email address.
 *
 * The component displays a styled container with a heading, an email input field, and a submit button. No form submission logic or validation is included.
 */
export default function ForgotPasswordPage() {
	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-100'>
			<div className='w-full max-w-md rounded-lg bg-white p-8 shadow-md'>
				<h1 className='mb-6 text-center text-2xl font-bold'>Forgot Password</h1>
				<form>
					<div className='mb-4'>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700'
						>
							Email
						</label>
						<input
							type='email'
							id='email'
							className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring focus:ring-indigo-200 focus:outline-none'
							placeholder='Enter your email'
						/>
					</div>
					<Button
						type='submit'
						variant='default'
						size='default'
						fullWidth
						loading={false}
					>
						Reset Password
					</Button>
				</form>
			</div>
		</div>
	);
}
