import './layout.scss';
import type { ReactNode } from 'react';

export default function CharacterLayout({ children }: { children: ReactNode }) {
  return <body className="character-page-container">{children}</body>;
}
