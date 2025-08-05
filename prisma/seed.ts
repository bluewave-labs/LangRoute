/**
 * Creates / upserts an initial ADMIN user.
 * - `ADMIN_PASSWORD` env var (optional) overrides the random password.
 *
 * Run with:  `npm run db:seed`
 */
// import { PrismaClient, Role } from '@prisma/client';
// import argon2 from 'argon2';
// import { randomBytes } from 'crypto';

// const prisma = new PrismaClient();

// async function main() {
// 	const email = 'admin@langroute.local';
// 	const rawPassword = process.env.ADMIN_PASSWORD ?? randomBytes(16).toString('base64url');

// 	const hashed = await argon2.hash(rawPassword);

// 	await prisma.user.upsert({
// 		where: { email },
// 		update: {},
// 		create: {
// 			email,
// 			name: 'LangRoute Admin',
// 			role: Role.ADMIN,
// 			hashedPassword: hashed,
// 			emailVerified: new Date(),
// 		},
// 	});

// 	// stdout so deploy logs show the credentials exactly once
// 	console.log('\n🌱  Admin user seeded:');
// 	console.log(`   email:    ${email}`);
// 	console.log(`   password: ${rawPassword}\n`);
// }

// main()
// 	.catch((e) => {
// 		console.error(e);
// 		process.exit(1);
// 	})
// 	.finally(() => prisma.$disconnect());
