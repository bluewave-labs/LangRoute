'use client';

import { useState } from 'react';

import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shadcn-ui';

import { AccessKeyLimitDialog, type AccessKeyRow } from './AccessKeyLimitDialog';

export type AccessKeyLimitsTableProps = {
	rows?: AccessKeyRow[];
};

// Mock data for Access Keys
const defaultRows: AccessKeyRow[] = [
	{
		id: '1',
		label: 'Production Access Key',
		owner: 'john.doe@company.com',
		budget: '$500',
		rate: 50,
		burst: 100,
		status: 'active',
	},
	{
		id: '2',
		label: 'Development Access Key',
		owner: 'jane.smith@company.com',
		budget: '$100',
		rate: 10,
		burst: 20,
		status: 'active',
	},
	{
		id: '3',
		label: 'Testing Access Key',
		owner: 'test.user@company.com',
		rate: 5,
		burst: 10,
		status: 'disabled',
	},
	{
		id: '4',
		label: 'Staging Access Key',
		owner: 'staging@company.com',
		budget: '$250',
		rate: 25,
		burst: 50,
		status: 'active',
	},
];

export function AccessKeyLimitsTable({ rows = defaultRows }: AccessKeyLimitsTableProps) {
	const [tableData, setTableData] = useState<AccessKeyRow[]>(rows);
	const [editingKey, setEditingKey] = useState<AccessKeyRow | null>(null);

	const handleEdit = (row: AccessKeyRow) => {
		setEditingKey(row);
	};

	const handleSave = (updatedRow: AccessKeyRow) => {
		setTableData((prev) => prev.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
		setEditingKey(null);
	};

	const handleCloseDialog = () => {
		setEditingKey(null);
	};

	const handleCreateAccessKey = () => {
		// No-op for now (no backend)
		console.log('Create Access Key clicked');
	};

	if (tableData.length === 0) {
		return (
			<Card>
				<CardContent className='py-12'>
					<div className='space-y-4 text-center'>
						<div className='bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full'>
							<span className='text-muted-foreground text-2xl'>🔑</span>
						</div>
						<div className='space-y-2'>
							<h3 className='text-lg font-medium'>No Access Keys found</h3>
							<p className='text-muted-foreground'>
								Create an Access Key to start configuring limits and budgets.
							</p>
						</div>
						<Button
							variant='outline'
							onClick={handleCreateAccessKey}
							className='mt-4'
						>
							Create Access Key
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Access Key Limits</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='rounded-md border'>
						<Table aria-label='Access Keys limits table'>
							<TableHeader>
								<TableRow>
									<TableHead scope='col'>Label</TableHead>
									<TableHead scope='col'>Owner</TableHead>
									<TableHead scope='col'>Monthly Budget</TableHead>
									<TableHead scope='col'>Rate (req/s)</TableHead>
									<TableHead scope='col'>Burst</TableHead>
									<TableHead scope='col'>Status</TableHead>
									<TableHead
										scope='col'
										className='w-[100px]'
									>
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{tableData.map((row) => (
									<TableRow key={row.id}>
										<TableCell className='font-medium'>{row.label}</TableCell>
										<TableCell className='text-muted-foreground'>{row.owner}</TableCell>
										<TableCell>
											{row.budget || <span className='text-muted-foreground'>No limit</span>}
										</TableCell>
										<TableCell>
											{row.rate || <span className='text-muted-foreground'>No limit</span>}
										</TableCell>
										<TableCell>
											{row.burst || <span className='text-muted-foreground'>No limit</span>}
										</TableCell>
										<TableCell>
											<Badge variant={row.status === 'active' ? 'default' : 'secondary'}>
												{row.status}
											</Badge>
										</TableCell>
										<TableCell>
											<Button
												variant='outline'
												size='sm'
												onClick={() => handleEdit(row)}
												aria-label={`Edit Access Key limits for ${row.label}`}
											>
												Edit
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			<AccessKeyLimitDialog
				keyRow={editingKey}
				onClose={handleCloseDialog}
				onSave={handleSave}
			/>
		</>
	);
}
