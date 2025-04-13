import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const [posts] = await db.query('SELECT * FROM notice_board');

  return NextResponse.json({ posts });
}
