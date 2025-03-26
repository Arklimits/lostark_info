import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

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
    const res = await axios.get(apiUrl, {
      headers: {
        Authorization: `bearer ${token}`,
        Accept: "application/json",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    const status = err.response?.status || 500;
    const message = err.response?.data || err.message || "알 수 없는 에러";
    return NextResponse.json(
      { error: "LOA API 에러", detail: message },
      { status }
    );
  }
}
