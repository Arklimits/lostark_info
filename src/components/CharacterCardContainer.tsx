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
  GuildName: string;
  AttackPower: string;
  score: string;
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
              const profileRes = await axios.get(`/api/character/profile`, {
                params: { name: char.CharacterName },
              });
              const profile = profileRes.data;

              return {
                ...char,
                imageUrl: profile.CharacterImage || "/img-unknown.png",
                GuildName: profile.GuildName ?? "-",
                AttackPower: profile.AttackPower ?? "-"
              };
            } catch {
              return {
                ...char,
                imageUrl: "/img-unknown.png",
                GuildName: "-",
                AttackPower: "-"
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

  const handleCardClick = async (CharacterName: string) => {
    if (!characters) return;

    try {
      const res = await axios.get("/api/character/score/", {
        params: { name: CharacterName }
      });

      const updated = characters.map((char) =>
        char.CharacterName === CharacterName
          ? { ...char, score: res.data.score }
          : char
      );

      setCharacters(updated);
    } catch (error) {
      console.error("스코어 계산 실패:", error);
    }
  };


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
          guildName={char.GuildName}
          itemLevel={char.ItemAvgLevel}
          score={char.score ?? "-"}
          onClick={() => handleCardClick(char.CharacterName)}
        />
      ))}
    </div>
  );
};

export default CharacterCardContainer;
