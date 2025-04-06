import { ArmoryProfile } from '@/types/character';
import styles from './StatTable.module.scss';
import EvolutionSection from './EvolutionSection';
import { EvolutionDto } from '@/types/dto/evolution';
import EnlightenmentSection from './EnlightenmentSection';
import LeapSection from './LeapSection';
type Props = {
  stats: ArmoryProfile['Stats'];
  tendencies: ArmoryProfile['Tendencies'];
  evolution: EvolutionDto[];
  characterClass: string;
};

const StatTable = ({ stats, tendencies, evolution, characterClass }: Props) => {
  return (
    <div className={styles.container}>
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

      <div className={styles.halfSectionContainer}>
        <div className={styles.halfSection}>
          <h3>진화</h3>
          <EvolutionSection evolution={evolution} />
        </div>

        <div className={styles.halfSection}>
          <h3>깨달음</h3>
          <EnlightenmentSection evolution={evolution} characterClass={characterClass} />
        </div>
      </div>

      <div className={styles.halfSectionContainer}>
        <div className={styles.halfSection}>
          <h3>도약</h3>
          <LeapSection evolution={evolution} characterClass={characterClass} />
        </div>
      </div>
    </div>
  );
};

export default StatTable;
