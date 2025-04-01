import './layout.scss';
import type { ReactNode } from 'react';

export default function CharacterLayout({ children }: { children: ReactNode }) {
  return <main className="character-page-container">{children}</main>;
}
