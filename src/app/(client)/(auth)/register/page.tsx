'use client';

import React, { FormEvent } from 'react';

import { useRouter } from 'next/navigation';

import { Button, FormInput } from '@components';

import AuthFormWrapper from '../components/AuthFormWrapper';

export default function RegisterPage() {
	const router = useRouter();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		router.push('/dashboard');
	};

	return (
		<AuthFormWrapper>
			<div className='flex flex-col items-center'>
				<h1 className='h1'>Create an account</h1>
				<p className='body2'>Enter your credentials below to create your account</p>
			</div>
			<form
				className='min-w-[25em]'
				onSubmit={handleSubmit}
			>
				<div className='mb-10 flex flex-col gap-5'>
					<FormInput
						label='First name'
						name='firstName'
						placeHolder='Enter your first name'
					/>
					<FormInput
						label='Last name'
						name='lastName'
						placeHolder='Enter your last name'
					/>
					<FormInput
						label='Email'
						type='email'
						name='email'
						placeHolder='m@example.com'
					/>
					<FormInput
						label='Password'
						type='password'
						name='password'
						placeHolder='Create a password'
					/>
					<FormInput
						label='Confirm password'
						type='password'
						name='confirmPassword'
						placeHolder='Confirm your password'
					/>
				</div>
				<div>
					<Button
						type='submit'
						fullWidth
						loading={false}
					>
						Create your account
					</Button>
				</div>
			</form>
		</AuthFormWrapper>
	);
}
