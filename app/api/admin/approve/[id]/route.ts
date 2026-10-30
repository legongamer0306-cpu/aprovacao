import { NextRequest, NextResponse } from 'next/server';
import { UsersRepository } from '@/src/db/repositories/users.repository';
import { sendApprovalEmail } from '@/lib/services/email';
import { sendApprovalSMS } from '@/lib/services/sms';

// Simple auth – in production replace with proper auth middleware.
const isAdmin = (req: NextRequest): boolean => {
  const adminId = req.headers.get('x-admin-id');
  return !!adminId;
};

export async function POST(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const approvedBy = req.headers.get('x-admin-id') ?? 'unknown';
  const user = await UsersRepository.approveUser(id, approvedBy);

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Trigger notifications
  if (user.email) await sendApprovalEmail(user.email, user.name ?? '', approvedBy);
  if (user.phone) await sendApprovalSMS(user.phone, user.name ?? '', approvedBy);

  return NextResponse.json({ status: 'approved', user });
}
