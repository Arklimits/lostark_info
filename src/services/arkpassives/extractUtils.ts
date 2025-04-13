import { ArkPassiveDto } from '@/types/dto/arkPassive';

interface Effect {
  Name: string;
  Description: string;
  Icon: string;
  Tooltip: string;
}

function extractEffect(description: string): {
  title: string;
  level: number;
} {
  const match = description.match(/<FONT[^>]*>([^L]+)Lv\.(\d+)<\/FONT>/i);
  if (!match) return { title: '', level: 0 };

  const title = match[1].trim();
  const level = parseInt(match[2], 10);

  return { title, level };
}

export function parseArkPassive(effect: Effect): ArkPassiveDto {
  if (!effect) {
    return {
      name: 'null',
      title: 'null',
      icon: 'null',
      level: 0,
      isActive: false,
    };
  }

  const { title, level } = extractEffect(effect.Description);
  const isActive = level > 0;

  return {
    name: effect.Name,
    title,
    icon: effect.Icon,
    level,
    isActive,
  };
}
