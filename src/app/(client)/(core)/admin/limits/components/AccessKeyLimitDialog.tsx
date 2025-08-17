'use client';

import { useEffect, useState } from 'react';

import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Input,
	Label,
	Separator,
	Switch,
} from '@/shadcn-ui';

export type AccessKeyRow = {
	id: string;
	label: string;
	owner: string;
	budget?: string;
	rate?: number;
	burst?: number;
	status: 'active' | 'disabled';
};

export type AccessKeyLimitDialogProps = {
	keyRow: AccessKeyRow | null;
	onClose: () => void;
	onSave: (updated: AccessKeyRow) => void;
};

export function AccessKeyLimitDialog({ keyRow, onClose, onSave }: AccessKeyLimitDialogProps) {
	const [formData, setFormData] = useState<AccessKeyRow>({
		id: '',
		label: '',
		owner: '',
		budget: '',
		rate: 0,
		burst: 0,
		status: 'active',
	});

	const [hasChanges, setHasChanges] = useState(false);

	useEffect(() => {
		if (keyRow) {
			setFormData(keyRow);
			setHasChanges(false);
		}
	}, [keyRow]);

	const handleInputChange = (
		field: keyof AccessKeyRow,
		value: string | number | 'active' | 'disabled',
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setHasChanges(true);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!hasChanges) return;
		onSave(formData);
		onClose();
	};

	// Check if current values are different from original
	const isDataChanged =
		keyRow &&
		(formData.budget !== keyRow.budget ||
			formData.rate !== keyRow.rate ||
			formData.burst !== keyRow.burst ||
			formData.status !== keyRow.status);

	if (!keyRow) return null;

	return (
		<Dialog
			open={!!keyRow}
			onOpenChange={(open) => !open && onClose()}
		>
			<DialogContent
				className='sm:max-w-md'
				aria-describedby='edit-key-description'
				onOpenAutoFocus={(e) => {
					// Focus the first input when dialog opens
					e.preventDefault();
					if (e.currentTarget instanceof HTMLElement) {
						const firstInput = e.currentTarget.querySelector('input');
						firstInput?.focus();
					}
				}}
			>
				<DialogHeader>
					<DialogTitle>Edit Access Key Limits</DialogTitle>
					<div
						id='edit-key-description'
						className='text-muted-foreground text-sm'
					>
						Configure budget and rate limits for &ldquo;{keyRow.label}&rdquo;
					</div>
				</DialogHeader>

				<form
					onSubmit={handleSubmit}
					className='space-y-6'
				>
					<div className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='edit-budget'>Monthly Budget</Label>
							<Input
								id='edit-budget'
								type='number'
								value={formData.budget?.replace('$', '') || ''}
								onChange={(e) =>
									handleInputChange('budget', e.target.value ? `$${e.target.value}` : '')
								}
								placeholder='Leave empty for no limit'
								min='0'
								aria-describedby='budget-help'
							/>
							<p
								id='budget-help'
								className='text-muted-foreground text-xs'
							>
								Leave empty for no limit.
							</p>
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='edit-rate'>Rate (req/s)</Label>
								<Input
									id='edit-rate'
									type='number'
									value={formData.rate || ''}
									onChange={(e) => handleInputChange('rate', parseInt(e.target.value) || 0)}
									placeholder='No limit'
									min='1'
									aria-describedby='rate-help'
								/>
								<p
									id='rate-help'
									className='text-muted-foreground text-xs'
								>
									Requests per second.
								</p>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='edit-burst'>Burst Capacity</Label>
								<Input
									id='edit-burst'
									type='number'
									value={formData.burst || ''}
									onChange={(e) => handleInputChange('burst', parseInt(e.target.value) || 0)}
									placeholder='No limit'
									min='1'
									aria-describedby='burst-help'
								/>
								<p
									id='burst-help'
									className='text-muted-foreground text-xs'
								>
									Max requests allowed in a short burst.
								</p>
							</div>
						</div>
					</div>

					<Separator />

					<div className='flex items-center justify-between'>
						<div className='space-y-1'>
							<Label htmlFor='edit-status'>Access Key Status</Label>
							<div className='text-muted-foreground text-sm'>
								Disabled Access Keys cannot make requests
							</div>
						</div>
						<Switch
							id='edit-status'
							checked={formData.status === 'active'}
							onCheckedChange={(checked) =>
								handleInputChange('status', checked ? 'active' : 'disabled')
							}
							aria-label={`Access Key is ${formData.status}`}
						/>
					</div>

					<div className='flex justify-end gap-3'>
						<Button
							type='button'
							variant='outline'
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							type='submit'
							disabled={!isDataChanged}
						>
							Save Changes
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
