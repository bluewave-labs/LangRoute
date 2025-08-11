import { TableHead, TableHeader, TableRow } from '@components';

export default function ModelsTableHeader() {
	return (
		<TableHeader>
			<TableRow>
				<TableHead className='w-[40%] pl-5'>PROVIDER/MODEL</TableHead>
				<TableHead className='w-[20%] text-center'>PROMPT COST</TableHead>
				<TableHead className='w-[20%] text-center'>OUTPUT</TableHead>
				<TableHead className='w-[20%] pr-5 text-right'>CONTEXT WINDOW</TableHead>
			</TableRow>
		</TableHeader>
	);
}
