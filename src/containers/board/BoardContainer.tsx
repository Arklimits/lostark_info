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

  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  const toggleActive = (index: number) => {
    setActiveIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <div className={`${styles.container} ${styles.scrollBox}`}>
      <div className={styles.boardTitle}>공지사항</div>
      {boardList.map((board, index) => (
        <div className={styles.item} key={index}>
          <h2 className={styles.title} onClick={() => toggleActive(index)}>
            {board.title}
            <span
              className={`${styles.accordionIcon} ${activeIndices.includes(index) ? styles.active : ''}`}
            ></span>
          </h2>
          <div className={`${styles.text} ${activeIndices.includes(index) ? styles.active : ''}`}>
            {board.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardContainer;
