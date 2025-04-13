import { ArmoryProfile, ArmoryEngraving } from '@/types/character';
import styles from './StatContainer.module.scss';
import { ArkPassiveDto } from '@/types/dto/arkPassive';
import EnlightenmentTable from '@/components/character/tables/EnlightenmentTable';
import EvolutionTable from '@/components/character/tables/EvolutionTable';
import LeapTable from '@/components/character/tables/LeapTable';
import EngravingTable from '@/components/character/tables/EngravingTable';
import { useEffect, useState } from 'react';
import axios from 'axios';

type Props = {
  characterId: number;
};

const StatContainer = ({ characterId }: Props) => {
  const [arkPassive, setArkPassive] = useState<ArkPassiveDto[]>([]);
  const [engraving, setEngraving] = useState<ArmoryEngraving['ArkPassiveEffects']>();
  const [status, setStatus] = useState<ArmoryProfile>();

  useEffect(() => {
    const fetchArkPassive = async () => {
      const response = await axios.get(`/api/character/arkpassive?characterId=${characterId}`);
      setArkPassive(response.data);
    };

    const fetchStatus = async () => {
      const response = await axios.get(`/api/character/status?characterId=${characterId}`);
      setStatus(response.data);
    };

    const fetchEngraving = async () => {
      const response = await axios.get(`/api/character/engraving?characterId=${characterId}`);
      setEngraving(response.data);
    };

    fetchArkPassive();
    fetchStatus();
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
          {status?.CharacterClassName && (
            <EnlightenmentTable
              arkPassive={arkPassive}
              characterClass={status?.CharacterClassName}
            />
          )}
        </div>

        <div className={styles.halfSection}>
          <h3>도약</h3>
          {status?.CharacterClassName && (
            <LeapTable arkPassive={arkPassive} characterClass={status?.CharacterClassName} />
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h3>전투 특성</h3>
        <div className={styles.grid}>
          {status?.Stats?.map(stat => (
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
          {status?.Tendencies?.map(tendency => (
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
