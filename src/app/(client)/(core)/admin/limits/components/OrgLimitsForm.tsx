'use client';

import { useState } from 'react';

import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Input,
	Label,
	Separator,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/shadcn-ui';

export type OrgLimitsFormProps = {
	initialValues?: {
		monthlyBudget?: string;
		alertThresholds?: string;
		rps?: number;
		burst?: number;
	};
};

export function OrgLimitsForm({ initialValues }: OrgLimitsFormProps) {
	const [formData, setFormData] = useState({
		monthlyBudget: initialValues?.monthlyBudget || '',
		alertThresholds: initialValues?.alertThresholds || '',
		rps: initialValues?.rps || 100,
		burst: initialValues?.burst || 200,
	});

	const [isSaving, setIsSaving] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);
	const [isDirty, setIsDirty] = useState(false);

	const handleInputChange = (field: keyof typeof formData, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setSaveSuccess(false);
		setIsDirty(true);
	};

	// Validation logic
	const validateBudget = (budget: string): string | null => {
		if (!budget.trim()) return null; // Empty is allowed (no cap)
		const cleaned = budget.replace(/[$,\s]/g, '');
		const num = parseFloat(cleaned);
		if (isNaN(num) || num < 0) return 'Budget must be a positive number or empty for no limit';
		return null;
	};

	const validateThresholds = (thresholds: string): string | null => {
		if (!thresholds.trim()) return null; // Empty is allowed
		const values = thresholds
			.split(',')
			.map((v) => v.trim())
			.filter(Boolean);
		for (const val of values) {
			const num = parseFloat(val);
			if (isNaN(num) || num < 1 || num > 100) {
				return 'Each threshold must be between 1 and 100';
			}
		}
		return null;
	};

	const validateRps = (rps: number): string | null => {
		if (!Number.isInteger(rps) || rps < 1) return 'RPS must be an integer ≥ 1';
		return null;
	};

	const validateBurst = (burst: number): string | null => {
		if (!Number.isInteger(burst) || burst < 1) return 'Burst must be an integer ≥ 1';
		return null;
	};

	const budgetError = validateBudget(formData.monthlyBudget);
	const thresholdsError = validateThresholds(formData.alertThresholds);
	const rpsError = validateRps(formData.rps);
	const burstError = validateBurst(formData.burst);

	const hasErrors = !!(budgetError || thresholdsError || rpsError || burstError);
	const canSave = isDirty && !hasErrors;

	const handleSave = async () => {
		if (!canSave) return;

		setIsSaving(true);
		// Simulate save operation (no backend)
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsSaving(false);
		setSaveSuccess(true);
		setIsDirty(false);
		setTimeout(() => setSaveSuccess(false), 3000);
	};

	return (
		<TooltipProvider>
			<Card>
				<CardHeader>
					<CardTitle>Organization Limits</CardTitle>
				</CardHeader>
				<CardContent className='space-y-6'>
					<div className='space-y-6'>
						<div className='space-y-2'>
							<div className='flex items-center gap-2'>
								<Label htmlFor='monthlyBudget'>Monthly Budget</Label>
								<Tooltip>
									<TooltipTrigger asChild>
										<span className='text-muted-foreground cursor-help text-sm'>ⓘ</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>Maximum spending limit per calendar month</p>
									</TooltipContent>
								</Tooltip>
							</div>
							<div className='relative'>
								<span className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform'>
									$
								</span>
								<Input
									id='monthlyBudget'
									value={formData.monthlyBudget}
									onChange={(e) => handleInputChange('monthlyBudget', e.target.value)}
									placeholder='5,000'
									className={`pl-8 ${budgetError ? 'border-red-500' : ''}`}
									aria-describedby={
										budgetError ? 'monthlyBudget-help monthlyBudget-error' : 'monthlyBudget-help'
									}
									aria-invalid={!!budgetError}
								/>
							</div>
							<p
								id='monthlyBudget-help'
								className='text-muted-foreground text-xs'
							>
								Used for remaining budget and alert thresholds.
							</p>
							{budgetError && (
								<p
									id='monthlyBudget-error'
									className='text-xs text-red-600'
								>
									{budgetError}
								</p>
							)}
						</div>

						<div className='space-y-2'>
							<div className='flex items-center gap-2'>
								<Label htmlFor='alertThresholds'>Alert Thresholds</Label>
								<Tooltip>
									<TooltipTrigger asChild>
										<span className='text-muted-foreground cursor-help text-sm'>ⓘ</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>Comma-separated percentages for budget alerts</p>
									</TooltipContent>
								</Tooltip>
							</div>
							<Input
								id='alertThresholds'
								value={formData.alertThresholds}
								onChange={(e) => handleInputChange('alertThresholds', e.target.value)}
								placeholder='50,80,95'
								className={thresholdsError ? 'border-red-500' : ''}
								aria-describedby={
									thresholdsError
										? 'alertThresholds-help alertThresholds-error'
										: 'alertThresholds-help'
								}
								aria-invalid={!!thresholdsError}
							/>
							<p
								id='alertThresholds-help'
								className='text-muted-foreground text-xs'
							>
								Comma-separated percentages, e.g. 50,80,95.
							</p>
							{thresholdsError && (
								<p
									id='alertThresholds-error'
									className='text-xs text-red-600'
								>
									{thresholdsError}
								</p>
							)}
						</div>
					</div>

					<Separator />

					<div className='space-y-6'>
						<h2 className='text-lg font-semibold'>Token Bucket Rate Limiting</h2>

						<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
							<div className='space-y-2'>
								<div className='flex items-center gap-2'>
									<Label htmlFor='rps'>Requests per Second</Label>
									<Tooltip>
										<TooltipTrigger asChild>
											<span className='text-muted-foreground cursor-help text-sm'>ⓘ</span>
										</TooltipTrigger>
										<TooltipContent>
											<p>Sustained rate limit for API requests</p>
										</TooltipContent>
									</Tooltip>
								</div>
								<Input
									id='rps'
									type='number'
									value={formData.rps}
									onChange={(e) => handleInputChange('rps', parseInt(e.target.value) || 0)}
									min='1'
									className={rpsError ? 'border-red-500' : ''}
									aria-describedby={rpsError ? 'rps-help rps-error' : 'rps-help'}
									aria-invalid={!!rpsError}
								/>
								<p
									id='rps-help'
									className='text-muted-foreground text-xs'
								>
									Maximum requests allowed per second
								</p>
								{rpsError && (
									<p
										id='rps-error'
										className='text-xs text-red-600'
									>
										{rpsError}
									</p>
								)}
							</div>

							<div className='space-y-2'>
								<div className='flex items-center gap-2'>
									<Label htmlFor='burst'>Burst Capacity</Label>
									<Tooltip>
										<TooltipTrigger asChild>
											<span className='text-muted-foreground cursor-help text-sm'>ⓘ</span>
										</TooltipTrigger>
										<TooltipContent>
											<p>Maximum burst requests allowed</p>
										</TooltipContent>
									</Tooltip>
								</div>
								<Input
									id='burst'
									type='number'
									value={formData.burst}
									onChange={(e) => handleInputChange('burst', parseInt(e.target.value) || 0)}
									min='1'
									className={burstError ? 'border-red-500' : ''}
									aria-describedby={burstError ? 'burst-help burst-error' : 'burst-help'}
									aria-invalid={!!burstError}
								/>
								<p
									id='burst-help'
									className='text-muted-foreground text-xs'
								>
									Maximum burst requests above the rate limit
								</p>
								{burstError && (
									<p
										id='burst-error'
										className='text-xs text-red-600'
									>
										{burstError}
									</p>
								)}
							</div>
						</div>
					</div>

					<div className='flex items-center gap-4'>
						<Button
							onClick={handleSave}
							disabled={isSaving || !canSave}
							className='w-auto'
						>
							{isSaving ? 'Saving...' : 'Save Changes'}
						</Button>
						{saveSuccess && (
							<div className='flex items-center gap-2 text-sm font-medium text-green-600'>
								<span>✓</span>
								<span>Settings saved successfully!</span>
							</div>
						)}
						{hasErrors && isDirty && (
							<p className='text-sm text-red-600'>Please fix validation errors before saving</p>
						)}
					</div>
				</CardContent>
			</Card>
		</TooltipProvider>
	);
}
