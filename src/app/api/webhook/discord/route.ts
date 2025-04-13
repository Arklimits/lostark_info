import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DISCORD_WEBHOOK_URL) {
      throw new Error('DISCORD_WEBHOOK_URL is not defined');
    }

    const body = await request.json();

    const response = await axios.post(process.env.DISCORD_WEBHOOK_URL, {
      content: `${body.author ? `👤 작성자: ${body.author}` : 'unknown'}\n📝 문의 내용:\n${body.content}`,
    });

    return NextResponse.json({ message: '성공적으로 전송되었습니다.' });
  } catch (error) {
    console.error('Error sending message to Discord:', error);
    return NextResponse.json({ message: '오류가 발생했습니다.' }, { status: 500 });
  }
}
