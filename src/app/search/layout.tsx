import './layout.scss';
import type { ReactNode } from 'react';

export default function CharacterLayout({ children }: { children: ReactNode }) {
  return <div className="search-list-container">{children}</div>;
}
