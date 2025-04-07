import styles from './ArkPassiveIcon.module.scss';
import Image from 'next/image';
type ArkPassiveIconProps = {
  title: string;
  icon: string;
  level: number;
  maxLevel: number;
  isActive: boolean;
};

const ArkPassiveIcon = ({ title, icon, level, maxLevel, isActive }: ArkPassiveIconProps) => {
  if (title === 'null') {
    return (
      <div className={styles.container}>
        <div className={styles.iconWrapper}></div>
      </div>
    );
  }

  return (
    <div className={styles.container} title={title}>
      <div className={styles.iconWrapper}>
        <Image
          alt={title}
          src={icon}
          className={`${styles.icon} ${!isActive ? styles.inactive : ''}`}
          width={40}
          height={40}
        />
      </div>
      <span className={styles.level}>
        {level} / {maxLevel}
      </span>
    </div>
  );
};

export default ArkPassiveIcon;
