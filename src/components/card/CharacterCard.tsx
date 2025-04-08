'use client';

import Image from 'next/image';
import styles from './CharacterCard.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
type CharacterCardProps = {
  name: string;
  job: string;
  imageUrl: string;
  classLevel: number;
  guildName: string;
  serverName: string;
  itemLevel: number;
  onClick?: () => void;
};

const CharacterCard = ({
  name,
  job,
  imageUrl,
  classLevel,
  guildName,
  serverName,
  itemLevel,
  onClick,
}: CharacterCardProps) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchScore = async () => {
      const res = await axios.get(`/api/character/score`, {
        params: { characterName: name },
      });

      setScore(res.data.calculatedScore);
    };
    fetchScore();
  }, []);

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <span className={styles.job}>{job}</span>
      </div>
      <span className={styles.server}>{serverName}</span>
      <Image
        className={styles.avatar}
        src={imageUrl}
        alt={`${name} 이미지`}
        width={160}
        height={200}
        unoptimized
      />
      <div className={styles.info}>
        <span className={styles.itemLevel}>{itemLevel}</span>
        <div className={styles.name}>{name}</div>
        <div className={styles.guild}>{guildName}</div>
        <div className={styles.score}>{score ? score.toLocaleString() : '-'}</div>
      </div>
    </div>
  );
};

export default CharacterCard;
