import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "이름 없음" }, { status: 400 });
  }

  const encoded = encodeURIComponent(name);
  const apiUrl = `https://developer-lostark.game.onstove.com/armories/characters/${encoded}/profiles`;
  const token = process.env.LOSTARK_API_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "서버 토큰 없음" }, { status: 500 });
  }

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `bearer ${token}`,
        Accept: "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: "요청 전송 실패", detail: errText }, { status: res.status });
    }

    const data = await res.json();
    console.log(data.CharacterImage)
    return NextResponse.json({ CharacterImage: data.CharacterImage, GuildName: data.GuildName });
  } catch (err) {
    return NextResponse.json({ error: "요청 실패", detail: err }, { status: 500 });
  }
}
