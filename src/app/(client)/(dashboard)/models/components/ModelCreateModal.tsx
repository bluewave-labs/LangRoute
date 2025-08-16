'use client';

import { FormEvent, useMemo } from 'react';

import {
	Button,
	DialogClose,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Label,
	MultipleSelector,
	Option,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@shadcn-ui';

import { SUPPORTED_MODELS, SUPPORTED_MODEL_IDS, type SupportedModelId } from '@/lib/config/chat';

export default function ModelCreateModal() {
	// Get all available model options for frontend use
	const modelOptions = useMemo((): Option[] => {
		return SUPPORTED_MODEL_IDS.map((modelId: SupportedModelId) => {
			const model = SUPPORTED_MODELS[modelId];
			return {
				label: `${model.label} (${model.provider})`,
				value: model.id,
				description: model.description,
			};
		});
	}, []);

	// Get unique providers
	const providers = useMemo(() => {
		const providerSet = new Set(Object.values(SUPPORTED_MODELS).map((model) => model.provider));
		return Array.from(providerSet).sort();
	}, []);

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
								<SelectGroup>
									{providers.map((provider) => (
										<SelectItem
											key={provider}
											value={provider}
										>
											{provider.charAt(0).toUpperCase() + provider.slice(1)}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					{/* Model */}
					<Label>Model</Label>
					<div>
						<MultipleSelector
							defaultOptions={modelOptions}
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
