import { UsageService, authenticate, handleApiError } from '@services';

/**
 * Retrieves usage statistics for the authenticated user.
 *
 * @returns A JSON response containing usage statistics.
 * @throws ServiceError if the user is not authenticated or retrieval fails.
 */
export async function GET(): Promise<Response> {
	try {
		const userId = await authenticate();

		const usage = await UsageService.getUserUsage(userId);

		return Response.json(usage);
	} catch (error) {
		return handleApiError('usage-get', error);
	}
}
