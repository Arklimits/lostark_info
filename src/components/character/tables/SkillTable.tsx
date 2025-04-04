import Image from 'next/image';
import { ArmorySkill } from '@/types/character';
import styles from './SkillTable.module.scss';

interface ParsedTripod {
  name: string;
  icon: string;
  tier: string;
  isTierMax: boolean;
}

type Props = {
  skills: ArmorySkill[];
};

function stripHtml(input: string): string {
  return input
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function extractCoolTimeFromTooltip(tooltipRaw: string): number {
  const tooltip = JSON.parse(tooltipRaw);
  const raw = tooltip['Element_001']?.value?.leftText ?? '';
  const text = stripHtml(raw);

  const minuteMatch = text.match(/(\d+)\s*분/);
  const secondMatch = text.match(/(\d+)\s*초/);

  const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
  const seconds = secondMatch ? parseInt(secondMatch[1], 10) : 0;

  const totalSeconds = minutes * 60 + seconds;

  return totalSeconds;
}

function extractDamageTextFromTooltip(tooltipRaw: string): string {
  const tooltip = JSON.parse(tooltipRaw);
  const raw = tooltip['Element_005']?.value ?? '';

  return stripHtml(raw);
}

function extractTripodsFromTooltip(tooltipRaw: string): ParsedTripod[] {
  const tooltip = JSON.parse(tooltipRaw);

  const tripodElements = tooltip['Element_006']?.value;
  if (!tripodElements) return [];

  return Object.values(tripodElements).map((el: any) => ({
    name: stripHtml(el.name),
    icon: el.slotData?.iconPath || '/ico/ico-noImage.png',
    tier: stripHtml(el.tier).match(/\d+/)?.[0] ?? '-',
    isTierMax: stripHtml(el.tier).includes('최대') ? true : false,
  }));
}

const SkillTable = ({ skills }: Props) => {
  return (
    <div className={styles.table}>
      {skills
        .filter(skill => skill.Level >= 4 || skill.SkillType > 0)
        .map((skill, idx) => {
          const damages = extractDamageTextFromTooltip(skill.Tooltip);
          const tripods = extractTripodsFromTooltip(skill.Tooltip);
          const coolTime = extractCoolTimeFromTooltip(skill.Tooltip);

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

              <div className={styles.rune}>
                {skill.Rune && (
                  <>
                    <Image src={skill.Rune.Icon} alt={skill.Rune.Name} width={30} height={30} />
                    <div>{`${skill.Rune.Grade} ${skill.Rune.Name}`}</div>
                  </>
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
              {/* {damages && (
                <div className={styles.damage}>
                  <strong>스킬 설명:</strong> {damages}
                </div>
              )} */}
            </div>
          );
        })}
    </div>
  );
};

export default SkillTable;
