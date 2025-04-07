import Image from 'next/image';
import { ArmoryProfile } from '@/types/character';
import styles from './CharacterSummary.module.scss';
import { useRouter } from 'next/navigation';
import ScoreTabs from './ScoreTabs';

type Props = {
  profile: ArmoryProfile;
};

const CharacterSummary = ({ profile }: Props) => {
  const router = useRouter();

  const handleExpeditionInfoClick = () => {
    router.push(`/search?keyword=${encodeURIComponent(profile.CharacterName)}`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftSection}>
        <div className={styles.header}>
          {profile.CharacterClassName} Lv. {profile.CharacterLevel}
        </div>
        <Image
          src={profile.CharacterImage}
          alt="캐릭터 이미지"
          className={styles.characterImage}
          width={240}
          height={320}
          unoptimized
        />
        <div className={styles.footer}>
          <p style={{ color: '#4dd' }}>{profile.GuildName}</p>
          <h2>{profile.CharacterName}</h2>
          <p>{profile.ServerName}</p>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.profileSummary}>
          <div className={styles.profileDisplay}>
            <div>
              <span>Lv. </span>
              <span className={styles.itemLevelValue}>{profile.ItemMaxLevel}</span>
            </div>
            <div className={styles.name}>{profile.CharacterName}</div>
            <div className={styles.expeditionInfo} onClick={handleExpeditionInfoClick}>
              <span>원정대 Lv.</span>
              <span className={styles.expeditionLevel}>{profile.ExpeditionLevel}</span>
              <span className={styles.Icon}></span>
            </div>
          </div>
          <div style={{ height: '130px' }}></div>
          <ScoreTabs data={10000} />
        </div>
      </div>
    </div>
  );
};

export default CharacterSummary;
