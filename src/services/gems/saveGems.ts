import { db } from '@/lib/db';
import { extractClassAndEffects } from './extractUtils';
import stripHtml from '@/utils/common/stripHtml';

export default async function saveGems(characterId: number, gems: any) {
  try {
    if (!Array.isArray(gems?.Gems)) {
      throw new Error('Gems data is not in expected format');
    }
    const processedGems = gems.Gems.map(async (item: any) => {
      const { class: classMatch, skill: skillMatch } = extractClassAndEffects(item.Tooltip);

      await db.query(
        `INSERT INTO character_gems (character_id, slot, name, icon, grade, level, class, skill)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
          ON DUPLICATE KEY UPDATE name = VALUES(name), icon = VALUES(icon),  grade = VALUES(grade),
          level = VALUES(level),  class = VALUES(class),  skill = VALUES(skill)`,
        [
          characterId,
          item.Slot,
          stripHtml(item.Name),
          item.Icon,
          item.Grade,
          item.Level,
          classMatch,
          skillMatch,
        ]
      );
    });

    await Promise.all(processedGems);
  } catch (error) {
    console.error('Error saving gems:', error);
    throw error;
  }
}
