import styles from "./SearchBar.module.scss"

const SearchBar = () => {
  return (
    <div className={styles.searchBar}>
      <div style={{ width: "10px" }}></div>
      <input type="text" placeholder="캐릭터명" />
      <button></button>
    </div>
  );
};

export default SearchBar;
