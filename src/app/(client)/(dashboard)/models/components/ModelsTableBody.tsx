import { EmptyState, TableBody, TableCell, TableRow } from '@components';

export default function ModelsTableBody() {
	return (
		<TableBody>
			<TableRow>
				<TableCell colSpan={4}>
					<EmptyState message='You haven’t added a provider or model yet. Click on “Add provider/model” to add it.' />
				</TableCell>
			</TableRow>
		</TableBody>
	);
}
