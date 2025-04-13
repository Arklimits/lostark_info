import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { db } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import saveEquipment from '@/services/equipments/saveEquipment';
import saveGems from '@/services/gems/saveGems';
import saveArkPassive from '@/services/arkpassives/saveArkPassive';
import saveEngraving from '@/services/engravings/saveEngraving';
import saveSkill from '@/services/skills/saveSkill';

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
    const [exist] = await db.query<RowDataPacket[]>('SELECT * FROM characters WHERE name = ?', [
      name,
    ]);

    if (exist.length > 0) {
      const cached = exist[0].id;
      const modifiedAt = new Date(exist[0].modified_at);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      if (modifiedAt > fiveMinutesAgo) {
        return NextResponse.json({ characterId: cached });
      }
    }

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
       SET expedition_level = ?
       WHERE id = (SELECT expedition_id FROM characters WHERE name = ?)`,
      [json.ArmoryProfile.ExpeditionLevel, name]
    );

    const calculatedScore = json.ArmoryProfile.Stats[7].Value;

    await db.query(
      `UPDATE characters
       SET character_image = ?, character_level = ?, item_level = ?, crit = ?, specialization = ?,
        domination = ?, swiftness = ?,  endurance = ?, expertise = ?, vitality = ?, attack_point = ?,
        calculated_score = ?, modified_at = NOW()
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
        calculatedScore,
        name,
      ]
    );

    const [rows] = await db.query<(RowDataPacket & { id: number })[]>(
      `SELECT id FROM characters WHERE name = ?`,
      [name]
    );

    const characterId = exist[0]?.id;

    const equipment = await saveEquipment(characterId, json.ArmoryEquipment);
    const gems = await saveGems(characterId, json.ArmoryGem);
    const arkPassive = await saveArkPassive(characterId, json.ArkPassive);
    const engraving = await saveEngraving(characterId, json.ArmoryEngraving);
    const skill = await saveSkill(characterId, json.ArmorySkills);

    return NextResponse.json({ characterId });
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
