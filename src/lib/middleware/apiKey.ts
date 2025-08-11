import prisma from '@/db/prisma';

import { BadRequestError, UnauthorizedError } from '@lib/errors';

export async function requireApiKey(request: Request): Promise<void> {
	const authHeader = request.headers.get('authorization');
	const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
	if (!token) {
		throw new UnauthorizedError();
	}

	const record = await prisma.apiKey.findUnique({ where: { key: token } });
	if (!record) {
		throw new UnauthorizedError();
	}
}

export function withApiKey(handler: (req: Request) => Promise<Response>) {
	return async (request: Request) => {
		try {
			await requireApiKey(request);
			return await handler(request);
		} catch (err) {
			if (err instanceof UnauthorizedError || err instanceof BadRequestError) {
				return new Response(JSON.stringify({ error: err.message }), {
					status: err.status,
					headers: { 'Content-Type': 'application/json' },
				});
			}
			throw err;
		}
	};
}
