import Image from 'next/image';
import { ArmoryProfile } from '@/types/character';
import styles from './CharacterSummary.module.scss';

type Props = {
  profile: ArmoryProfile;
};

const CharacterSummary = ({ profile }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.leftSection}>
        <Image
          src={profile.CharacterImage}
          alt="캐릭터 이미지"
          className={styles.characterImage}
          width={240}
          height={320}
          unoptimized
        />
        <div className={styles.basicInfo}>
          <h2>{profile.CharacterName}</h2>
          <p>{profile.CharacterClassName}</p>
          <p>{profile.ServerName}</p>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.profileSummary}>
          <div className={styles.levels}>
            <span>Lv. {profile.CharacterLevel}</span>
            <span>아이템 레벨: {profile.ItemAvgLevel}</span>
            <span>원정대 Lv. {profile.ExpeditionLevel}</span>
            <span>PVP: {profile.PvpGradeName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSummary;
