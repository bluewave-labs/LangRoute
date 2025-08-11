import { NextResponse } from 'next/server';

import { Role } from '@prisma/client';

import { requireRole } from '@services';

/**
 * Segment-level middleware for admin-only API routes.
 * Used via re-export in each admin folder.
 */
export async function middleware() {
	try {
		await requireRole([Role.ADMIN]);
		return NextResponse.next();
	} catch {
		return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
	}
}
