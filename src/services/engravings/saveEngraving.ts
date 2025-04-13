import { db } from '@/lib/db';
import { ArmoryEngraving } from '@/types/character';
import axios from 'axios';

type Response = {
  name: string;
  image_url: string;
};

const saveEngraving = async (characterId: number, engraving: ArmoryEngraving) => {
  await db.query('DELETE FROM character_engravings WHERE character_id = ?', [characterId]);

  const effects = engraving.ArkPassiveEffects;

  const engravingNames = effects.map(effect => effect.Name);
  const responses = await Promise.all(
    engravingNames.map(name => {
      return axios.get<Response>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/info/engraving?names=${encodeURIComponent(name)}`
      );
    })
  );

  for (let index = 0; index < effects.length; index++) {
    const effect = effects[index];
    await db.query(
      'INSERT INTO character_engravings (character_id, name, grade, level, image_url, ability_stone_level) VALUES (?, ?, ?, ?, ?, ?)',
      [
        characterId,
        effect.Name,
        effect.Grade,
        effect.Level,
        responses[index].data.image_url,
        effect.AbilityStoneLevel,
      ]
    );
  }

  const engravingData = effects.map((effect, index) => ({
    Name: effect.Name,
    Grade: effect.Grade,
    Level: effect.Level,
    AbilityStoneLevel: effect.AbilityStoneLevel,
    ImageUrl: effect.ImageUrl,
  }));

  return engravingData;
};

export default saveEngraving;
