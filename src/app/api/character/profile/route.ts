import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { Stat } from "@/types/character"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "이름 없음" }, { status: 400 });
  }

  const encodedName = encodeURIComponent(name);
  const apiUrl = `https://developer-lostark.game.onstove.com/armories/characters/${encodedName}/profiles`;
  const token = process.env.LOSTARK_API_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "서버 토큰 없음" }, { status: 500 });
  }

  try {
    const res = await axios.get(apiUrl, {
      headers: {
        Authorization: `bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = res.data;

    const critStat = data.Stats.find((s: Stat) => s.Type === "치명");
    let critRate = null;
    if (critStat && Array.isArray(critStat.Tooltip)) {
      const match = critStat.Tooltip[0].match(/([0-9.]+)%/);
      critRate = match?.[1] ?? null;
    }

    const swiftness = data.Stats.find((s: Stat) => s.Type === "신속");
    const tooltip = swiftness?.Tooltip.find((line: string) =>
      line.includes("스킬 재사용 대기시간")
    );
    const coolDown = tooltip?.match(/([0-9.]+)%/)?.[1] ?? null;

    const specialize = data.Stats.find((s: Stat) => s.Type === "특화");
    const line = specialize?.Tooltip.find((line: string) =>
      line.includes("피해량이") && line.includes("%")
    );
    const damageBonus = line?.match(/([0-9.]+)%/)?.[1] ?? null;

    return NextResponse.json({
      CharacterImage: data.CharacterImage,
      GuildName: data.GuildName,
      AttackPower: data.Stats[7].Value,
      CritRate: critRate,
      CoolDown: coolDown,
      DamageBonus: damageBonus,
    });
  } catch (err: unknown) {
    let status = 500;
    let message = "알 수 없는 에러";

    if (axios.isAxiosError(err)) {
      status = err.response?.status || 500;
      message = err.response?.data || err.message || "알 수 없는 에러";
    } else if (err instanceof Error) {
      message = err.message;
    }

    return NextResponse.json(
      { error: "LOA API 에러", detail: message },
      { status }
    );
  }
}
