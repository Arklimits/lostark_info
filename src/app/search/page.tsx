import SearchBar from "@/components/search/SearchBar";
import CharacterCardContainer from "@/components/card/CharacterCardContainer";
import "@/styles/globals.scss";
import styles from "./SearchPage.module.scss"

type SearchPageProps = {
  searchParams: { keyword?: string };
};

const SearchPage = ({ searchParams }: SearchPageProps) => {
  const keyword = typeof searchParams.keyword === "string" ? searchParams.keyword.trim() : "";

  if (!keyword) {
    return <div>검색어가 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <main>
        <div className="searchSection">
          <SearchBar />
        </div>
        <CharacterCardContainer keyword={keyword} />
      </main>
    </div>
  );
};

export default SearchPage;
