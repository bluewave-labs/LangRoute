import { randomBytes } from 'crypto';

import prisma from '@/db/prisma';

import { BadRequestError, UnauthorizedError } from '@lib/errors';

const apiKeyHandler = async (request: Request) => {
	const method = request.method;

	switch (method) {
		case 'GET':
			return await handleGetApiKeys(request);
		case 'POST':
			return await handleCreateApiKey(request);
		case 'DELETE':
			return await handleDeleteApiKey(request);
		default:
			return new Response(JSON.stringify({ error: 'Method not allowed' }), {
				status: 405,
				headers: { 'Content-Type': 'application/json' },
			});
	}
};

async function handleGetApiKeys(request: Request) {
	const userId = await getUserIdFromApiKey(request);

	const apiKeys = await prisma.apiKey.findMany({
		where: { userId },
		select: { id: true, key: true, createdAt: true },
	});

	return new Response(JSON.stringify({ apiKeys }), {
		headers: { 'Content-Type': 'application/json' },
	});
}

async function handleCreateApiKey(request: Request) {
	const userId = await getUserIdFromApiKey(request);

	// Generate a random API key
	const key = generateApiKey();

	const apiKey = await prisma.apiKey.create({
		data: { key, userId },
		select: { id: true, key: true, createdAt: true },
	});

	return new Response(JSON.stringify({ apiKey }), {
		status: 201,
		headers: { 'Content-Type': 'application/json' },
	});
}

async function handleDeleteApiKey(request: Request) {
	const userId = await getUserIdFromApiKey(request);
	const url = new URL(request.url);
	const apiKeyId = url.searchParams.get('id');

	if (!apiKeyId) {
		throw new BadRequestError('API key ID required');
	}

	// Verify the API key belongs to the user
	const apiKey = await prisma.apiKey.findFirst({
		where: { id: apiKeyId, userId },
	});

	if (!apiKey) {
		throw new BadRequestError('API key not found');
	}

	await prisma.apiKey.delete({ where: { id: apiKeyId } });

	return new Response(JSON.stringify({ message: 'API key deleted' }), {
		headers: { 'Content-Type': 'application/json' },
	});
}

async function getUserIdFromApiKey(request: Request): Promise<string> {
	const token = request.headers.get('authorization')?.replace('Bearer ', '');
	if (!token) throw new UnauthorizedError();

	const apiKey = await prisma.apiKey.findUnique({
		where: { key: token },
		include: { user: true },
	});

	if (!apiKey) throw new UnauthorizedError();
	return apiKey.userId;
}

function generateApiKey(): string {
	return 'lr_' + randomBytes(16).toString('hex');
}

export const GET = apiKeyHandler;
export const POST = apiKeyHandler;
export const DELETE = apiKeyHandler;
