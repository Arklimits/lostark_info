"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import SearchBar from "@/components/search/SearchBar";
import CharacterCardContainer from "@/components/card/CharacterCardContainer";
import "@/styles/globals.scss";
import styles from "./SearchPage.module.scss";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword")?.trim() ?? "";

  useEffect(() => {
    if (!keyword) {
      router.push("/");
    }
  }, [keyword, router]);

  if (!keyword) {
    return <div>메인화면으로 돌아갑니다.</div>;
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
