"use client";

import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/search/SearchBar";
import CharacterCardContainer from "@/components/card/CharacterCardContainer";
import "@/styles/globals.scss";
import styles from "./SearchPage.module.scss";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword")?.trim() ?? "";

  if (!keyword) {
    return <div>검색어가 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <main>
        <div className={styles.searchSection}>
          <SearchBar />
        </div>
        <CharacterCardContainer keyword={keyword} />
      </main>
    </div>
  );
};

export default SearchPage;
