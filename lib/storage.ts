/**
 * Versioned localStorage helpers for saving game progress
 */

import { GameProgress } from './types';

const STORAGE_KEY = 'kids-learning-game-profile';
const CURRENT_VERSION = 'v1';

/**
 * Default progress structure
 */
function createDefaultProgress(): GameProgress {
  return {
    version: CURRENT_VERSION,
    totalScore: 0,
    bestStreak: 0,
    lastPlayed: new Date().toISOString(),
    currentLevel: 1,
    statsByLevel: {},
    missedFacts: {},
    dailyChallenges: {},
    coins: 0,
  };
}

/**
 * Migrate old progress format to new versioned format
 */
function migrateOldProgress(oldData: any): GameProgress {
  const progress = createDefaultProgress();
  
  if (oldData) {
    // Migrate from old format if it exists
    if (oldData.score !== undefined) {
      progress.totalScore = oldData.score || 0;
    }
    if (oldData.bestScore !== undefined) {
      // Old format didn't have streak, so we'll use bestScore as a proxy
      progress.bestStreak = 0;
    }
    if (oldData.difficulty !== undefined) {
      progress.currentLevel = oldData.difficulty || 1;
    }
    if (oldData.lastPlayed) {
      progress.lastPlayed = oldData.lastPlayed;
    }
  }
  
  return progress;
}

/**
 * Load game progress from localStorage (with versioning)
 */
export function loadProgress(): GameProgress | null {
  if (typeof window === 'undefined') return null;
  
  try {
    // Try new versioned format first
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      
      // Check version and migrate if needed
      if (data.version === CURRENT_VERSION) {
        return data as GameProgress;
      } else {
        // Migrate old format
        return migrateOldProgress(data);
      }
    }
    
    // Try old format for backward compatibility
    const oldStored = localStorage.getItem('kids-learning-game-progress');
    if (oldStored) {
      const oldData = JSON.parse(oldStored);
      const migrated = migrateOldProgress(oldData);
      // Save in new format
      saveProgress(migrated);
      // Clean up old format
      localStorage.removeItem('kids-learning-game-progress');
      return migrated;
    }
  } catch (error) {
    console.error('Failed to load progress:', error);
  }
  
  return null;
}

/**
 * Save game progress to localStorage
 */
export function saveProgress(progress: Partial<GameProgress>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = loadProgress() || createDefaultProgress();
    
    const updated: GameProgress = {
      version: CURRENT_VERSION,
      totalScore: progress.totalScore ?? existing.totalScore,
      bestStreak: Math.max(progress.bestStreak ?? 0, existing.bestStreak),
      lastPlayed: new Date().toISOString(),
      currentLevel: progress.currentLevel ?? existing.currentLevel,
      statsByLevel: { ...existing.statsByLevel, ...(progress.statsByLevel || {}) },
      missedFacts: { ...existing.missedFacts, ...(progress.missedFacts || {}) },
      dailyChallenges: { ...existing.dailyChallenges, ...(progress.dailyChallenges || {}) },
      coins: progress.coins ?? existing.coins,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

/**
 * Update missed facts tracking
 */
export function updateMissedFact(fact: string): void {
  const progress = loadProgress() || createDefaultProgress();
  const currentCount = progress.missedFacts[fact] || 0;
  
  saveProgress({
    missedFacts: {
      ...progress.missedFacts,
      [fact]: currentCount + 1,
    },
  });
}

/**
 * Check if daily challenge is completed today
 */
export function isDailyChallengeComplete(): boolean {
  const progress = loadProgress();
  if (!progress) return false;
  
  const today = new Date().toISOString().split('T')[0];
  return progress.dailyChallenges[today] === true;
}

/**
 * Mark daily challenge as complete
 */
export function completeDailyChallenge(): void {
  const progress = loadProgress() || createDefaultProgress();
  const today = new Date().toISOString().split('T')[0];
  
  saveProgress({
    dailyChallenges: {
      ...progress.dailyChallenges,
      [today]: true,
    },
  });
}

/**
 * Clear all progress
 */
export function clearProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('kids-learning-game-progress'); // Clean up old format too
}

