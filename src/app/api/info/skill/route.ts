import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function POST(req: NextRequest) {
  const { skills } = await req.json();

  if (!Array.isArray(skills)) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const names = skills.map((s: any) => s.Name);
  const [constants] = await db.query<RowDataPacket[]>(
    `SELECT name, coefficient, constant, cooltime, casttime FROM skills WHERE name IN (${names.map(() => '?').join(',')})`,
    names
  );

  const enriched = skills.map(skill => {
    const constant = constants.find(c => c.name === skill.Name);

    return {
      ...skill,
      ...constant,
    };
  });

  return NextResponse.json(enriched);
}
