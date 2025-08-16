import { TableHead, TableHeader, TableRow } from '@shadcn-ui';

export default function KeysTableHeader() {
	return (
		<TableHeader>
			<TableRow>
				<TableHead className='w-[20%] pl-5'>NAME OF THE KEY</TableHead>
				<TableHead className='w-[40%]'>KEY</TableHead>
				<TableHead className='w-[20%]'>CREATED BY</TableHead>
				<TableHead className='w-[15%]'>CREATED TIME</TableHead>
				<TableHead className='w-[5%] pr-5 text-right'>ACTION</TableHead>
			</TableRow>
		</TableHeader>
	);
}
