import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { extractCoolTimeFromTooltip } from '@/services/skills/extractUtils';

export async function POST(req: NextRequest) {
  const { skills, className } = await req.json();

  if (!Array.isArray(skills)) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const names = skills.map((s: any) => s.Name);
  const [constants] = await db.query<RowDataPacket[]>(
    `SELECT name, icon, coefficient, constant, cooltime, casttime FROM skills WHERE name IN (${names.map(() => '?').join(',')})`,
    names
  );

  const missingSkills = skills.filter(skill => !constants.some(c => c.name === skill.Name));

  if (missingSkills.length > 0) {
    const values = missingSkills.map(skill => [
      skill.Name,
      skill.Icon,
      1, // coefficient
      1, // constant
      extractCoolTimeFromTooltip(skill.Tooltip), // cooltime
      0, // casttime]
      className,
    ]);

    await db.query(
      `INSERT INTO skills (name, icon, coefficient, constant, cooltime, casttime, class) VALUES ?`,
      [values]
    );
  }

  const [updatedConstants] = await db.query<RowDataPacket[]>(
    `SELECT name, icon, coefficient, constant, cooltime, casttime FROM skills WHERE name IN (${names.map(() => '?').join(',')})`,
    names
  );

  const enriched = skills.map(skill => {
    const constant = updatedConstants.find(c => c.name === skill.Name);

    return {
      ...skill,
      ...constant,
    };
  });

  return NextResponse.json(enriched);
}
