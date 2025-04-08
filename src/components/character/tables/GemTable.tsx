import axios from 'axios';
import { useState, useEffect } from 'react';
import { Gem } from '@/types/dto/gem';
import Image from 'next/image';
import styles from './GemTable.module.scss';

const GemTable = ({ characterId }: { characterId: number }) => {
  const [gems, setGems] = useState<Gem[]>([]);

  useEffect(() => {
    const fetchGems = async () => {
      const json = await axios.get(`/api/character/gem?characterId=${characterId}`);

      setGems(json.data.data);
    };
    fetchGems();
  }, []);

  return (
    <div className={styles.gemContainer}>
      {gems.map(gem => (
        <div className={styles.gem} key={gem.slot} data-grade={gem.grade}>
          <Image src={gem.icon} alt={gem.name} width={50} height={50} />
          <div className={styles.level}>{gem.level}</div>
        </div>
      ))}
    </div>
  );
};

export default GemTable;
