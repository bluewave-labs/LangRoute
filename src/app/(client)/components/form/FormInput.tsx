'use client';

import { ChangeEvent, FocusEvent, useState } from 'react';

import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { Input, Label } from '@shadcn-ui';

import { Button } from '@components';

import { cn } from '@lib/utils';

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
