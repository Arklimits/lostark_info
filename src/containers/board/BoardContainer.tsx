'use client';

import axios from 'axios';
import styles from './BoardContainer.module.scss';
import { useEffect, useState } from 'react';

export const BoardContainer = () => {
  const [boardList, setBoardList] = useState([
    {
      title: '',
      text: '',
    },
  ]);

  useEffect(() => {
    const fetchBoardList = async () => {
      const response = await axios.get('/api/board');
      setBoardList(response.data.posts);
    };

    fetchBoardList();
  }, []);

  const [isActive, setIsActive] = useState(false);
  return (
    <div className={`${styles.container} ${styles.scrollBox}`}>
      <div className={styles.boardTitle}>공지사항</div>
      {boardList.map((board, index) => (
        <div className={styles.item} key={index}>
          <h2 className={styles.title} onClick={() => setIsActive(!isActive)}>
            {board.title}
            <span className={`${styles.accordionIcon} ${isActive ? styles.active : ''}`}></span>
          </h2>
          <div className={`${styles.text} ${isActive ? styles.active : ''}`}>{board.text}</div>
        </div>
      ))}
    </div>
  );
};

export default BoardContainer;
