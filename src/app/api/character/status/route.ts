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
    'SELECT class, crit, specialization, domination, swiftness, endurance, expertise, vitality, attack_point FROM characters WHERE id = ?',
    [characterId]
  );

  const result = {
    CharacterClassName: rows[0].class,
    Stats: [
      {
        Type: '치명',
        Value: rows[0].crit,
      },
      {
        Type: '특화',
        Value: rows[0].specialization,
      },
      {
        Type: '제압',
        Value: rows[0].domination,
      },
      {
        Type: '신속',
        Value: rows[0].swiftness,
      },
      {
        Type: '인내',
        Value: rows[0].endurance,
      },
      {
        Type: '숙련',
        Value: rows[0].expertise,
      },
      {
        Type: '공격력',
        Value: rows[0].attack_point,
      },
      {
        Type: '생명력',
        Value: rows[0].vitality,
      },
    ],
  };

  return NextResponse.json(result);
}
