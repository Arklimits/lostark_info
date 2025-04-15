export function extractRefinementLevel(tooltip: string): number | null {
  const match = tooltip.match(/\[상급 재련\]<\/FONT> <FONT COLOR='#FFD200'>(\d+)<\/FONT>단계/);

  return match ? parseInt(match[1], 10) : null;
}

export function extractTranscendenceLevel(tooltip: string): number | null {
  const match = tooltip.match(/\[초월\][\s\S]*?<FONT COLOR='#FFD200'>(\d+)<\/FONT>단계/);

  return match ? parseInt(match[1], 10) : null;
}

/**
 * Tooltip 문자열에서 엘릭서 효과 정보를 추출하여 가공된 문자열 배열로 반환합니다.
 *
 * 정규식 캡처 그룹 설명:
 * - match[1]: 효과가 적용되는 부위 (예: "공용", "투구")
 * - match[2]: 효과 이름 (예: "힘", "회심 (질서)")
 * - match[3]: 효과 레벨 (예: "5")
 *
 * @example
 * - ["[공용] 힘 Lv.5", "[투구] 회심 (질서) Lv.5"]
 */
export function extractElixirEffects(tooltip: string): string[] {
  const matches = [
    ...tooltip.matchAll(
      /<FONT color='#FFD200'>\[(.*?)\]<\/FONT>\s*(.*?)\s*<FONT color='#FFD200'>Lv\.(\d+)<\/FONT>/g
    ),
  ];

  return matches.map(match => `[${match[1]}] ${match[2]} Lv.${match[3]}`);
}

/**
 * Tooltip 문자열에서 연마 효과(추가 피해, 공격력 등)를 추출합니다.
 *
 * - HTML 태그 제거 후 옵션 목록만 반환
 */
export function extractAccessoryEffects(tooltip: string): string[] {
  const parsed: Record<string, any> = JSON.parse(tooltip);
  const raw: string | undefined = parsed?.Element_005?.value?.Element_001;

  if (!raw) return [];

  return raw
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0);
}

/**
 * 어빌리티 스톤에서 각인명과 레벨을 추출합니다.
 *
 * 예: "돌격대장 Lv.3", "공격속도 감소 Lv.0" 등의 배열 반환
 */
