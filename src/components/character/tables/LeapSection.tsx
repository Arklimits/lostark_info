import styles from './ArkPassiveSection.module.scss';
import ArkPassiveIcon from './ArkPassiveIcon';
import { getArkPassiveDataByClass } from '@/data/arkpassive/arkpassiveData';
import { EvolutionDto } from '@/types/dto/evolution';
import leapData from '@/data/arkpassive/common/leapData';

const useLeapData = (evolution: EvolutionDto[], characterClass: string) => {
  const updatedCommonLeapData = leapData.map(item => {
    const matchingLeap = evolution?.find((e: any) => e.title === item.title);
    return {
      ...item,
      level: matchingLeap?.level || 0,
      isActive: matchingLeap?.level ? matchingLeap.level > 0 : false,
    };
  });

  const updatedLeapData = getArkPassiveDataByClass(characterClass)
    .filter((item: any) => item.name === '도약')
    .map((item: any) => {
      const matchingLeap = evolution?.find((e: any) => e.title === item.title);
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

const LeapSection = ({
  evolution,
  characterClass,
}: {
  evolution: EvolutionDto[];
  characterClass: string;
}) => {
  const groupedLeap = useLeapData(evolution, characterClass);

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

export default LeapSection;
