import CharacterPage from "@/components/character/CharacterPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <CharacterPage />
    </Suspense>
  );
}