import Image from 'next/image';
import styles from './EquipmentContainer.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  characterId: number;
}

interface ProcessedEquipment {
  type: string;
  name: string;
  icon: string;
  grade: string;
  refinement: number;
  transcendence: number;
  slot_1: string;
  slot_2: string;
  slot_3: string;
  slot_4: string;
  slot_5: string;
}

export default function EquipmentContainer({ characterId }: Props) {
  const [processedEquipment, setProcessedEquipment] = useState<ProcessedEquipment[]>([]);

  useEffect(() => {
    const processEquipment = async () => {
      const response = await axios.get(`/api/character/equipment?characterId=${characterId}`);
      setProcessedEquipment(response.data[0]);
    };

    processEquipment();
  }, [characterId]);

  return (
    <div className={styles.container}>
      {processedEquipment.map((item, index) => {
        const isEquipment = ['투구', '상의', '하의', '장갑', '무기', '어깨'].includes(item.type);

        return (
          <div key={index} className={styles.row} data-grade={item.grade}>
            <div className={styles.type}>{item.type}</div>
            <div className={styles.iconHolder}>
              <Image
                className={styles.icon}
                width="40"
                height="40"
                src={item.icon || '/ico/ico-noImage.png'}
                alt={item.name}
              />
            </div>
            <div className={styles.name}>
              {item.name}
              {isEquipment && <span> +{item.refinement}</span>}
            </div>
            <div className={styles.slot12Holder}>
              <div className={styles.slot1}>{item.slot_1}</div>
              <div className={styles.slot2}>{item.slot_2}</div>
            </div>
            <div className={styles.slot345Holder}>
              <div className={styles.slot3}>{item.slot_3}</div>
              <div className={styles.slot4}>{item.slot_4}</div>
              <div className={styles.slot5}>{item.slot_5}</div>
            </div>
            {isEquipment && (
              <div className={styles.transcendenceHolder}>
                <Image
                  className={styles.transcendenceIcon}
                  width="20"
                  height="20"
                  src="https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/ico_tooltip_transcendence.png"
                  alt="초월 이미지"
                />
                {`${item.transcendence}단계`}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
