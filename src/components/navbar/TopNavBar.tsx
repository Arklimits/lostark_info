'use client';

import styles from './TopNavBar.module.scss';
import SearchBar from '../search/SearchBar';
import { useRouter } from 'next/navigation';

export const TopNavBar = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <div className={styles.logo} onClick={() => router.push('/')}>
          LOSTDAM
        </div>
        <SearchBar className={styles.navSearchBar} />
      </div>
    </div>
  );
};

export default TopNavBar;
