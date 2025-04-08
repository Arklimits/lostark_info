import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('characterId');

    if (!id) {
      return NextResponse.json({ error: 'name 파라미터가 필요합니다.' }, { status: 400 });
    }

    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM character_gems WHERE character_id = ?',
      [id]
    );
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching gems:', error);
    return NextResponse.json({ error: 'Gems fetching failed' }, { status: 500 });
  }
}
