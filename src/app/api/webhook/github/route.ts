import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.DEPLOY_SECRET}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return new Promise(resolve => {
    exec(
      'git pull origin main && yarn install && yarn build && pm2 restart app',
      (err, stdout, stderr) => {
        if (err) {
          resolve(NextResponse.json({ error: stderr }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ message: 'Deployed!', output: stdout }));
        }
      }
    );
  });
}
