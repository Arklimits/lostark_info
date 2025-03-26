import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");

  if (!keyword) {
    return NextResponse.json({ error: "검색어가 없습니다." }, { status: 400 });
  }

  const encodedName = encodeURIComponent(keyword);
  const apiUrl = `https://developer-lostark.game.onstove.com/characters/${encodedName}/siblings`;

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
      const errorText = await res.text();
      return NextResponse.json({ error: "LOA API 에러", detail: errorText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "요청 실패", detail: err }, { status: 500 });
  }
}
