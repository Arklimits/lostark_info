import { Suspense } from 'react';
import SearchBar from '@/components/search/SearchBar';
import CharacterPage from '@/components/character/CharacterPage';

export default function Page() {
  return (
    <main className="page-container">
      <section className="character-section">
        <Suspense fallback={<div>로딩 중...</div>}>
          <CharacterPage />
        </Suspense>
      </section>
    </main>
  );
}
