import { ArmoryProfile } from '@/types/character';
import styles from './CharacterSummary.module.scss';

type CharacterSummaryProps = {
  profile: ArmoryProfile;
};

const CharacterSummary = ({ profile }: CharacterSummaryProps) => {
  return (
    <div className={styles.container}>
      <img src={profile.CharacterImage} alt="캐릭터 이미지" className={styles.image} />
      <div className={styles.info}>
        <div className={styles.name}>{profile.CharacterName} ({profile.CharacterClassName})</div>
        <div className={styles.server}>{profile.ServerName} / Lv. {profile.CharacterLevel}</div>
        <div className={styles.levels}>
          <span>아이템 레벨: {profile.ItemAvgLevel}</span>
          <span>원정대 Lv. {profile.ExpeditionLevel}</span>
          <span>PVP: {profile.PvpGradeName}</span>
        </div>
        <div className={styles.stats}>
          <h4>전투 특성</h4>
          <ul>
            {profile.Stats.map((stat) => (
              <li key={stat.Type}>{stat.Type}: {stat.Value}</li>
            ))}
          </ul>
        </div>
        <div className={styles.tendencies}>
          <h4>성향</h4>
          <ul>
            {profile.Tendencies.map((tendency) => (
              <li key={tendency.Type}>
                {tendency.Type}: {tendency.Point} / {tendency.MaxPoint}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CharacterSummary;
