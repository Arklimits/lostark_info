'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './CharacterPage.module.scss';
import CharacterSummary from '@/components/character/CharacterSummary';
import CharacterTabs from '@/components/character/CharacterTabs';
import { CharacterData } from '@/types/character';
import { notFound } from 'next/navigation';

const CharacterPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<CharacterData>();
  const [error, setError] = useState(false);
  const name = searchParams.get('name')?.trim() ?? '';

  useEffect(() => {
    if (!name) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const decodedName = decodeURIComponent(name);
        const res = await axios.get('/api/character', {
          params: { name: decodedName },
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    fetchData();
  }, [name, router]);

  if (!name) return <div>메인화면으로 돌아갑니다.</div>;
  if (error) return notFound();
  if (!data) return <div>로딩 중...</div>;

  return (
    <>
      <div className={styles.summarySection}>
        <CharacterSummary characterId={data.characterId} />
      </div>
      <div>
        <CharacterTabs characterId={data.characterId} />
      </div>
    </>
  );
};

export default CharacterPage;
