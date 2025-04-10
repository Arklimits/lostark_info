import { ArmoryProfile } from '@/types/character';
import styles from './StatTable.module.scss';
import EvolutionTable from './EvolutionTable';
import { ArkPassiveDto } from '@/types/dto/arkPassive';
import EnlightenmentTable from './EnlightenmentTable';
import LeapTable from './LeapTable';
import EngravingTable from './EngravingTable';

type Props = {
  stats: ArmoryProfile['Stats'];
  tendencies: ArmoryProfile['Tendencies'];
  evolution: ArkPassiveDto[];
  characterClass: string;
  engraving: any;
};

const StatTable = ({ stats, tendencies, evolution, characterClass, engraving }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.halfSectionContainer}>
        <div className={styles.halfSection}>
          <h3>각인</h3>
          <EngravingTable engraving={engraving} />
        </div>

        <div className={styles.halfSection}>
          <h3>진화</h3>
          <EvolutionTable evolution={evolution} />
        </div>
      </div>

      <div className={styles.halfSectionContainer}>
        <div className={styles.halfSection}>
          <h3>깨달음</h3>
          <EnlightenmentTable evolution={evolution} characterClass={characterClass} />
        </div>

        <div className={styles.halfSection}>
          <h3>도약</h3>
          <LeapTable evolution={evolution} characterClass={characterClass} />
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

export default StatTable;
