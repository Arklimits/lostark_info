import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const engravingNames = searchParams.get('names')?.split(',') || [];

    if (engravingNames.length === 0) {
      return NextResponse.json({ error: '각인 없음' }, { status: 400 });
    }

    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT name, image_url FROM engravings WHERE name IN (?)',
      [engravingNames]
    );

    return NextResponse.json({
      name: rows.map(row => row.name),
      image: rows.map(row => row.image_url),
    });
  } catch (err: unknown) {
    let message = '알 수 없는 에러';

    if (err instanceof Error) {
      message = err.message;
    }

    return NextResponse.json({ error: 'DB 에러', detail: message }, { status: 500 });
  }
}
