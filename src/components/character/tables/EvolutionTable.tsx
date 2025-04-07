import styles from './ArkPassiveTable.module.scss';
import ArkPassiveIcon from './ArkPassiveIcon';
import evolutionData from '@/data/arkpassive/common/evolutionData';
import { ArkPassiveDto } from '@/types/dto/arkPassive';

const useEvolutionData = (evolution: ArkPassiveDto[]) => {
  const updatedEvolutionData = evolutionData.map(item => {
    const matchingEvolution = evolution?.find((e: any) => e.title === item.title);
    return {
      ...item,
      level: matchingEvolution?.level || 0,
      isActive: matchingEvolution?.level ? matchingEvolution.level > 0 : false,
    };
  });

  const groupedEvolution = [];

  for (let i = 0; i < updatedEvolutionData.length; i += 6) {
    groupedEvolution.push(updatedEvolutionData.slice(i, i + 6));
  }

  return groupedEvolution;
};

const EvolutionTable = ({ evolution }: { evolution: ArkPassiveDto[] }) => {
  const groupedEvolution = useEvolutionData(evolution);

  return (
    <div className={styles.container}>
      {groupedEvolution.map((group, groupIndex) => (
        <div key={groupIndex} className={styles.gridContainer}>
          <div className={`${styles.grid} ${styles.evolution}`}>
            {group.map((item, index) => (
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

export default EvolutionTable;
