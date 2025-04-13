'use client';

import { useEffect, useState } from 'react';
import styles from './RecentSearchList.module.scss';

type SearchItem = {
  keyword: string;
};

const RecentSearchList = () => {
  const [allItems, setAllItems] = useState<SearchItem[]>([]);
  const leftItems: SearchItem[] = [];
  const rightItems: SearchItem[] = [];

  useEffect(() => {
    const storedItems = localStorage.getItem('recentSearches');
    if (storedItems) {
      setAllItems(JSON.parse(storedItems));
    }
  }, []);

  const handleRemoveItem = (index: number) => {
    const newItems = allItems.filter((_, idx) => idx !== index);
    setAllItems(newItems);
    localStorage.setItem('recentSearches', JSON.stringify(newItems));
  };

  allItems.forEach((item, index) => {
    if (index < 5) {
      leftItems.push(item);
    } else {
      rightItems.push(item);
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.title}>최근검색</div>
      <div className={styles.gridContainer}>
        <div className={styles.column}>
          {leftItems.map((item, idx) => (
            <div key={idx} className={styles.itemRow}>
              <span>{item.keyword}</span>
              <button className={styles.removeButton} onClick={() => handleRemoveItem(idx)}>
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className={styles.column}>
          {rightItems.map((item, idx) => (
            <div key={idx + 5} className={styles.itemRow}>
              <span>{item.keyword}</span>
              <button className={styles.removeButton} onClick={() => handleRemoveItem(idx + 5)}>
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentSearchList;
