import SearchPage from '@/components/search/SearchPage';
import SearchBar from '@/components/search/SearchBar';
import { Suspense } from 'react';

export default function Page() {
  return (
    <main>
      <section className="top-section">
        <SearchBar />
      </section>
      <section>
        <Suspense>
          <SearchPage />
        </Suspense>
      </section>
    </main>
  );
}
