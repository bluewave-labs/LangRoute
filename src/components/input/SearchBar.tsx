import { SearchIcon } from '@/assets/icons';
import { Input } from '@/components';
import { cn } from '@/lib/utils';

interface SearchBarProps {
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
