import { HTMLAttributes } from 'react';

import { SearchIcon } from '@icons';
import { Input } from '@shadcn-ui';

import { cn } from '@lib/utils';

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
