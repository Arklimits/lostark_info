import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: '이름 없음' }, { status: 400 });
  }

  const encodedName = encodeURIComponent(name);
  const apiUrl = `https://developer-lostark.game.onstove.com/armories/characters/${encodedName}`;
  const token = process.env.LOSTARK_API_TOKEN;

  if (!token) {
    return NextResponse.json({ error: '서버 토큰 없음' }, { status: 500 });
  }

  try {
    const res = await axios.get(apiUrl, {
      headers: {
        Authorization: `bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return NextResponse.json(res.data);
  } catch (err: unknown) {
    let status = 500;
    let message = '알 수 없는 에러';

    if (axios.isAxiosError(err)) {
      status = err.response?.status || 500;
      message = err.response?.data || err.message || '알 수 없는 에러';
    } else if (err instanceof Error) {
      message = err.message;
    }

    return NextResponse.json({ error: 'LOA API 에러', detail: message }, { status });
  }
}
