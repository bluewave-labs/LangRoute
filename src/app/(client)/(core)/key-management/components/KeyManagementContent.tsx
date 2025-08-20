import { Button, Sheet, SheetContent, SheetTrigger } from '@shadcn-ui';

import { SearchBar } from '@components';

import KeyCreateModal from './KeyCreateModal';
import KeysTable from './KeysTable';

export default function KeyManagementContent() {
	return (
		<Sheet>
			<div className='mb-5 flex justify-between'>
				<SearchBar />

				<SheetTrigger asChild>
					<Button>Create new virtual key</Button>
				</SheetTrigger>
			</div>
			<div className='rounded-md border'>
				<KeysTable />
			</div>

			<SheetContent>
				<KeyCreateModal />
			</SheetContent>
		</Sheet>
	);
}
