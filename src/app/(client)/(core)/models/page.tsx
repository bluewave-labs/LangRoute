import { PageHeader } from '@components';

import ModelsContent from './components/ModelsContent';

export default function ModelsPage() {
	return (
		<>
			<PageHeader>Models</PageHeader>
			<div className='px-20 py-10'>
				<ModelsContent />
			</div>
		</>
	);
}
