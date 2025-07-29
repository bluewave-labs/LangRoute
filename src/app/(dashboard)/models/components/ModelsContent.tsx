import { Button, Dialog, SearchBar } from '@/components';
import { DialogContent, DialogTrigger } from '@/components/ui/dialog';

import ModelCreateModal from './ModelCreateModal';
import ModelsTable from './ModelsTable';

export default function ModelsContent() {
	return (
		<Dialog>
			<div className='mb-5 flex justify-between'>
				<SearchBar />

				<DialogTrigger asChild>
					<Button>Add new provider/model</Button>
				</DialogTrigger>
			</div>
			<div className='rounded-md border'>
				<ModelsTable />
			</div>

			<DialogContent>
				<ModelCreateModal />
			</DialogContent>
		</Dialog>
	);
}
