export default function calculateCriticalDamage({
  motionCoefficient,
  attackPower,
  motionConstant,
  extraDamage,
  damageIncrease,
  damageTakenIncrease,
  criticalDamageIncrease,
  criticalHitDamageMultiplier,
}: {
  motionCoefficient: number; // 스킬 계수
  attackPower: number; // 공격력
  motionConstant: number; // 스킬 상수
  extraDamage: number; // 추가피해
  damageIncrease: number; // 피해증가
  damageTakenIncrease: number; // 적받는피해증가
  criticalDamageIncrease: number; // 치명타피해증가
  criticalHitDamageMultiplier: number; // 치명타시 피해증가
}): number {
  const base = motionCoefficient * attackPower + motionConstant;
  const defenseMultiplier = 6500 / (6500 + 5850);

  const result =
    base *
    extraDamage *
    damageIncrease *
    damageTakenIncrease *
    defenseMultiplier *
    criticalDamageIncrease *
    criticalHitDamageMultiplier;

  return Math.floor(result);
}
