import SearchPage from '@/components/search/SearchPage';
import SearchBar from '@/components/search/SearchBar';
import { Suspense } from 'react';

export default function Page() {
  return (
    <main>
      <section>
        <Suspense>
          <SearchPage />
        </Suspense>
      </section>
    </main>
  );
}
