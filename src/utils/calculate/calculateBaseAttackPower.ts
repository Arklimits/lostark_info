export function calculateBaseAttackPower({
  jobStat,
  weaponAttackPower,
  baseAttackIncrease,
}: {
  jobStat: number; // ex) 530945
  weaponAttackPower: number; // ex) 184429
  baseAttackIncrease: number; // ex) 1.08
}): number {
  const base = Math.sqrt((jobStat * weaponAttackPower) / 6);
  return base * baseAttackIncrease;
}
