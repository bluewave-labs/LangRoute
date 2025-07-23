export class UnauthorizedError extends Error {
	public readonly status = 401;

	constructor(message = 'Unauthorized') {
		super(message);
		this.name = 'UnauthorizedError';
	}
}

export class BadRequestError extends Error {
	public readonly status = 400;

	constructor(message = 'Bad Request') {
		super(message);
		this.name = 'BadRequestError';
	}
}
