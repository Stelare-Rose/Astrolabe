export const palette = [
  'strawberry', 'orange', 'lemon', 'leaf', 'mint', 'sky',
  'blueberry', 'grape', 'plum', 'lavender', 'lilac', 'pink',
] as const;

export type PaletteColor = (typeof palette)[number];

const fixed: Record<string, PaletteColor> = {
  Prototype: 'strawberry',
  MVP: 'orange',
  Stable: 'leaf',
  Ongoing: 'blueberry',
  Study: 'lavender',
};

function hash(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Palette name for a tag, e.g. "sky" */
export function tagColorName(tag: string): PaletteColor {
  const key = tag.trim();
  return fixed[key] ?? palette[hash(key.toLowerCase()) % palette.length];
}

/** CSS value for a tag, e.g. "var(--sky)" */
export function tagColor(tag: string): string {
  return `var(--${tagColorName(tag)})`;
}
