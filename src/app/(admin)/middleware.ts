import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';

import { requireRole } from '@/services';

export async function middleware() {
	try {
		await requireRole([Role.ADMIN]);
		return NextResponse.next();
	} catch {
		// Redirect UI visitors to a simple 403 page
		return NextResponse.redirect(new URL('/403', process.env.AUTH_URL!));
	}
}
