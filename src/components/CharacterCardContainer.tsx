"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CharacterCard from "./CharacterCard";
import styles from "./CharacterCardContainer.module.scss";

type CharacterData = {
  ServerName: string;
  CharacterName: string;
  CharacterLevel: number;
  CharacterClassName: string;
  ItemAvgLevel: string;
  ItemMaxLevel: string;
  imageUrl: string;
  guildName: string;
};

type Props = {
  keyword: string;
};

const CharacterCardContainer = ({ keyword }: Props) => {
  const [characters, setCharacters] = useState<CharacterData[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchRes = await axios.get(`/api/search`, {
          params: { keyword },
        });
        const rawList = searchRes.data;

        const withImages = await Promise.all(
          rawList.map(async (char: CharacterData) => {
            try {
              const profileRes = await axios.get(`/api/profile`, {
                params: { name: char.CharacterName },
              });
              const profile = profileRes.data;

              return {
                ...char,
                imageUrl: profile.CharacterImage || "/img-anonymous.webp",
                guildName: profile.GuildName ?? "-",
              };
            } catch {
              return {
                ...char,
                imageUrl: "/img-anonymous.webp",
                guildName: "-",
              };
            }
          })
        );

        const sorted = withImages.sort((a, b) => {
          const levelA = parseFloat(a.ItemAvgLevel.replace(",", ""));
          const levelB = parseFloat(b.ItemAvgLevel.replace(",", ""));
          return levelB - levelA;
        });

        setCharacters(sorted);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };

    fetchData();
  }, [keyword]);

  if (!characters) return <div>로딩 중...</div>;

  return (
    <div className={styles.cardContainer}>
      {characters.map((char) => (
        <CharacterCard
          key={char.CharacterName}
          name={char.CharacterName}
          server={char.ServerName}
          job={char.CharacterClassName}
          imageUrl={char.imageUrl}
          classLevel={char.CharacterLevel}
          guildName={char.guildName}
          itemLevel={char.ItemAvgLevel}
          stat2="-"
          stat3="-"
          score="-"
        />
      ))}
    </div>
  );
};

export default CharacterCardContainer;
