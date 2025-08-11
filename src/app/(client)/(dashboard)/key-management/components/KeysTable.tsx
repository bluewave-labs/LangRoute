import { Table } from '@components';

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
