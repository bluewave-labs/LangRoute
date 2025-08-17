'use client';

import { ChangeEvent, FocusEvent, useState } from 'react';

import { Button } from '@components';

import { cn } from '@lib/utils/classnames';

import { Input } from '../../../../shadcn-ui/input';
import { Label } from '../../../../shadcn-ui/label';

// Simple Eye icons as SVG components to avoid extra dependencies
const EyeIcon = () => (
	<svg
		width='16'
		height='16'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
		<circle
			cx='12'
			cy='12'
			r='3'
		/>
	</svg>
);

const EyeOffIcon = () => (
	<svg
		width='16'
		height='16'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<path d='M9.88 9.88a3 3 0 1 0 4.24 4.24' />
		<path d='M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 8 11 8a13.16 13.16 0 0 1-1.67 2.68' />
		<path d='M6.61 6.61A13.526 13.526 0 0 0 1 12s4 8 11 8a9.74 9.74 0 0 0 5.39-1.61' />
		<line
			x1='2'
			x2='22'
			y1='2'
			y2='22'
		/>
	</svg>
);

interface FormInputProps {
	label?: string;
	type?: string;
	id?: string;
	name: string;
	value?: string;
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
	placeHolder?: string;
	className?: string;
}

export default function FormInput({
	label,
	type = 'text',
	id,
	name,
	value,
	onChange,
	onBlur,
	placeHolder,
	className,
	...props
}: FormInputProps) {
	const inputId = id || `input-${name}`;
	const isPassword = type === 'password';
	const [showPassword, setShowPassword] = useState(false);

	const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className='flex flex-col gap-2'>
			{label && <Label htmlFor={inputId}>{label}</Label>}
			<div className='relative'>
				<Input
					{...props}
					id={inputId}
					type={inputType}
					name={name}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					placeholder={placeHolder}
					className={cn(isPassword && 'pr-12', className)}
				/>
				{isPassword && (
					<Button
						variant='ghost'
						size='icon'
						color='neutral'
						type='button'
						onClick={togglePasswordVisibility}
						aria-label={showPassword ? 'Hide password' : 'Show password'}
						className='absolute top-1/2 right-2 h-7 w-7 -translate-y-1/2'
					>
						{showPassword ? <EyeOffIcon /> : <EyeIcon />}
					</Button>
				)}
			</div>
		</div>
	);
}
