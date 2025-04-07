import { useMemo, useState } from 'react';
import StatTable from './tables/StatTable';
import EquipmentTable from './tables/EquipmentTable';
import SkillTable from './tables/SkillTable';
import styles from './CharacterTabs.module.scss';
import { CharacterData, ArmoryGem } from '@/types/character';
import DealTable from './tables/DealTable';
import { Skill } from '@/types/character';
import { parseArkPassive } from '@/utils/parse/arkPassive';

interface Props {
  data: CharacterData;
  skills: Skill[];
  gem: ArmoryGem;
}

const CharacterTabs = ({ data, skills, gem }: Props) => {
  const evolution = useMemo(() => parseArkPassive(data.ArkPassive), [data.ArkPassive]);

  const tabContents = useMemo(
    () => ({
      특성: (
        <StatTable
          stats={data.ArmoryProfile.Stats}
          tendencies={data.ArmoryProfile.Tendencies}
          characterClass={data.ArmoryProfile.CharacterClassName}
          evolution={evolution}
          engraving={data.ArmoryEngraving}
        />
      ),
      장비: <EquipmentTable equipment={data.ArmoryEquipment} />,
      아바타: <div>미구현</div>,
      딜표: (
        <DealTable
          skills={skills}
          attackPower={data.ArmoryProfile.Stats[7].Value}
          engraving={data.ArmoryEngraving}
        />
      ),
      스킬: <SkillTable skills={data.ArmorySkills} gem={gem} />,
    }),
    [data, skills, gem, evolution]
  );

  const tabs = ['특성', '장비', '아바타', '딜표', '스킬'];
  const [activeTab, setActiveTab] = useState('특성');

  return (
    <>
      <div className={styles.tabList}>
        {tabs.map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>{tabContents[activeTab as keyof typeof tabContents]}</div>
    </>
  );
};

export default CharacterTabs;
