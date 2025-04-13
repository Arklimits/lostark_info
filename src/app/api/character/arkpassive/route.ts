import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const characterId = searchParams.get('characterId');

  if (!characterId) {
    return NextResponse.json({ error: 'characterId is required' }, { status: 400 });
  }

  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM character_arkpassives WHERE character_id = ?',
    [characterId]
  );

  return NextResponse.json(rows);
}
