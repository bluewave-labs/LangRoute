import { HTMLAttributes } from 'react';

import { SearchIcon } from '@icons';

import { Input } from '@shadcn-ui';

import { Button } from '@components';

import { cn } from '@lib/utils';

interface SearchBarProps extends HTMLAttributes<HTMLDivElement> {
	className?: string;
	onSearch?: () => void;
}

export default function SearchBar({ className, onSearch, ...props }: SearchBarProps) {
	return (
		<div
			className={cn('relative w-80', className)}
			{...props}
		>
			<SearchIcon className='pointer-events-none absolute top-0 bottom-0 left-3 my-auto' />
			<Input
				type='text'
				placeholder='Search'
				className='pr-12 pl-12'
			/>
			<Button
				variant='ghost'
				size='icon'
				onClick={onSearch}
				aria-label='Search'
				className='absolute top-1/2 right-2 h-7 w-7 -translate-y-1/2'
				iconOnly
			>
				<SearchIcon />
			</Button>
		</div>
	);
}
