import { ArmoryEquipment } from '@/types/character';
import { db } from '@/lib/db';
import {
  extractElixirEffects,
  extractAccessoryEffects,
  extractAbilityStoneEngravings,
  extractRefinementLevel,
  extractTranscendenceLevel,
  extractBraceletStatsAndEffects,
} from './extractUtils';

export default async function saveEquipment(characterId: number, equipment: any[]) {
  try {
    const processedEquipment = equipment.map(async (item: ArmoryEquipment) => {
      const isAccessory = ['목걸이', '귀걸이', '반지'].includes(item.Type);
      const isStone = item.Type === '어빌리티 스톤';
      const isBracelet = item.Type === '팔찌';
      const isEquipment = ['투구', '상의', '하의', '장갑', '무기', '어깨'].includes(item.Type);

      const refinementLevel = isEquipment ? extractRefinementLevel(item.Tooltip) : null;
      const transcendenceLevel = extractTranscendenceLevel(item.Tooltip);

      const elixirEffects = isEquipment ? extractElixirEffects(item.Tooltip) : [null, null, null];
      const accessoryEffects = isAccessory
        ? extractAccessoryEffects(item.Tooltip)
        : [null, null, null];
      const stoneEffects = isStone
        ? extractAbilityStoneEngravings(item.Tooltip)
        : [null, null, null];

      const { stats: braceletMainStats, effects: braceletEffects } =
        item.Type === '팔찌'
          ? extractBraceletStatsAndEffects(item.Tooltip)
          : { stats: [], effects: [] };

      let equipmentEffects = [];

      if (isStone) {
        equipmentEffects = [null, null, ...stoneEffects];
      } else if (isBracelet) {
        equipmentEffects = [...braceletMainStats, ...braceletEffects];
      } else if (isAccessory) {
        equipmentEffects = [null, null, ...accessoryEffects];
      } else if (item.Type === '무기') {
        equipmentEffects = [null, null, null, null, null];
      } else if (isEquipment) {
        equipmentEffects = [null, null, ...elixirEffects, null];
      } else {
        equipmentEffects = [null, null, null, null, null];
      }

      const result = {
        ...item,
        refinementLevel,
        transcendenceLevel,
        equipmentEffects,
      };

      console.log(item.Type, equipmentEffects);

      const existingEquipment = await db.query(
        `SELECT * FROM equipments WHERE character_id = ? AND type = ?`,
        [characterId, result.Type]
      );

      console.log(existingEquipment);

      if (Array.isArray(existingEquipment[0]) && existingEquipment[0].length > 0) {
        await db.query(
          `UPDATE equipments 
           SET name = ?, icon = ?, grade = ?, transcendence = ?, refinement = ?, slot_1 = ?, slot_2 = ?, slot_3 = ?, slot_4 = ?, slot_5 = ?
           WHERE character_id = ? AND type = ?`,
          [
            result.Name,
            result.Icon,
            result.Grade,
            result.transcendenceLevel,
            result.refinementLevel,
            ...result.equipmentEffects,
            characterId,
            result.Type,
          ]
        );
      } else {
        await db.query(
          `INSERT INTO equipments (character_id, type, name, icon, grade, transcendence, refinement, slot_1, slot_2, slot_3, slot_4, slot_5)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            characterId,
            result.Type,
            result.Name,
            result.Icon,
            result.Grade,
            result.transcendenceLevel,
            result.refinementLevel,
            ...result.equipmentEffects,
          ]
        );
      }

      return result;
    });

    return await Promise.all(processedEquipment);
  } catch (error) {
    console.error('Equipment processing error:', error);
    return { error: '장비 데이터 처리 중 오류가 발생했습니다.' };
  }
}
