/**
 * Sticker category gating by progression
 */

import { StickerCategory, STICKER_LIBRARY } from './types';
import { loadStickerCollection } from './storage';
import { loadProgress } from '../storage';

/**
 * Get unlocked categories based on progression
 */
export function getUnlockedCategories(): Set<StickerCategory> {
  const progress = loadProgress();
  const collection = loadStickerCollection();
  const totalScore = progress?.totalScore || 0;
  const earnedCount = collection.earnedStickers.length;

  const unlocked = new Set<StickerCategory>(['animals', 'nature']); // Always unlocked

  // Unlock food at 50 points or 2 stickers earned
  if (totalScore >= 50 || earnedCount >= 2) {
    unlocked.add('food');
  }

  // Unlock sports at 100 points or 4 stickers earned
  if (totalScore >= 100 || earnedCount >= 4) {
    unlocked.add('sports');
  }

  // Unlock music at 150 points or 6 stickers earned
  if (totalScore >= 150 || earnedCount >= 6) {
    unlocked.add('music');
  }

  // Unlock art at 200 points or 8 stickers earned
  if (totalScore >= 200 || earnedCount >= 8) {
    unlocked.add('art');
  }

  // Unlock space at 250 points or 10 stickers earned
  if (totalScore >= 250 || earnedCount >= 10) {
    unlocked.add('space');
  }

  // Unlock celebration at 300 points or 12 stickers earned
  if (totalScore >= 300 || earnedCount >= 12) {
    unlocked.add('celebration');
  }

  return unlocked;
}

/**
 * Check if a sticker category is unlocked
 */
export function isCategoryUnlocked(category: StickerCategory): boolean {
  return getUnlockedCategories().has(category);
}

/**
 * Filter stickers by unlocked categories
 */
export function filterStickersByProgression(stickerIds: string[]): string[] {
  const unlocked = getUnlockedCategories();
  
  return stickerIds.filter(id => {
    const sticker = STICKER_LIBRARY[id];
    return sticker && unlocked.has(sticker.category);
  });
}

