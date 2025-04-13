import Image from 'next/image';
import styles from './SkillContainer.module.scss';
import { ArmoryEngraving, Skill } from '@/types/character';
import calculateCriticalDamage from '@/utils/calculate/criticalDamage';
import parseEngraving from '@/utils/parse/engraving';

type Props = {
  characterId: number;
};

const DealContainer = ({ characterId }: Props) => {
  // const {
  //   attackBonus: engAttackBonus,
  //   damageBonus: engDamageBonus,
  //   critRate: engCritRateBonus,
  //   critDamageBonus: engCritDamageBonus,
  // } = engraving
  //   ? parseEngraving(engraving)
  //   : {
  //       attackBonus: 0,
  //       damageBonus: 0,
  //       critRate: 0,
  //       critDamageBonus: 0,
  //     };

  //   return (
  //     <div className={styles.table}>
  //       {skills
  //         .filter(skill => skill.Level >= 4 || skill.SkillType > 0)
  //         .map((skill, idx) => (
  //           <div key={idx} className={styles.row}>
  //             <div className={styles.skillIcon}>
  //               <Image src={skill.Icon} alt={skill.Name} width={40} height={40} />
  //             </div>
  //             <div className={styles.name}>{skill.Name}</div>
  //             <div className={styles.damage}>
  //               {calculateCriticalDamage({
  //                 motionCoefficient: skill.coefficient,
  //                 attackPower: attackPower * engAttackBonus,
  //                 motionConstant: skill.constant,
  //                 extraDamage: 1.3281,
  //                 damageIncrease: engDamageBonus,
  //                 damageTakenIncrease: 0.8056,
  //                 criticalDamageIncrease: 2.58 + engCritDamageBonus,
  //                 criticalHitDamageMultiplier: 1.153852,
  //               }).toFixed(0)}
  //               TBD
  //             </div>
  //           </div>
  //         ))}
  //     </div>
  //   );

  return <div>비활성화</div>;
};

export default DealContainer;
