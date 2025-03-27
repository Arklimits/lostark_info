import styles from './RecentSearchList.module.scss';

type SearchItem = {
  keyword: string;
};

const allItems: SearchItem[] = [
  { keyword: '아크리미츠' },
  { keyword: '칭찬자판기' },
  { keyword: '비난자판기' },
  { keyword: '폭주끝나고산책하기' },
  { keyword: '아이디가열두글자까지된다' },
  { keyword: '아크탈로스' },
  { keyword: '와이게사네' },
  { keyword: '와이게닿네' },
  { keyword: '와이게맞네' },
  { keyword: '와이게죽네' },
];

const RecentSearchList = () => {
  const leftItems: SearchItem[] = [];
  const rightItems: SearchItem[] = [];

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
              <button className={styles.removeButton}>✕</button>
            </div>
          ))}
        </div>
        <div className={styles.column}>
          {rightItems.map((item, idx) => (
            <div key={idx + 5} className={styles.itemRow}>
              <span>{item.keyword}</span>
              <button className={styles.removeButton}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentSearchList;
