import { NextRequest, NextResponse } from 'next/server';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import axios from 'axios';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ error: '검색어가 없습니다.' }, { status: 400 });
  }

  try {
    // 1. DB에 캐릭터가 이미 있는지 확인
    const [existing] = await db.query<RowDataPacket[]>('SELECT * FROM characters WHERE name = ?', [
      keyword,
    ]);

    if (Array.isArray(existing) && existing.length > 0) {
      const expeditionId = existing[0].expedition_id;

      const [siblings] = await db.query<RowDataPacket[]>(
        'SELECT * FROM characters WHERE expedition_id = ?',
        [expeditionId]
      );

      const characters = siblings.map(sibling => ({
        ServerName: existing[0].server,
        CharacterName: sibling.name,
        CharacterLevel: sibling.character_level,
        CharacterClassName: sibling.class,
        ItemMaxLevel: sibling.item_level,
      }));

      return NextResponse.json(characters);
    }

    // 2. 없으면 LOA API 호출
    const encodedName = encodeURIComponent(keyword);
    const apiUrl = `https://developer-lostark.game.onstove.com/characters/${encodedName}/siblings`;

    const token = process.env.LOSTARK_API_TOKEN;
    if (!token) {
      return NextResponse.json({ error: '서버 토큰 없음' }, { status: 500 });
    }

    const res = await axios.get(apiUrl, {
      headers: {
        Authorization: `bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const characters = res.data;

    if (!Array.isArray(characters) || characters.length === 0) {
      return NextResponse.json({ error: '캐릭터를 찾을 수 없습니다.' }, { status: 404 });
    }

    // DB에서 이 원정대 캐릭터 중 이미 등록된 게 있는지 확인
    const characterNames = characters.map((c: any) => c.CharacterName);
    const [existingChars] = await db.query<RowDataPacket[]>(
      `SELECT * FROM characters WHERE name IN (${characterNames.map(() => '?').join(',')})`,
      characterNames
    );

    let expeditionId: number;

    if (existingChars.length > 0) {
      // 기존 캐릭터가 있다면 그 캐릭터의 expedition_id 사용
      expeditionId = existingChars[0].expedition_id;
    } else {
      // 없으면 새 원정대 생성
      const mainChar = characters[0];
      const expeditionServer = mainChar.ServerName;

      const [expInsert] = await db.query<ResultSetHeader>(
        'INSERT INTO expeditions (server, created_by, created_at) VALUES (?, ?, NOW())',
        [expeditionServer, keyword]
      );
      expeditionId = expInsert.insertId;
    }

    for (const char of characters) {
      char.ItemMaxLevel = Number(char.ItemMaxLevel.replace(/,/g, ''));

      // 캐릭터 저장
      await db.query(
        `INSERT INTO characters (name, expedition_id, character_level, class, item_level, server_name, created_at, modified_at)
          VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
          ON DUPLICATE KEY UPDATE modified_at = NOW(), expedition_id = ?`,
        [
          char.CharacterName,
          expeditionId,
          char.CharacterLevel,
          char.CharacterClassName,
          char.ItemMaxLevel,
          char.ServerName,
          expeditionId,
        ]
      );
    }

    return NextResponse.json(characters);
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
