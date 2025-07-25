import { ChangeEvent, FocusEvent } from 'react';

import { Input, Label } from '@/components';
import { cn } from '@/lib/utils';

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

	return (
		<div className='flex flex-col gap-2'>
			{label && <Label htmlFor={inputId}>{label}</Label>}
			<Input
				{...props}
				id={inputId}
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				placeholder={placeHolder}
				className={cn(className)}
			/>
		</div>
	);
}
