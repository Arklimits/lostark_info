import { ArmoryProfile, ArmoryEngraving } from '@/types/character';
import styles from './StatContainer.module.scss';
import { ArkPassiveDto } from '@/types/dto/arkPassive';
import EnlightenmentTable from '@/components/character/tables/EnlightenmentTable';
import EvolutionTable from '@/components/character/tables/EvolutionTable';
import LeapTable from '@/components/character/tables/LeapTable';
import EngravingTable from '@/components/character/tables/EngravingTable';
import { useEffect, useState } from 'react';

type Props = {
  characterId: number;
  stats: ArmoryProfile['Stats'];
  tendencies: ArmoryProfile['Tendencies'];
  evolution: ArkPassiveDto[];
  characterClass: string;
  engraving: any;
};

const StatContainer = ({ characterId, stats, tendencies, characterClass }: Props) => {
  const [arkPassive, setArkPassive] = useState<ArkPassiveDto[]>([]);
  const [engraving, setEngraving] = useState<ArmoryEngraving>();
  const [profile, setProfile] = useState<ArmoryProfile>();

  useEffect(() => {
    const fetchArkPassive = async () => {
      const response = await fetch(`/api/character/arkpassive?characterId=${characterId}`);
      const data = await response.json();
      setArkPassive(data);
    };

    const fetchProfile = async () => {
      const response = await fetch(`/api/character/profile?characterId=${characterId}`);
      const data = await response.json();
      setProfile(data);
    };

    const fetchEngraving = async () => {
      const response = await fetch(`/api/character/engraving?characterId=${characterId}`);
      const data = await response.json();
      setEngraving(data);
    };

    fetchArkPassive();
    fetchProfile();
    fetchEngraving();
  }, [characterId]);

  return (
    <div className={styles.container}>
      <div className={styles.halfSectionContainer}>
        <div className={styles.halfSection}>
          <h3>각인</h3>
          {engraving && <EngravingTable engraving={engraving} />}
        </div>

        <div className={styles.halfSection}>
          <h3>진화</h3>
          <EvolutionTable arkPassive={arkPassive} />
        </div>
      </div>

      <div className={styles.halfSectionContainer}>
        <div className={styles.halfSection}>
          <h3>깨달음</h3>
          <EnlightenmentTable arkPassive={arkPassive} characterClass={characterClass} />
        </div>

        <div className={styles.halfSection}>
          <h3>도약</h3>
          <LeapTable arkPassive={arkPassive} characterClass={characterClass} />
        </div>
      </div>

      <div className={styles.section}>
        <h3>전투 특성</h3>
        <div className={styles.grid}>
          {stats.map(stat => (
            <div key={stat.Type} className={styles.row}>
              <span className={styles.label}>{stat.Type}</span>
              <span className={styles.value}>{stat.Value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3>성향</h3>
        <div className={styles.grid}>
          {tendencies.map(tendency => (
            <div key={tendency.Type} className={styles.row}>
              <span className={styles.label}>{tendency.Type}</span>
              <span className={styles.value}>
                {tendency.Point} / {tendency.MaxPoint}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatContainer;
