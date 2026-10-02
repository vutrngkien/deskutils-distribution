export type MediaSlotDef = {
  id: string;
  width: number;
  height: number;
  aspectRatio: string;
  icon: 'tools';
  kind: 'product';
  master: string;
  altKey: 'media.hero.alt';
};

export const getMediaSlot = (id: string): MediaSlotDef => ({
  id,
  width: 1200,
  height: 700,
  aspectRatio: '12 / 7',
  icon: 'tools',
  kind: 'product',
  master: 'hero.png',
  altKey: 'media.hero.alt',
});

export function hasGeneratedMedia() {
  return (globalThis as { __generatedMedia?: boolean }).__generatedMedia === true;
}

export function mediaVariant(id: string, ext: string, scale: 1 | 2 = 1) {
  return `/media/${id}@${scale}x.${ext}`;
}
