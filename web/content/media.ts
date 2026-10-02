import { existsSync } from 'node:fs';
import path from 'node:path';
import manifest from './media.manifest.json';
import type { ToolIconName } from '@/components/ToolIcon';
import type { MessageKey } from './i18n';

export type MediaKind = 'product' | 'artwork';
export type MediaExtension = 'avif' | 'webp' | 'png';

export type MediaSlotDef = {
  id: string;
  width: number;
  height: number;
  aspectRatio: string;
  icon: ToolIconName;
  kind: MediaKind;
  master: string;
  altKey: MessageKey;
};

export const mediaSlots = manifest.slots as MediaSlotDef[];

export const mediaSlotsById: Record<string, MediaSlotDef> = Object.fromEntries(
  mediaSlots.map((slot) => [slot.id, slot]),
);

export function getMediaSlot(id: string): MediaSlotDef {
  const slot = mediaSlotsById[id];
  if (!slot) throw new Error(`Unknown media slot: ${id}`);
  return slot;
}

/** Public path for a generated variant of a slot. */
export function mediaVariant(id: string, ext: MediaExtension, scale: 1 | 2 = 1) {
  return `/media/${id}@${scale}x.${ext}`;
}

/**
 * Build-time check for whether the media pipeline generated variants for a
 * slot. Masters live outside the repo, so this is the only reliable signal.
 * `DESKUTILS_MEDIA_OUT` lets tests point at a temporary directory.
 */
export function hasGeneratedMedia(id: string, ext: MediaExtension = 'avif'): boolean {
  const dir = process.env.DESKUTILS_MEDIA_OUT
    ? path.resolve(process.env.DESKUTILS_MEDIA_OUT)
    : path.join(process.cwd(), 'public', 'media');
  return existsSync(path.join(dir, `${id}@1x.${ext}`));
}
