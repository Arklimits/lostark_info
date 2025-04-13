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
    'SELECT * FROM character_engravings WHERE character_id = ?',
    [characterId]
  );

  const engravingData = rows.map(row => ({
    Name: row.name,
    Grade: row.grade,
    Level: row.level,
    AbilityStoneLevel: row.ability_stone_level,
    ImageUrl: row.image_url,
  }));

  return NextResponse.json(engravingData);
}
