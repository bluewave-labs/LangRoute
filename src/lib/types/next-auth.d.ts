import type { Role } from '@prisma/client';
import 'next-auth';

declare module 'next-auth' {
	interface User {
		id: string;
		role: Role;
		email: string;
		avatarUrl: string | null;
		name: string | null;
		emailVerified: Date | null;
	}

	interface Session {
		user: User;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		role: Role;
		avatarUrl: string | null;
	}
}
