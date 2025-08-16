import { Table } from '@shadcn-ui';

import KeysTableBody from './KeysTableBody';
import KeysTableHeader from './KeysTableHeader';

export default function KeysTable() {
	return (
		<Table>
			<KeysTableHeader />
			<KeysTableBody />
		</Table>
	);
}
