import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn-ui';

import { AccessKeyLimitsTable } from './components/AccessKeyLimitsTable';
import { BudgetSummaryCards } from './components/BudgetSummaryCards';
import { OrgLimitsForm } from './components/OrgLimitsForm';

export default function LimitsPage() {
	return (
		<div className='container mx-auto space-y-8 py-8'>
			<div className='space-y-2'>
				<h1 className='text-3xl font-bold tracking-tight'>Limits & Budgets</h1>
				<p className='text-muted-foreground'>
					Manage organization budgets, rate limits, and per-key restrictions
				</p>
			</div>

			<BudgetSummaryCards
				currentSpend='$245.32'
				remainingBudget='$754.68'
				forecast='$389.45'
				activeLimits={12}
			/>

			<Tabs
				defaultValue='organization'
				className='space-y-6'
			>
				<TabsList>
					<TabsTrigger value='organization'>Organization</TabsTrigger>
					<TabsTrigger value='access-keys'>Access Keys</TabsTrigger>
				</TabsList>

				<TabsContent
					value='organization'
					className='space-y-6'
				>
					<OrgLimitsForm />
				</TabsContent>

				<TabsContent
					value='access-keys'
					className='space-y-6'
				>
					<AccessKeyLimitsTable />
				</TabsContent>
			</Tabs>
		</div>
	);
}
