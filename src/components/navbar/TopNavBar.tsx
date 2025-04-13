import styles from './TopNavBar.module.scss';
import SearchBar from '../search/SearchBar';

export const TopNavBar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <div className={styles.logo}>LOSTDAM</div>
        <SearchBar className={styles.navSearchBar} />
      </div>
    </div>
  );
};

export default TopNavBar;
