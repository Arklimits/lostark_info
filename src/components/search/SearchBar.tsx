'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './SearchBar.module.scss';

const SearchBar = ({ className }: { className?: string }) => {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = keyword.trim();
    if (!trimmed) return;

    const storedSearches = localStorage.getItem('recentSearches');
    const searches = storedSearches ? JSON.parse(storedSearches) : [];
    const newSearches = [
      { keyword: trimmed },
      ...searches.filter((item: { keyword: string }) => item.keyword !== trimmed),
    ].slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));

    router.push(`/search?keyword=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form className={`${styles.searchBar} ${className}`} onSubmit={handleSubmit}>
      <div style={{ width: '10px' }}></div>
      <input
        type="text"
        placeholder="캐릭터명"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
      />
      <button type="submit" aria-label="검색"></button>
    </form>
  );
};

export default SearchBar;
