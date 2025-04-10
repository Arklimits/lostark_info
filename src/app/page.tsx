import Image from 'next/image';
import SearchBar from '@/components/search/SearchBar';
import RecentSearchList from '@/components/search/RecentSearchList';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main>
        <div className="searchSection">
          <SearchBar />
          <div className="divLine" />
          <RecentSearchList />
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
