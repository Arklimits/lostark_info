import Image from 'next/image';
import { ArmorySkill } from '@/types/character';
import styles from './SkillContainer.module.scss';
import { useEffect, useState } from 'react';
import { Gem } from '@/types/dto/gem';

type Props = {
  characterId: number;
};

const SkillContainer = ({ characterId }: Props) => {
  const [gems, setGems] = useState<Gem[]>([]);
  const [skills, setSkills] = useState<ArmorySkill[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [skillsRes, gemsRes] = await Promise.all([
        fetch(`/api/character/skill?characterId=${characterId}`),
        fetch(`/api/character/gem?characterId=${characterId}`),
      ]);

      const skillsData = await skillsRes.json();
      const gemsData = await gemsRes.json();

      setSkills(skillsData.data);
      setGems(gemsData.data);
    };

    fetchData();
  }, [characterId]);

  return (
    <div className={styles.table}>
      {skills
        .filter(skill => skill.Level >= 4 || skill.SkillType > 0)
        .map((skill, idx) => {
          const matchingGems = gems.filter(g => g.skill === skill.Name);

          return (
            <div key={idx} className={styles.row}>
              <div className={styles.skillIcon}>
                <Image src={skill.Icon} alt={skill.Name} width={40} height={40} />
              </div>
              <div className={styles.name}>{skill.Name}</div>
              <div className={styles.tripods}>
                {skill.Tripods.map((tripod, i) =>
                  tripod.Name ? (
                    <div key={i} className={styles.tripod} data-grade={tripod.IsTierMax}>
                      <Image src={tripod.Icon} alt={tripod.Name} width={30} height={30} />
                      <div className={styles.grade}>{`${tripod.Tier}`}</div>
                      <div>{tripod.Name}</div>
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
                <div>TBD</div>
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

export default SkillContainer;
