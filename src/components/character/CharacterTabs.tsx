import { useState } from 'react';
import StatTable from './tables/StatTable';
import styles from './CharacterTabs.module.scss';
import EquipmentTable from './tables/EquipmentTable';
import { CharacterData } from '@/types/character';

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
        return <div>딜링 정보</div>;
      case '스킬':
        return <div>스킬 정보</div>;
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
