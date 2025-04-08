import Image from 'next/image';
import { ArmorySkill } from '@/types/character';
import styles from './SkillTable.module.scss';
import { extractCoolTimeFromTooltip } from '@/services/skills/extractUtils';
import { extractTripodsFromTooltip } from '@/services/skills/extractUtils';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Gem } from '@/types/dto/gem';

type Props = {
  skills: ArmorySkill[];
  characterId: number;
};

const SkillTable = ({ skills, characterId }: Props) => {
  const [gems, setGems] = useState<Gem[]>([]);

  useEffect(() => {
    const fetchGems = async () => {
      const response = await axios.get(`/api/character/gem?characterId=${characterId}`);
      setGems(response.data.data);
    };

    fetchGems();
  }, []);

  return (
    <div className={styles.table}>
      {skills
        .filter(skill => skill.Level >= 4 || skill.SkillType > 0)
        .map((skill, idx) => {
          const tripods = extractTripodsFromTooltip(skill.Tooltip);
          const coolTime = extractCoolTimeFromTooltip(skill.Tooltip);

          const matchingGems = gems.filter(g => g.skill === skill.Name);

          return (
            <div key={idx} className={styles.row}>
              <div className={styles.skillIcon}>
                <Image src={skill.Icon} alt={skill.Name} width={40} height={40} />
              </div>
              <div className={styles.name}>{skill.Name}</div>
              <div className={styles.tripods}>
                {tripods.map((tripod, i) =>
                  tripod.name ? (
                    <div key={i} className={styles.tripod} data-grade={tripod.isTierMax}>
                      <Image src={tripod.icon} alt={tripod.name} width={30} height={30} />
                      <div className={styles.grade}>{`${tripod.tier}`}</div>
                      <div>{tripod.name}</div>
                    </div>
                  ) : null
                )}
              </div>

              <div className={styles.gemsAndRunes}>
                {skill.Rune && (
                  <div className={styles.rune} data-grade={skill.Rune.Grade}>
                    <Image src={skill.Rune.Icon} alt={skill.Rune.Name} width={30} height={30} />
                    <div>{`${skill.Rune.Grade} ${skill.Rune.Name}`}</div>
                  </div>
                )}
                {matchingGems.length > 0 && (
                  <div className={styles.gemContainer}>
                    {matchingGems.map((g, i) => (
                      <div key={i} className={styles.gem} data-grade={g.grade}>
                        <Image src={g.icon} alt={g.name} width={30} height={30} />
                        <div className={styles.gemName}>
                          {g.name.replace(/의 보석/, '').replace(/\(귀속\)/, '')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.status}>
                <div>{skill.Level}</div>
                <div className={styles.tag}>레벨</div>
              </div>
              <div className={styles.status}>
                <div>{coolTime}</div>
                <div className={styles.tag}>쿨타임</div>
              </div>
              <div className={styles.status}>
                <div>TBD</div>
                <div className={styles.tag}>시전시간</div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default SkillTable;
