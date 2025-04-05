import { ArmoryEngraving } from '@/types/character';

export default function parseEngraving(engraving: ArmoryEngraving): {
  attackBonus: number;
  damageBonus: number;
  critRate: number;
  critDamageBonus: number;
} {
  const effects = engraving.ArkPassiveEffects ?? [];

  let attackBonus = 0;
  let damageBonus = 0;
  let critRate = 80;
  let critDamageBonus = 0;

  for (const effect of effects) {
    const { Name, Description } = effect;
    const values = extractPercentValue(Description);

    switch (Name) {
      case '원한':
      case '저주받은 인형':
      case '바리케이드':
      case '추진력':
      case '타격의 대가':
        damageBonus += values[0];
        break;
      case '결투의 대가':
      case '기습의 대가':
        damageBonus += values[0] + values[1];
        break;
      case '돌격대장':
        damageBonus += values[0] * 0.4;
        break;
      case '아드레날린':
        attackBonus += values[0] * 6;
        critRate += values[1];
        break;
      case '달인의 저력':
      case '마나 효율 증가':
      case '속전속결':
      case '슈퍼 차지':
      case '안정된 상태':
      case '질량 증가':
        damageBonus += values[1];
        break;
      case '에테르 포식자':
        attackBonus += values[0] / 2;
        break;
      case '예리한 둔기':
        damageBonus -= 2;
        critDamageBonus += values[0];
        break;
      case '정밀 단도':
        critRate += values[0];
        critDamageBonus -= values[1];
        break;
    }
  }

  attackBonus /= 100;
  damageBonus /= 100;
  critRate /= 100;
  critDamageBonus /= 100;

  return { attackBonus, damageBonus, critRate, critDamageBonus };
}

function extractPercentValue(text: string): number[] {
  const matches = [...text.matchAll(/([0-9.]+)%/g)];
  return matches.map(m => parseFloat(m[1]));
}
