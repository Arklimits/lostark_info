import Image from 'next/image';
import { ArmoryEquipment } from '@/types/character';
import styles from './EquipmentTable.module.scss';

interface Props {
  equipment: ArmoryEquipment[];
}

export default function EquipmentTable({ equipment }: Props) {
  return (
    <div className={styles.container}>
      {equipment.map((item, index) => (
        <div key={index} className={styles.row} data-grade={item.Grade}>
          <div className={styles.type}>{item.Type}</div>
          <div className={styles.icon}>
            <Image width="32" height="32" src={item.Icon} alt={item.Name} />
          </div>
          <div className={styles.name}>{item.Name}</div>
        </div>
      ))}
    </div>
  );
}
