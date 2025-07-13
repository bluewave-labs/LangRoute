import React from 'react';

export default function RegisterPage() {
	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-100'>
			<div className='w-full max-w-md rounded-lg bg-white p-8 shadow-md'>
				<h1 className='mb-6 text-center text-2xl font-bold'>Register</h1>
				<form>
					<div className='mb-4'>
						<label
							htmlFor='username'
							className='block text-sm font-medium text-gray-700'
						>
							Username
						</label>
						<input
							type='text'
							id='username'
							className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring focus:ring-indigo-200 focus:outline-none'
							placeholder='Enter your username'
						/>
					</div>
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
					<div className='mb-4'>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-gray-700'
						>
							Password
						</label>
						<input
							type='password'
							id='password'
							className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring focus:ring-indigo-200 focus:outline-none'
							placeholder='Enter your password'
						/>
					</div>
					<button
						type='submit'
						className='w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:ring focus:ring-indigo-300 focus:outline-none'
					>
						Register
					</button>
				</form>
			</div>
		</div>
	);
}
