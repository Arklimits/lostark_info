import { useState } from 'react';
import StatTable from './tables/StatTable';
import EquipmentTable from './tables/EquipmentTable';
import SkillTable from './tables/SkillTable';
import styles from './CharacterTabs.module.scss';
import { CharacterData } from '@/types/character';
import DealTable from './tables/DealTable';

interface Props {
  data: CharacterData;
}

const CharacterTabs = ({ data }: Props) => {
  const [activeTab, setActiveTab] = useState('특성');

  const renderTabContent = () => {
    switch (activeTab) {
      case '특성':
        return (
          <StatTable stats={data.ArmoryProfile.Stats} tendencies={data.ArmoryProfile.Tendencies} />
        );
      case '장비':
        return <EquipmentTable equipment={data.ArmoryEquipment} />;
      case '아바타':
        return <div>미구현</div>;
      case '딜표':
        return <DealTable skills={data.ArmorySkills} />;
      case '스킬':
        return <SkillTable skills={data.ArmorySkills} />;
      default:
        return null;
    }
  };

  const tabs = ['특성', '장비', '아바타', '딜표', '스킬'];

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
      <div className={styles.tabContent}>{renderTabContent()}</div>
    </>
  );
};

export default CharacterTabs;
