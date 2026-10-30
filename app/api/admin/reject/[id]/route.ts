import { NextRequest, NextResponse } from 'next/server';
import { UsersRepository } from '@/src/db/repositories/users.repository';

const isAdmin = (req: NextRequest): boolean => !!req.headers.get('x-admin-id');

export async function POST(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const reason = body.reason ?? 'Documentação pendente';

  const user = await UsersRepository.rejectUser(id, reason);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({ status: 'rejected', user });
}
