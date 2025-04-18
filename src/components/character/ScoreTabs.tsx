import { useState, useEffect } from 'react';
import styles from './ScoreTabs.module.scss';
import axios from 'axios';

type Props = {
  characterId: number;
};

const ScoreTabs = ({ characterId }: Props) => {
  const [activeTab, setActiveTab] = useState('점수');
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState(0);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/api/character/score`, {
        params: { characterId },
      });
      setData(res.data.calculatedScore);
    };

    fetchData();
  }, [characterId]);

  return (
    <div>
      <div className={styles.tabList}>
        <button
          className={`${styles.tab} ${activeTab === '트리시온' ? styles.active : ''}`}
          onClick={() => setActiveTab('트리시온')}
        >
          트리시온
        </button>
        <button
          className={`${styles.tab} ${activeTab === '점수' ? styles.active : ''}`}
          onClick={() => setActiveTab('점수')}
        >
          점수
        </button>
        <button
          className={`${styles.tab} ${activeTab === '2분' ? styles.active : ''}`}
          onClick={() => setActiveTab('2분')}
        >
          2분
        </button>
      </div>
      <div className={styles.tabContent}>
        <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
          {activeTab === '트리시온' && (
            <div className={styles.dpsContainer}>
              <div className={styles.dpsLabel}>DPS</div>
              <div className={styles.dpsValue}>TBD</div>
            </div>
          )}
          {activeTab === '점수' && (
            <div className={styles.dpsContainer}>
              <div className={styles.dpsLabel}>점수</div>
              <div className={styles.dpsValue}>{data}</div>
            </div>
          )}
          {activeTab === '2분' && (
            <div className={styles.dpsContainer}>
              <div className={styles.dpsLabel}>DPS</div>
              <div className={styles.dpsValue}>TBD</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreTabs;
