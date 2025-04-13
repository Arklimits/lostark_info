export function extractClassAndEffects(tooltipRaw: string) {
  const tooltip = JSON.parse(tooltipRaw);
  let raw = null;

  if (tooltip['Element_005']?.value === null) {
    raw = tooltip['Element_006']?.value;
  } else {
    raw = tooltip['Element_005']?.value;
  }

  const classMatch = raw.Element_001.match(/\[(.*?)\]/);
  const skillMatch = raw.Element_001.match(/<FONT COLOR='#FFD200'>(.*?)<\/FONT>/);

  return { class: classMatch?.[1], skill: skillMatch?.[1] };
}