export function extractAbilityStoneEngravings(tooltip: string): string[] {
  const matches = [...tooltip.matchAll(/\[<FONT COLOR='[^']*'>(.*?)<\/FONT>.*?Lv\.(\d+)/g)];

  return matches.map(match => `${match[1]} Lv.${match[2]}`);
}

/**
 * 팔찌 Tooltip 문자열을 파싱하여 '신속', '치명', '특화' 스탯과 기타 효과를 분리합니다.
 *
 * - Tooltip 내 <BR> 또는 줄바꿈 기준으로 줄 단위 분리 후, 각 줄의 HTML 태그를 제거합니다.
 * - 줄 내용이 '신속', '치명', '특화' 중 하나로 시작하면 stats에 포함됩니다.
 * - 그 외 줄들은 effects에 포함되어 한 문장씩 유지됩니다.
 *
 * @param tooltip - 팔찌의 Tooltip(JSON 문자열 형식)
 * @returns 분리된 스탯(stat) 배열과 기타 효과(effect) 배열
 *
 * @example
 *   stats:   ["신속 +67", "치명 +71"]
 *   effects: ["치명타 피해가 6.8% 증가한다."]
 */
export function extractBraceletStatsAndEffects(tooltip: string): {
  stats: string[];
  effects: string[];
} {
  const parsed: Record<string, any> = JSON.parse(tooltip);
  const raw: string | undefined = parsed?.Element_004?.value?.Element_001;

  if (!raw) return { stats: [], effects: [] };

  const rawLines = raw
    .split(/<BR>|\\n|\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const cleanedLines = rawLines
    .map(line =>
      line
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    )
    .filter(line => line.length > 0);

  const statKeywords = ['신속 ', '치명 ', '특화 ', '제압 ', '인내 ', '숙련 '];
  const continueKeywords = ['공격이', '공격 적중 시 30초', '악마', '해당', '아군'];

  const stats: string[] = [];
  const effectLines: string[] = [];

  for (const line of cleanedLines) {
    if (statKeywords.some(keyword => line.startsWith(keyword))) {
      stats.push(line);
    } else if (
      continueKeywords.some(keyword => line.startsWith(keyword)) &&
      effectLines.length > 0
    ) {
      effectLines[effectLines.length - 1] += ' ' + line;
    } else {
      effectLines.push(line);
    }
  }

  const summarized = effectLines
    .map(convertBraceltEffect)
    .filter((line): line is string => line !== null);

  return {
    stats,
    effects: summarized,
  };
}

function convertBraceltEffect(line: string): string | null {
  if (line.includes('무기 공격력') && line.includes('30초') && line.includes('120초')) {
    const grade = line.includes('150') ? '상' : line.includes('140') ? '중' : '하';
    return `무공 에포형 ${grade}`;
  }

  if (line.includes('무기 공격력') && line.includes('자신의 생명력')) {
    const grade = line.includes('2400') ? '상' : line.includes('2200') ? '중' : '하';
    return `무공 안상형 ${grade}`;
  }

  if (line.includes('공격 적중 시 매 초마다')) {
    const grade = line.includes('1480') ? '상' : line.includes('1320') ? '중' : '하';
    return `무공+공이속 ${grade}`;
  }

  if (line.includes('헤드어택')) {
    const grade = line.includes('3.5') ? '상' : line.includes('3.0') ? '중' : '하';
    return `결투의 대가 ${grade}`;
  }

  if (line.includes('백어택')) {
    const grade = line.includes('3.5') ? '상' : line.includes('3.0') ? '중' : '하';
    return `기습의 대가 ${grade}`;
  }

  if (line.includes('치명타 적중률') && !line.includes('몬스터에게')) {
    const grade = line.includes('5.0') ? '상' : line.includes('4.2') ? '중' : '하';
    if (line.includes('공격이')) return `치확+회심 ${grade}`;
    return `치명타 확률 ${grade}`;
  }

  if (line.includes('치명타 피해') && !line.includes('몬스터에게')) {
    const grade = line.includes('10%') ? '상' : line.includes('8.4%') ? '중' : '하';
    if (line.includes('공격이')) return `치피+회심 ${grade}`;
    return `치명타 피해 ${grade}`;
  }

  if (line.includes('추가 피해')) {
    const grade = line.includes('4%') ? '상' : line.includes('3.5%') ? '중' : '하';
    if (line.includes('악마')) return `추피+악추피 ${grade}`;
    return `추가피해 ${grade}`;
  }

  if (line.includes('대상의 방어력')) {
    const grade = line.includes('2.5') ? '상' : line.includes('2.1') ? '중' : '하';
    return `비수 ${grade}`;
  }

  if (line.includes('치명타 저항력')) {
    const grade = line.includes('2.5') ? '상' : line.includes('2.1') ? '중' : '하';
    return `약점노출 ${grade}`;
  }

  if (line.includes('치명타 피해 저항')) {
    const grade = line.includes('4.8') ? '상' : line.includes('4.2') ? '중' : '하';
    return `상처약화 ${grade}`;
  }

  if (line.includes('파티 효과로 보호 효과')) {
    const grade = line.includes('1.5') ? '상' : line.includes('1.3') ? '중' : '하';
    return `응원 ${grade}`;
  }

  if (line.includes('보호 및 회복효과')) {
    const grade = line.includes('3.5') ? '상' : line.includes('3.3') ? '중' : '하';
    return `전문의 ${grade}`;
  }

  if (line.includes('아군 공격력 강화 효과')) {
    const grade = line.includes('6%') ? '상' : line.includes('5%') ? '중' : '하';
    return `아공강 ${grade}`;
  }

  if (line.includes('아군 피해량 강화 효과')) {
    const grade = line.includes('9%') ? '상' : line.includes('7.5') ? '중' : '하';
    return `아피강 ${grade}`;
  }

  // 적주피는 어쩔 수 없다
  if (line.includes('적에게 주는 피해')) {
    const grade = line.includes('3%') ? '상' : line.includes('2.5%') ? '중' : '하';
    if (line.includes('무력화 상태의 적')) return `적주피+제압 ${grade}`;
    return `적주피 ${grade}`;
  }

  return line; // 인식되지 않은 줄은 그대로 반환
}
