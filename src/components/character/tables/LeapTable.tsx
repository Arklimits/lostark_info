import styles from './ArkPassiveTable.module.scss';
import ArkPassiveIcon from './ArkPassiveIcon';
import { getArkPassiveDataByClass } from '@/data/arkpassive/arkpassiveData';
import { ArkPassiveDto } from '@/types/dto/arkPassive';
import leapData from '@/data/arkpassive/common/leapData';

const useLeapData = (arkPassive: ArkPassiveDto[], characterClass: string) => {
  const updatedCommonLeapData = leapData.map(item => {
    const matchingLeap = arkPassive?.find((e: any) => e.title === item.title);
    return {
      ...item,
      level: matchingLeap?.level || 0,
      isActive: matchingLeap?.level ? matchingLeap.level > 0 : false,
    };
  });

  const updatedLeapData = getArkPassiveDataByClass(characterClass)
    .filter((item: any) => item.name === '도약')
    .map((item: any) => {
      const matchingLeap = arkPassive?.find((e: any) => e.title === item.title);
      return {
        ...item,
        level: matchingLeap?.level || 0,
        isActive: matchingLeap?.level ? matchingLeap.level > 0 : false,
      };
    });

  const groupedLeap = [];

  for (let i = 0; i < updatedCommonLeapData.length; i += 6) {
    groupedLeap.push(updatedCommonLeapData.slice(i, i + 6));
  }

  for (let i = 0; i < updatedLeapData.length; i += 6) {
    groupedLeap.push(updatedLeapData.slice(i, i + 6));
  }

  return groupedLeap;
};

const LeapTable = ({
  arkPassive,
  characterClass,
}: {
  arkPassive: ArkPassiveDto[];
  characterClass: string;
}) => {
  const groupedLeap = useLeapData(arkPassive, characterClass);

  return (
    <div className={styles.container}>
      {groupedLeap.map((group, groupIndex) => (
        <div key={groupIndex} className={styles.gridContainer}>
          <div className={`${styles.grid} ${styles.evolution}`}>
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

export default LeapTable;
