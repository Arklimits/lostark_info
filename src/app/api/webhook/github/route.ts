import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers.authorization !== `Bearer ${process.env.DEPLOY_SECRET}`) {
    return res.status(403).end('Forbidden');
  }

  exec(
    'git pull origin main && yarn install && yarn build && pm2 restart app',
    (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return res.status(500).json({ error: stderr });
      }

      console.log(stdout);
      res.status(200).json({ message: 'Deployed!' });
    }
  );
}
