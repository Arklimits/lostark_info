"use client";

import { useEffect, useState } from "react";
import CharacterCard from "./CharacterCard";

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
      const searchRes = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`);
      const rawList = await searchRes.json();

      const withImages = await Promise.all(
        rawList.map(async (char: CharacterData) => {
          try {
            const profileRes = await fetch(`/api/profile?name=${encodeURIComponent(char.CharacterName)}`);
            const profile = await profileRes.json();

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
    };

    fetchData();
  }, [keyword]);


  if (!characters) return <div>로딩 중...</div>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
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
