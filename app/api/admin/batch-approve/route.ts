import { NextRequest, NextResponse } from 'next/server';
import { UsersRepository } from '@/src/db/repositories/users.repository';
import { sendApprovalEmail } from '@/lib/services/email';
import { sendApprovalSMS } from '@/lib/services/sms';

const isAdmin = (req: NextRequest): boolean => {
  return !!req.headers.get('x-admin-id');
};

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const approvedBy = req.headers.get('x-admin-id') ?? 'unknown';
  const pending = await UsersRepository.listPendingApprovals();

  const results = [];
  for (const user of pending) {
    const approved = await UsersRepository.approveUser(user.id, approvedBy);
    if (approved) {
      if (approved.email) await sendApprovalEmail(approved.email, approved.name ?? '', approvedBy);
      if (approved.phone) await sendApprovalSMS(approved.phone, approved.name ?? '', approvedBy);
      results.push(approved);
    }
  }

  return NextResponse.json({ status: 'batch approved', count: results.length, users: results });
}
