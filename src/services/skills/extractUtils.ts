import stripHtml from '@/utils/common/stripHtml';

interface ParsedTripod {
  name: string;
  icon: string;
  tier: number;
  isTierMax: boolean;
}

export function extractCoolTimeFromTooltip(tooltipRaw: string): number {
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

export function extractTripodsFromTooltip(tooltipRaw: string): ParsedTripod[] {
  const tooltip = JSON.parse(tooltipRaw);
  let tripodElements: [];

  if (tooltip['Element_006']?.type === 'TripodSkillCustom') {
    tripodElements = tooltip['Element_006'].value;
  } else if (tooltip['Element_005']?.type === 'TripodSkillCustom') {
    tripodElements = tooltip['Element_005']?.value;
  } else {
    return [];
  }

  return Object.values(tripodElements).map((el: any) => ({
    name: stripHtml(el.name),
    icon: el.slotData?.iconPath,
    tier: parseInt(stripHtml(el.tier).match(/\d+/)?.[0] ?? '0'),
    isTierMax: stripHtml(el.tier).includes('최대'),
  }));
}
