import SearchBar from '@/components/search/SearchBar';
import RecentSearchList from '@/components/search/RecentSearchList';
import BoardContainer from '@/containers/board/BoardContainer';
import InquiryButtons from '@/components/Inquiry/InquiryButtons';
export default function Home() {
  return (
    <>
      <main>
        <div className="logo">LOSTDAM</div>
        <div className="searchSection">
          <SearchBar />
          <div className="divLine" />
          <RecentSearchList />
        </div>
        <section className="boardSection">
          <BoardContainer />
        </section>
      </main>
      <footer>
        <InquiryButtons />
      </footer>
    </>
  );
}
