import { db } from '@/lib/db';
import { parseArkPassive } from './extractUtils';

export default async function saveArkPassive(characterId: number, arkPassive: any) {
  if (!Array.isArray(arkPassive?.Effects)) {
    throw new Error('ArkPassive data is not in expected format');
  }

  try {
    const processedArkPassive = arkPassive.Effects.map(async (item: any) => {
      const data = parseArkPassive(item);

      await db.query(`DELETE FROM character_arkpassives WHERE character_id = ?;`, [characterId]);

      await db.query(
        `INSERT INTO character_arkpassives (character_id, name, title, level)
        VALUES (?, ?, ?, ?);`,
        [characterId, data.name, data.title, data.level]
      );

      return data;
    });

    await Promise.all(processedArkPassive);
  } catch (error) {
    console.error('Error saving arkpassives:', error);
    throw error;
  }
}
