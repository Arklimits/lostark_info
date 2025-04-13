import { useMemo, useState } from 'react';
import styles from './CharacterTabs.module.scss';
import { CharacterData } from '@/types/character';
import { Skill } from '@/types/character';
import StatContainer from '@/containers/character/detail/StatContainer';
import EquipmentContainer from '@/containers/character/detail/EquipmentContainer';
import SkillContainer from '@/containers/character/detail/SkillContainer';
import DealContainer from '@/containers/character/detail/DealContainer';
interface Props {
  characterId: number;
}

const CharacterTabs = ({ characterId }: Props) => {
  const tabContents = useMemo(
    () => ({
      특성: <StatContainer characterId={characterId} />,
      장비: <EquipmentContainer characterId={characterId} />,
      아바타: <div>미구현</div>,
      딜표: <DealContainer characterId={characterId} />,
      스킬: <SkillContainer characterId={characterId} />,
    }),
    [characterId]
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
