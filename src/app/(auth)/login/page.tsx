'use client';

import React, { FormEvent } from 'react';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

import { Button, FormInput } from '@/components';

import AuthFormWrapper from '../components/AuthFormWrapper';

export default function LoginPage() {
	const router = useRouter();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		router.push('/dashboard');
	};

	return (
		<AuthFormWrapper>
			<h1 className='h1'>Login to your account</h1>
			<form
				className='min-w-[25em]'
				onSubmit={handleSubmit}
			>
				<div className='mb-10 flex flex-col gap-5'>
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
						placeHolder='********'
					/>
				</div>
				<div>
					<Button
						type='submit'
						className='w-full'
					>
						Login
					</Button>
				</div>
			</form>
			<NextLink href='#'>Forgot your password?</NextLink>
		</AuthFormWrapper>
	);
}
