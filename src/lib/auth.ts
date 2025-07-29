import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { Role, User } from '@prisma/client';
import argon2 from 'argon2';
import { type NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// import GitHubProvider from 'next-auth/providers/github';

import prisma from '@/lib/db/prisma';

const {
	NEXTAUTH_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	// GITHUB_CLIENT_ID,
	// GITHUB_CLIENT_SECRET,
} = process.env;

if (!NEXTAUTH_SECRET) {
	throw new Error('Missing NEXTAUTH_SECRET in environment');
}

const providers = [];

// ---- Credentials (e-mail + password) ----
providers.push(
	CredentialsProvider({
		name: 'Credentials',
		credentials: {
			email: { label: 'Email', type: 'email' },
			password: { label: 'Password', type: 'password' },
		},
		async authorize(credentials) {
			if (!credentials?.email || !credentials.password) {
				throw new Error('Email and password are required');
			}

			const user: User | null = await prisma.user.findUnique({
				where: { email: credentials.email },
			});

			if (!user || !user.hashedPassword) {
				throw new Error('Invalid credentials');
			}

			const valid = await argon2.verify(user.hashedPassword, credentials.password);
			if (!valid) throw new Error('Invalid credentials');

			return user; // PrismaAdapter serialises it
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
			/**
			 * Map Google's profile to our User model shape.
			 * `role` defaults to USER; PrismaAdapter fills other columns.
			 */
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

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	secret: NEXTAUTH_SECRET,
	providers,
	session: {
		strategy: 'database',
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	pages: {
		signIn: '/login',
	},
	callbacks: {
		async session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
				session.user.role = (user.role ?? Role.USER) as Role;
				session.user.avatarUrl = user.avatarUrl ?? null;
			}
			return session;
		},
	},
};

export function getServerAuthSession() {
	return getServerSession(authOptions);
}
