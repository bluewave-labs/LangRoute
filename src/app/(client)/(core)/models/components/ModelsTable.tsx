import { Table } from '@shadcn-ui';

import ModelsTableBody from './ModelsTableBody';
import ModelsTableHeader from './ModelsTableHeader';

export default function ModelsTable() {
	return (
		<Table>
			<ModelsTableHeader />
			<ModelsTableBody />
		</Table>
	);
}
