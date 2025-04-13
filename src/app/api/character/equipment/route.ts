import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const characterId = searchParams.get('characterId');

  if (!characterId) {
    return NextResponse.json({ error: 'characterId 없음' }, { status: 400 });
  }

  const equipment = await db.query('SELECT * FROM character_equipments WHERE character_id = ?', [
    characterId,
  ]);

  return NextResponse.json(equipment);
}
