import { TableBody, TableCell, TableRow } from '@shadcn-ui';

import { Button, EmptyState } from '@components';

// Example of what table action buttons would look like when there's data
// This demonstrates the Phase 2 mapping: ghost variant, icon size, proper colors and aria-labels
const ExampleKeyRow = ({ keyName }: { keyName: string }) => (
	<TableRow>
		<TableCell className='pl-5 font-medium'>{keyName}</TableCell>
		<TableCell className='font-mono text-sm'>sk-proj-...abc123</TableCell>
		<TableCell className='text-muted-foreground'>john.doe@company.com</TableCell>
		<TableCell className='text-muted-foreground'>2024-01-15 14:30</TableCell>
		<TableCell className='pr-5 text-right'>
			<div className='flex items-center justify-end gap-1'>
				<Button
					variant='ghost'
					size='icon'
					aria-label={`Copy ${keyName}`}
					iconOnly
				>
					<svg
						width='16'
						height='16'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
					>
						<rect
							width='14'
							height='14'
							x='8'
							y='8'
							rx='2'
							ry='2'
						/>
						<path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' />
					</svg>
				</Button>
				<Button
					variant='destructive'
					size='icon'
					aria-label={`Revoke ${keyName}`}
					iconOnly
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

export default function KeysTableBody() {
	// TODO: Replace with actual data fetching logic
	// For now, showing empty state as the current behavior
	const hasKeys = true;

	if (!hasKeys) {
		return (
			<TableBody>
				<TableRow>
					<TableCell colSpan={5}>
						<EmptyState message="You haven't created a key yet. Click on 'Create key' to create your virtual key you can share with your team." />
					</TableCell>
				</TableRow>
			</TableBody>
		);
	}

	// Example of table with action buttons (Phase 2 implementation)
	return (
		<TableBody>
			<ExampleKeyRow keyName='Production API Key' />
			<ExampleKeyRow keyName='Development Key' />
		</TableBody>
	);
}
