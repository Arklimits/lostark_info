import { TopNavBar } from '@/components/navbar/TopNavBar';
import './layout.scss';
import type { ReactNode } from 'react';

export default function SearchLayout({ children }: { children: ReactNode }) {
  return (
    <div className="search-list-container">
      <TopNavBar />
      {children}
    </div>
  );
}
