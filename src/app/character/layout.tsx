import './layout.scss';
import type { ReactNode } from 'react';
import { TopNavBar } from '@/components/navbar/TopNavBar';

export default function CharacterLayout({ children }: { children: ReactNode }) {
  return (
    <div className="character-page-container">
      <TopNavBar />
      {children}
    </div>
  );
}
