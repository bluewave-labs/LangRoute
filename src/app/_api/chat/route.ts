import { withApiKey } from '@lib/middleware/apiKey';

const chatHandler = async (request: Request) => {
	const method = request.method;
	return new Response(JSON.stringify({ message: `${method} chat endpoint` }), {
		headers: { 'Content-Type': 'application/json' },
	});
};

export const GET = withApiKey(chatHandler);
export const POST = withApiKey(chatHandler);
export const PUT = withApiKey(chatHandler);
export const DELETE = withApiKey(chatHandler);
export const PATCH = withApiKey(chatHandler);
