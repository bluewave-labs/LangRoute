import { PrismaAdapter } from '@auth/prisma-adapter';
import { Role, User } from '@prisma/client';
import argon2 from 'argon2';
import NextAuth, { type NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// import GitHubProvider from 'next-auth/providers/github';

import prisma from '@/lib/db/prisma';
import { LoginSchema } from '@/lib/validation/authSchemas';

const {
	AUTH_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	// GITHUB_CLIENT_ID,
	// GITHUB_CLIENT_SECRET,
} = process.env;

if (!AUTH_SECRET) {
	throw new Error('Missing AUTH_SECRET environment variable');
}

const providers: NextAuthConfig['providers'] = [];

// ---- Credentials (e-mail + password) ----
providers.push(
	CredentialsProvider({
		name: 'Credentials',
		credentials: {
			email: { label: 'Email', type: 'email' },
			password: { label: 'Password', type: 'password' },
		},
		async authorize(credentials) {
			/* Zod validation */
			const result = LoginSchema.safeParse(credentials);
			if (!result.success) {
				throw new Error('Invalid credentials format');
			}

			/* DB lookup */
			const { email, password } = result.data;
			const user: User | null = await prisma.user.findUnique({
				where: { email },
			});

			if (!user || !user.hashedPassword) {
				throw new Error('Invalid credentials');
			}

			const valid = await argon2.verify(user.hashedPassword, password);
			if (!valid) throw new Error('Invalid credentials');

			return user;
		},
	}),
);

// ---- Google OAuth ----
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
	providers.push(
		GoogleProvider({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true,
			profile(profile) {
				return {
					id: profile.sub ?? profile.id,
					email: profile.email,
					name: profile.name,
					avatarUrl: profile.picture,
					emailVerified: null,
					role: Role.USER,
				};
			},
		}),
	);
}

/* ── GitHub (template) ─────────────────────────────────
// const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
// if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET) {
//   providers.push(
//     GitHubProvider({
//       clientId: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_CLIENT_SECRET,
//       allowDangerousEmailAccountLinking: true,
//       profile(profile) {
//         return {
//           id: profile.id.toString(),
//           email: profile.email,
//           name: profile.name || profile.login,
//           avatarUrl: profile.avatar_url,
//           emailVerified: null,
//           role: Role.USER,
//         };
//       },
//     }),
//   );
// }
-------------------------------------------------------- */

const config: NextAuthConfig = {
	basePath: '/api/auth', // keeps your folder at the top of the tree
	secret: AUTH_SECRET,
	adapter: PrismaAdapter(prisma),
	providers,

	session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },

	pages: { signIn: '/login' },

	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = (user.role ?? Role.USER) as Role;
				token.avatarUrl = (user as User).avatarUrl ?? null;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.role = token.role as Role;
				session.user.avatarUrl = token.avatarUrl as string | null;
			}
			return session;
		},
	},
};

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth(config);
