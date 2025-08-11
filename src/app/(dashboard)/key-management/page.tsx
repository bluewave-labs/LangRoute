import { PageHeader } from '@/components';

import KeyManagementContent from './components/KeyManagementContent';

export default function KeyManagementPage() {
	return (
		<>
			<PageHeader>Virtual key management</PageHeader>
			<div className='px-20 py-10'>
				<KeyManagementContent />
			</div>
		</>
	);
}
