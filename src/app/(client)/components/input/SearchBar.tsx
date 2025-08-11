import { HTMLAttributes } from 'react';

import { Input } from '@components';

import { cn } from '@lib/utils';

import { SearchIcon } from '../../../../../public/assets/icons';

interface SearchBarProps extends HTMLAttributes<HTMLDivElement> {
	className?: string;
}

export default function SearchBar({ className, ...props }: SearchBarProps) {
	return (
		<div
			className={cn('relative w-80', className)}
			{...props}
		>
			<SearchIcon className='absolute top-0 bottom-0 left-3 my-auto' />
			<Input
				type='text'
				placeholder='Search'
				className='pr-4 pl-12'
			/>
		</div>
	);
}
