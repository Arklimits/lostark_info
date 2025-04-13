'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import CharacterCard from './CharacterCard';
import styles from './CharacterCardContainer.module.scss';

type CharacterData = {
  ServerName: string;
  CharacterName: string;
  CharacterLevel: number;
  CharacterClassName: string;
  ItemAvgLevel: number;
  ItemMaxLevel: number;
  imageUrl: string;
  GuildName: string;
  AttackPower: string;
};

type Props = {
  keyword: string;
};

const CharacterCardContainer = ({ keyword }: Props) => {
  const [characters, setCharacters] = useState<CharacterData[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchRes = await axios.get('/api/search', {
          params: { keyword },
        });
        const rawList = searchRes.data;

        const withImages = await Promise.all(
          rawList.map(async (char: CharacterData) => {
            try {
              const profileRes = await axios.get('/api/character/profile', {
                params: { name: char.CharacterName },
              });
              const profile = profileRes.data;

              return {
                ...char,
                imageUrl: profile.CharacterImage || '/img-unknown.png',
                GuildName: profile.GuildName ?? '-',
                ServerName: profile.ServerName ?? '-',
                AttackPower: profile.AttackPower ?? '-',
              };
            } catch {
              return {
                ...char,
                imageUrl: '/img-unknown.png',
                GuildName: '-',
                ServerName: '-',
                AttackPower: '-',
              };
            }
          })
        );

        const sorted = withImages.sort((a, b) => {
          const levelA = a.ItemMaxLevel;
          const levelB = b.ItemMaxLevel;
          return levelB - levelA;
        });

        setCharacters(sorted);
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    };

    fetchData();
  }, [keyword]);

  if (!characters) return <div>로딩 중...</div>;

  return (
    <div className={styles.cardContainer}>
      {characters.map(char => (
        <CharacterCard
          key={char.CharacterName}
          name={char.CharacterName}
          serverName={char.ServerName}
          job={char.CharacterClassName}
          imageUrl={char.imageUrl}
          classLevel={char.CharacterLevel}
          guildName={char.GuildName}
          itemLevel={char.ItemMaxLevel}
          onClick={() => router.push(`/character?name=${char.CharacterName}`)}
        />
      ))}
    </div>
  );
};

export default CharacterCardContainer;
