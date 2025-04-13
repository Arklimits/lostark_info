import { db } from '@/lib/db';
import { ArmorySkill } from '@/types/character';
import { extractCoolTimeFromTooltip } from './extractUtils';
import { extractTripodsFromTooltip } from './extractUtils';

const saveSkill = async (characterId: number, skills: ArmorySkill[]) => {
  // 기존 스킬 데이터 삭제
  await db.query('DELETE FROM character_skills WHERE character_id = ?', [characterId]);

  // 새로운 스킬 데이터 저장
  for (const skill of skills) {
    const tripods = extractTripodsFromTooltip(skill.Tooltip);

    await db.query(
      `INSERT INTO character_skills 
        (character_id, name, icon, level, tripod1_name, tripod1_icon, tripod1_tier, tripod1_is_tier_max,
        tripod2_name, tripod2_icon, tripod2_tier, tripod2_is_tier_max, tripod3_name, tripod3_icon, tripod3_tier, tripod3_is_tier_max,
        rune_name, rune_icon, rune_grade) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        characterId,
        skill.Name,
        skill.Icon,
        skill.Level,
        tripods[0]?.name ?? '',
        tripods[0]?.icon ?? '',
        tripods[0]?.tier ?? 0,
        tripods[0]?.isTierMax ?? false,
        tripods[1]?.name ?? '',
        tripods[1]?.icon ?? '',
        tripods[1]?.tier ?? 0,
        tripods[1]?.isTierMax ?? false,
        tripods[2]?.name ?? '',
        tripods[2]?.icon ?? '',
        tripods[2]?.tier ?? 0,
        tripods[2]?.isTierMax ?? false,
        skill.Rune?.Name ?? '',
        skill.Rune?.Icon ?? '',
        skill.Rune?.Grade ?? '',
      ]
    );
  }

  return skills;
};

export default saveSkill;
