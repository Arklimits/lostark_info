import styles from './CharacterCard.module.scss';

type CharacterCardProps = {
  name: string;
  server: string;
  job: string;
  imageUrl: string;
  classLevel: number;
  guildName: string;
  itemLevel: string;
  stat2: string;
  stat3: string;
  score: string;
};

const CharacterCard = ({
  name,
  server,
  job,
  imageUrl,
  classLevel,
  guildName,
  itemLevel,
  score,
}: CharacterCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.job}>{job}</span>
        <span className={styles.level}>Lv.{classLevel}</span>
      </div>
      <div className={styles.server}>{server}</div>
      <img className={styles.avatar} src={imageUrl} alt={`${name} 이미지`} />
      <div className={styles.info}>
        <span className={styles.itemLevel}>{itemLevel}</span>
        <div className={styles.name}>{name}</div>
        <div className={styles.guild}>{guildName}</div>
        <div className={styles.score}>{score}</div>
      </div>
    </div>
  );
};

export default CharacterCard;
