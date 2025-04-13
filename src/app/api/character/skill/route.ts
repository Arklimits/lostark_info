import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const characterId = searchParams.get('characterId');

  if (!characterId) {
    return NextResponse.json({ error: 'characterId is required' }, { status: 400 });
  }

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM character_skills WHERE character_id = ?',
      [characterId]
    );

    const skills = rows.map(row => ({
      Name: row.name,
      Icon: row.icon,
      Level: row.level,
      Tripods: row.tripod1_name
        ? [
            {
              Name: row.tripod1_name,
              Icon: row.tripod1_icon,
              Tier: row.tripod1_tier,
              IsTierMax: Boolean(row.tripod1_is_tier_max),
            },
            {
              Name: row.tripod2_name,
              Icon: row.tripod2_icon,
              Tier: row.tripod2_tier,
              IsTierMax: Boolean(row.tripod2_is_tier_max),
            },
            {
              Name: row.tripod3_name,
              Icon: row.tripod3_icon,
              Tier: row.tripod3_tier,
              IsTierMax: Boolean(row.tripod3_is_tier_max),
            },
          ]
        : null,
      Rune: row.rune_name
        ? {
            Name: row.rune_name,
            Icon: row.rune_icon,
            Grade: row.rune_grade,
          }
        : null,
    }));

    return NextResponse.json({ data: skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}
