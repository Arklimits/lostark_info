import SearchPage from "@/components/search/SearchPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}
