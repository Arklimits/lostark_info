import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

type EngravingEffect = {
  Name: string;
  Description: string;
};

function extractPercentValue(text: string): number[] {
  const matches = [...text.matchAll(/([0-9.]+)%/g)];
  return matches.map((m) => parseFloat(m[1]));
}

function parseEngravingBonus(effects: EngravingEffect[]) {
  let attackBonus = 0;
  let damageBonus = 0;
  let critRate = 80;
  let critDamageBonus = 0;

  for (const effect of effects) {
    const { Name, Description } = effect;
    const values = extractPercentValue(Description);

    switch (Name) {
      case "원한":
      case "저주받은 인형":
      case "바리케이드":
      case "추진력":
      case "타격의 대가":
        damageBonus += values[0];
        break;
      case "결투의 대가":
      case "기습의 대가":
        damageBonus += values[0] + values[1];
        break;
      case "돌격대장":
        damageBonus += values[0] * 0.4;
        break;
      case "아드레날린":
        attackBonus += values[0] * 6;
        critRate += values[1];
        break;
      case "달인의 저력":
      case "마나 효율 증가":
      case "속전속결":
      case "슈퍼 차지":
      case "안정된 상태":
      case "질량 증가":
        damageBonus += values[1];
        break;
      case "에테르 포식자":
        attackBonus += values[0] / 2;
        break;
      case "예리한 둔기":
        damageBonus -= 2;
        critDamageBonus += values[0];
      case "정밀 단도":
        critRate += values[0];
        critDamageBonus -= values[1];
    }
  }

  return { attackBonus, damageBonus, engCritRate: critRate, critDamageBonus };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "name 파라미터가 필요합니다." }, { status: 400 });
  }

  try {
    const [profileRes, engravingRes] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/character/profile`, { params: { name } }),
      axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/character/engraving`, { params: { name } }),
    ]);

    const attack = parseFloat((profileRes.data.AttackPower ?? "0").replace(",", ""));
    const profileCritRate = parseFloat((profileRes.data.CritRate ?? "0"));
    const coolDown = parseFloat((profileRes.data.CoolDown ?? "0"));
    const profileDamageBonus = parseFloat((profileRes.data.DamageBonus ?? "0"));
    const engraving = engravingRes.data.ArkPassiveEffects;

    const { attackBonus, damageBonus, engCritRate, critDamageBonus } = parseEngravingBonus(engraving);

    const critRate = profileCritRate + engCritRate > 100 ? 100 : profileCritRate + engCritRate

    const score = Math.round(
      (attack * (1 + attackBonus / 100)) * (1 + (profileDamageBonus + damageBonus) / 100) * ((1 - critRate / 100) + (critRate / 100) * (2 + critDamageBonus / 100)) / (1 - coolDown / 100)
    ).toLocaleString();

    console.log(score)

    return NextResponse.json({ score });
  } catch (e) {
    console.error("score 계산 에러:", e);
    return NextResponse.json({ error: "score 계산 실패" }, { status: 500 });
  }
}
