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
