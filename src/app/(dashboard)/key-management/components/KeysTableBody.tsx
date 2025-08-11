import { EmptyState } from '@/components';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';

export default function KeysTableBody() {
	return (
		<TableBody>
			<TableRow>
				<TableCell colSpan={5}>
					<EmptyState
						message='You haven’t created a key yet. Click on “Create key” to create your virtual key you can
					share with your team.'
					/>
				</TableCell>
			</TableRow>
		</TableBody>
	);
}
