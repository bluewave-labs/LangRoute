'use client';

import { FormEvent } from 'react';

import {
	Button,
	DialogClose,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Label,
	MultipleSelector,
	Select,
	SelectContent,
	SelectGroup,
	SelectTrigger,
	SelectValue,
} from '@components';
import { Option } from '@components';

export default function ModelCreateModal() {
	// TODO: Define actual model options here or fetch them dynamically in the future
	const OPTIONS: Option[] = [
		// { label: 'gpt-4.5-preview', value: 'gpt-4.5-preview' }
	];

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>Add new provider/model</DialogTitle>
			</DialogHeader>

			<form onSubmit={handleSubmit}>
				<div className='mt-5 mb-10 grid grid-cols-[6rem_1fr] gap-y-5'>
					{/* Provider */}
					<Label>Provider</Label>
					<div>
						<Select>
							<SelectTrigger className='w-full'>
								<SelectValue placeholder='Select a provider' />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>{/* <SelectItem value=''></SelectItem> */}</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					{/* Model */}
					<Label>Model</Label>
					<div>
						<MultipleSelector
							defaultOptions={OPTIONS}
							placeholder='Select models you like...'
							emptyIndicator={
								<p className='text-md text-center leading-6 text-gray-600 dark:text-gray-400'>
									no results found.
								</p>
							}
						/>
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant='outline'>Cancel</Button>
					</DialogClose>
					<Button type='submit'>Add model</Button>
				</DialogFooter>
			</form>
		</>
	);
}
