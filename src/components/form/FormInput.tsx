import { ChangeEvent, FocusEvent } from 'react';

import { Input, Label } from '@/components';
import { cn } from '@/lib/utils';

interface FromInputProps {
	label?: string;
	type?: string;
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
	name,
	value,
	onChange,
	onBlur,
	placeHolder,
	className,
	...props
}: FromInputProps) {
	return (
		<div className='flex flex-col gap-2'>
			{label && <Label>{label}</Label>}
			<Input
				{...props}
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
