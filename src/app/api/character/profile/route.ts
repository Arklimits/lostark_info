import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { db } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: '이름 없음' }, { status: 400 });
  }

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT character_image AS CharacterImage, guild AS GuildName, server_name AS ServerName FROM characters WHERE name = ?',
      [name]
    );

    if (rows[0].CharacterImage !== null) {
      return NextResponse.json(rows[0]);
    }

    const encodedName = encodeURIComponent(name);

    const token = process.env.LOSTARK_API_TOKEN;

    if (!token) {
      return NextResponse.json({ error: '서버 토큰 없음' }, { status: 500 });
    }

    const res = await axios.get(
      `https://developer-lostark.game.onstove.com/armories/characters/${encodedName}/profiles`,
      {
        headers: {
          Authorization: `bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    await db.query<ResultSetHeader>(
      'UPDATE characters SET character_image = ?, guild = ?, server_name = ? WHERE name = ?',
      [res.data.CharacterImage, res.data.GuildName, res.data.ServerName, name]
    );

    return NextResponse.json({
      CharacterImage: res.data.CharacterImage,
      GuildName: res.data.GuildName,
      ServerName: res.data.ServerName,
    });
  } catch (err: unknown) {
    let status = 500;
    let message = '알 수 없는 에러';

    if (axios.isAxiosError(err)) {
      status = err.response?.status || 500;
      message = err.response?.data || err.message || '알 수 없는 에러';
    } else if (err instanceof Error) {
      message = err.message;
    }

    return NextResponse.json({ error: 'LOA API 에러', detail: message }, { status });
  }
}
