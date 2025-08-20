import { PageHeader } from '@components';

import DashboardContent from './components/DashboardContent';

export default function DashboardPage() {
	return (
		<>
			<PageHeader>Dashboard</PageHeader>
			<div className='px-6 py-10 sm:px-20'>
				<DashboardContent />
			</div>
		</>
	);
}
export const metadata = {
	title: 'Dashboard',
	description: 'Your dashboard overview',
};
