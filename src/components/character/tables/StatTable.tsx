import { ArmoryProfile } from '@/types/character';
import styles from './StatTable.module.scss';

type Props = {
  stats: ArmoryProfile['Stats'];
  tendencies: ArmoryProfile['Tendencies'];
};

const StatTable = ({ stats, tendencies }: Props) => {
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
    </div>
  );
};

export default StatTable;
