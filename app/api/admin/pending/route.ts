import { NextResponse } from 'next/server';
import { UsersRepository } from '@/../src/db/repositories/users.repository';

export async function GET() {
  const pending = await UsersRepository.listPendingApprovals();
  return NextResponse.json({ pending });
}
