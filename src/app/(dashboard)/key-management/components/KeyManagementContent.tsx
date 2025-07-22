import { Button, SearchBar, Sheet } from '@/components';
import { SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
