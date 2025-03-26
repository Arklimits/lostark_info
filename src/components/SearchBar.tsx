"use client";

import { useState } from "react";

import styles from "./SearchBar.module.scss";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = keyword.trim();
    if (!trimmed) return;

    try {
      const res = await fetch(`/api/search?keyword=${trimmed}`);

      const data = await res.json();
      console.log("검색 결과:", data);
    } catch (err) {
      console.error("검색 실패:", err);
    }
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <div style={{ width: "10px" }}></div>
      <input
        type="text"
        placeholder="캐릭터명"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button type="submit" aria-label="검색"></button>
    </form>
  );
};

export default SearchBar;
