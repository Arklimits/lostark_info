import { ArkPassive } from '@/types/character';
import { ArkPassiveDto } from '@/types/dto/arkPassive';

export default function parseEvolutionDamage(arkPassive: ArkPassive): {
  revoDamageBonus: number;
  critRate: number;
  critDamageBonus: number;
} {
  let revoDamageBonus = 0;
  let critRate = 0;
  let critDamageBonus = 0;
  let cooltimeBonus = 0;
  let attackSpeedBonus = 0;
  let isBlunt = false;

  for (const effect of arkPassive.Effects) {
    const { Name, Description } = effect;
    const { title, level } = extractEffect(Description);

    switch (title) {
      case '끝없는 마나':
        cooltimeBonus += 10 * level;
        break;
      case '금단의 주문':
      case '한계 돌파':
        revoDamageBonus += 10 * level;
        break;
      case '예리한 감각':
        critRate += 4 * level;
        revoDamageBonus += 5 * level;
        break;
      case '최적화 훈련':
        revoDamageBonus += 5 * level;
        cooltimeBonus += 4 * level;
        break;
      case '무한한 마력':
        revoDamageBonus += 8 * level;
        cooltimeBonus += 7 * level;
        break;
      case '혼신의 강타':
        critRate += 12 * level;
        revoDamageBonus += 2 * level;
        break;
      case '일격':
        critRate += 10 * level;
        critDamageBonus += 16 * level;
        break;
      case '파괴 전차':
        revoDamageBonus += 12 * level;
        attackSpeedBonus += 4 * level;
        break;
      case '타이밍 지배':
        cooltimeBonus += 5 * level;
        revoDamageBonus += 8 * level;
        break;
      case '뭉툭한 가시':
        revoDamageBonus += 7.5 * level;
        isBlunt = true;
        break;
      case '음속 돌파':
        revoDamageBonus += 12 * level;
        break;
      case '인파이팅':
        revoDamageBonus += 9 * level;
        break;
      case '입식 타격가':
        revoDamageBonus += 10.5 * level;
        break;
      case '마나 용광로':
        revoDamageBonus += 12 * level;
        break;
    }
  }

  return {
    revoDamageBonus: revoDamageBonus / 100,
    critRate: critRate / 100,
    critDamageBonus: critDamageBonus / 100,
  };
}

function extractEffect(description: string): {
  title: string;
  level: number;
} {
  const match = description.match(/<FONT[^>]*>([^L]+)Lv\.(\d+)<\/FONT>/i);
  if (!match) return { title: '', level: 0 };

  const title = match[1].trim();
  const level = parseInt(match[2], 10);

  return { title, level };
}

/**
 * 아크패시브 정보를 파싱하는 함수
 *
 * @param arkPassive ArkPassive 객체
 * @returns 진화 정보 DTO 배열
 */
export function parseArkPassive(arkPassive: ArkPassive): ArkPassiveDto[] {
  if (!arkPassive || !arkPassive.Effects) {
    return [];
  }

  return arkPassive.Effects.map(effect => {
    const { title, level } = extractEffect(effect.Description);
    const isActive = level > 0;

    return {
      name: effect.Name,
      title,
      icon: effect.Icon,
      level,
      isActive,
    };
  });
}
