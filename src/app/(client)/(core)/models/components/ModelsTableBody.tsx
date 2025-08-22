import { TableBody, TableCell, TableRow } from '@shadcn-ui';

import { Button, EmptyState } from '@components';

// Example of what table action buttons would look like when there's data
// This demonstrates the Phase 2 mapping: ghost variant, icon size, proper colors and aria-labels
const ExampleModelRow = ({ modelName, provider }: { modelName: string; provider: string }) => (
	<TableRow>
		<TableCell className='pl-5 font-medium'>
			<div>
				<div className='font-medium'>{provider}</div>
				<div className='text-muted-foreground text-sm'>{modelName}</div>
			</div>
		</TableCell>
		<TableCell className='text-center'>$0.0010</TableCell>
		<TableCell className='text-center'>$0.0020</TableCell>
		<TableCell className='pr-5 text-right'>
			<div className='flex items-center justify-end gap-1'>
				<Button
					variant='ghost'
					size='icon'
					color='neutral'
					aria-label={`Edit ${provider} ${modelName}`}
				>
					<svg
						width='16'
						height='16'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
					>
						<path d='M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5' />
						<path d='m9 15 2 2 4-4' />
					</svg>
				</Button>
				<Button
					variant='ghost'
					size='icon'
					color='destructive'
					aria-label={`Delete ${provider} ${modelName}`}
				>
					<svg
						width='16'
						height='16'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
					>
						<path d='M3 6h18' />
						<path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
						<path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
					</svg>
				</Button>
			</div>
		</TableCell>
	</TableRow>
);

export default function ModelsTableBody() {
	// TODO: Replace with actual data fetching logic
	// For now, showing empty state as the current behavior
	const hasModels = true;

	if (!hasModels) {
		return (
			<TableBody>
				<TableRow>
					<TableCell colSpan={4}>
						<EmptyState message="You haven't added a provider or model yet. Click on 'Add provider/model' to add it." />
					</TableCell>
				</TableRow>
			</TableBody>
		);
	}

	// Example of table with action buttons (Phase 2 implementation)
	return (
		<TableBody>
			<ExampleModelRow
				provider='OpenAI'
				modelName='gpt-4'
			/>
			<ExampleModelRow
				provider='Anthropic'
				modelName='claude-3-opus'
			/>
		</TableBody>
	);
}
