'use client';

import { Badge, Card, CardContent, CardHeader, CardTitle, Progress } from '@/shadcn-ui';

type BudgetSummaryCardsProps = {
	currentSpend: string;
	remainingBudget: string;
	forecast: string;
	activeLimits: number;
};

export function BudgetSummaryCards({
	currentSpend,
	remainingBudget,
	forecast,
	activeLimits,
}: BudgetSummaryCardsProps) {
	// Calculate progress percentage (mock calculation)
	const spentAmount = parseFloat(currentSpend.replace('$', '').replace(',', ''));
	const remainingAmount = parseFloat(remainingBudget.replace('$', '').replace(',', ''));
	const totalBudget = spentAmount + remainingAmount;
	const progressPercentage = Math.round((spentAmount / totalBudget) * 100);

	return (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-muted-foreground text-sm font-medium'>Current Spend</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{currentSpend}</div>
					<p className='text-muted-foreground mt-1 text-xs'>Updated daily</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-muted-foreground text-sm font-medium'>
						Remaining Budget
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{remainingBudget}</div>
					<Progress
						value={progressPercentage}
						className='mt-2'
						aria-valuenow={progressPercentage}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-label={`Budget usage: ${progressPercentage}% of total budget used`}
					/>
					<p className='text-muted-foreground mt-1 text-xs'>
						{progressPercentage}% used
						<span className='sr-only'>
							of total budget. {remainingBudget} remaining out of ${totalBudget.toLocaleString()}{' '}
							total.
						</span>
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-muted-foreground text-sm font-medium'>Forecast</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{forecast}</div>
					<p className='text-muted-foreground mt-1 text-xs'>Based on usage trends</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-muted-foreground text-sm font-medium'>Active Limits</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{activeLimits}</div>
					<Badge
						variant='secondary'
						className='mt-1'
					>
						Org + Access Keys
					</Badge>
				</CardContent>
			</Card>
		</div>
	);
}
