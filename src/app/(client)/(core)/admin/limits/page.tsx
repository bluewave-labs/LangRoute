import { BudgetSummaryCards } from './components/BudgetSummaryCards';
import { OrgLimitsForm } from './components/OrgLimitsForm';
import { AccessKeyLimitsTable } from './components/AccessKeyLimitsTable';
import { PageHeader } from '@/app/(client)/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn-ui';

export default function LimitsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Limits & Budgets"
        description="Manage organization-wide spending limits and per-key rate controls"
      />
      
      <BudgetSummaryCards
        currentSpend="$127.45"
        remainingBudget="$372.55"
        forecast="$89.23"
        activeLimits={12}
      />

      <Tabs defaultValue="organization" className="space-y-4">
        <TabsList>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="access-keys">Access Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="organization" className="space-y-4">
          <OrgLimitsForm />
        </TabsContent>
        
        <TabsContent value="access-keys" className="space-y-4">
          <AccessKeyLimitsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}