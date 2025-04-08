import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { db } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import saveEquipment from '@/services/equipment/saveEquipment';

type CachedCharacter = RowDataPacket & {
  data: string;
  modified_at: string;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: '이름 없음' }, { status: 400 });
  }

  const token = process.env.LOSTARK_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: '서버 토큰 없음' }, { status: 500 });
  }

  const encodedName = encodeURIComponent(name);

  try {
    // const [rows] = await db.query<CachedCharacter[]>(
    //   `SELECT data, modified_at FROM character_cache WHERE name = ?`,
    //   [name]
    // );

    // const cached = rows.length > 0 ? rows[0] : null;

    // if (cached) {
    //   const modifiedAt = new Date(cached.modified_at);
    //   const now = new Date();
    //   const diffMinutes = (now.getTime() - modifiedAt.getTime()) / (1000 * 60);

    //   if (diffMinutes < 5) {
    //     return NextResponse.json(JSON.parse(cached.data));
    //   }
    // }

    const apiUrl = `https://developer-lostark.game.onstove.com/armories/characters/${encodedName}`;
    const res = await axios.get(apiUrl, {
      headers: {
        Authorization: `bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const json = res.data;

    // 원정대 정보 업데이트
    await db.query(
      `UPDATE expeditions
       SET expedition_level = ?, town_name = ?
       WHERE id = (SELECT expedition_id FROM characters WHERE name = ?)`,
      [json.ArmoryProfile.ExpeditionLevel, json.ArmoryProfile.TownName, name]
    );

    await db.query(
      `UPDATE characters
       SET character_image = ?, character_level = ?, item_level = ?, crit = ?, specialization = ?,
        domination = ?, swiftness = ?,  endurance = ?, expertise = ?, vitality = ?, attack_point = ?
       WHERE name = ?`,
      [
        json.ArmoryProfile.CharacterImage,
        json.ArmoryProfile.CharacterLevel,
        json.ArmoryProfile.ItemMaxLevel.replace(/,/g, ''),
        json.ArmoryProfile.Stats[0].Value,
        json.ArmoryProfile.Stats[1].Value,
        json.ArmoryProfile.Stats[2].Value,
        json.ArmoryProfile.Stats[3].Value,
        json.ArmoryProfile.Stats[4].Value,
        json.ArmoryProfile.Stats[5].Value,
        json.ArmoryProfile.Stats[6].Value,
        json.ArmoryProfile.Stats[7].Value,
        name,
      ]
    );

    const [rows] = await db.query<(RowDataPacket & { id: number })[]>(
      `SELECT id FROM characters WHERE name = ?`,
      [name]
    );

    const characterId = rows[0]?.id;

    const equipment = await saveEquipment(characterId, json.ArmoryEquipment);

    await db.query(
      `INSERT INTO character_cache (name, data, modified_at)
       VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE data = VALUES(data), modified_at = NOW()`,
      [name, JSON.stringify(json)]
    );

    json.id = characterId;

    return NextResponse.json(json);
  } catch (err: unknown) {
    let status = 500;
    let message = '알 수 없는 에러';

    if (axios.isAxiosError(err)) {
      status = err.response?.status || 500;
      message = err.response?.data || err.message || '알 수 없는 에러';
    } else if (err instanceof Error) {
      message = err.message;
    }

    console.log(err);

    return NextResponse.json({ error: 'LOA API 에러', detail: message }, { status });
  }
}
