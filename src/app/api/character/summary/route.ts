import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const characterId = searchParams.get('characterId');

  if (!characterId) {
    return NextResponse.json({ error: 'characterId 없음' }, { status: 400 });
  }

  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT c.name as CharacterName, c.character_class_name as CharacterClassName, c.character_level as CharacterLevel,
      c.item_level as ItemMaxLevel, c.guild as GuildName, c.server_name as ServerName, c.character_image as CharacterImage,
      e.expedition_level as ExpeditionLevel
      FROM characters c 
      JOIN expeditions e ON c.expedition_id = e.id
      WHERE c.id = ?`,
    [characterId]
  );

  return NextResponse.json(rows[0]);
}
