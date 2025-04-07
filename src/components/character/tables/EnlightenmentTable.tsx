import styles from './ArkPassiveTable.module.scss';
import ArkPassiveIcon from './ArkPassiveIcon';
import { getArkPassiveDataByClass } from '@/data/arkpassive/arkpassiveData';
import { ArkPassiveDto } from '@/types/dto/arkPassive';

const useEnlightenmentData = (evolution: ArkPassiveDto[], characterClass: string) => {
  const updatedEnlightenmentData = getArkPassiveDataByClass(characterClass)
    .filter((item: any) => item.name === '깨달음')
    .map((item: any) => {
      const matchingEnlightenment = evolution?.find((e: any) => e.title === item.title);
      return {
        ...item,
        level: matchingEnlightenment?.level || 0,
        isActive: matchingEnlightenment?.level ? matchingEnlightenment.level > 0 : false,
      };
    });

  const groupedEnlightenment = [];

  for (let i = 0; i < updatedEnlightenmentData.length; i += 4) {
    groupedEnlightenment.push(updatedEnlightenmentData.slice(i, i + 4));
  }

  return groupedEnlightenment;
};

const EnlightenmentTable = ({
  evolution,
  characterClass,
}: {
  evolution: ArkPassiveDto[];
  characterClass: string;
}) => {
  const groupedEnlightenment = useEnlightenmentData(evolution, characterClass);

  return (
    <div className={styles.container}>
      {groupedEnlightenment.map((group, groupIndex) => (
        <div key={groupIndex} className={styles.gridContainer}>
          <div className={`${styles.grid} ${styles.enlightenment}`}>
            {group.map((item: any, index: number) => (
              <ArkPassiveIcon
                key={index}
                title={item.title}
                icon={item.icon}
                level={item.level}
                maxLevel={item.maxLevel}
                isActive={item.isActive}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnlightenmentTable;
