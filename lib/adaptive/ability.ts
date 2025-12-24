import { Question } from '@/lib/types';

/**
 * Adaptive difficulty management
 */

export interface AbilityTracker {
  level: number;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  recentAccuracy: number; // Last 5 questions accuracy
  recentAnswers: boolean[]; // Track last 5 answers
}

const MAX_RECENT_ANSWERS = 5;

/**
 * Initialize ability tracker
 */
export function createAbilityTracker(initialLevel: number = 1): AbilityTracker {
  return {
    level: initialLevel,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    recentAccuracy: 1.0,
    recentAnswers: [],
  };
}

/**
 * Update ability tracker after an answer
 */
export function updateAbilityTracker(
  tracker: AbilityTracker,
  isCorrect: boolean
): AbilityTracker {
  const newRecentAnswers = [...tracker.recentAnswers, isCorrect].slice(-MAX_RECENT_ANSWERS);
  const recentAccuracy = newRecentAnswers.filter(a => a).length / newRecentAnswers.length;

  let newLevel = tracker.level;
  let consecutiveCorrect = tracker.consecutiveCorrect;
  let consecutiveWrong = tracker.consecutiveWrong;

  if (isCorrect) {
    consecutiveCorrect = tracker.consecutiveCorrect + 1;
    consecutiveWrong = 0;
    
    // Step up: if answering fast + correct repeatedly
    // (For now, step up after 5 correct in a row at current level)
    if (consecutiveCorrect >= 5 && newLevel < 4) {
      newLevel = Math.min(newLevel + 1, 4);
      consecutiveCorrect = 0; // Reset after leveling up
    }
  } else {
    consecutiveWrong = tracker.consecutiveWrong + 1;
    consecutiveCorrect = 0;
    
    // Step down: if missing 2+ questions at current level
    if (consecutiveWrong >= 2 && newLevel > 1) {
      newLevel = Math.max(newLevel - 1, 1);
      consecutiveWrong = 0; // Reset after stepping down
    }
  }

  return {
    level: newLevel,
    consecutiveCorrect,
    consecutiveWrong,
    recentAccuracy,
    recentAnswers: newRecentAnswers,
  };
}

/**
 * Get recommended difficulty level based on ability
 */
export function getRecommendedLevel(tracker: AbilityTracker): number {
  // Consider both recent accuracy and consecutive performance
  if (tracker.recentAccuracy >= 0.8 && tracker.consecutiveCorrect >= 3) {
    return Math.min(tracker.level + 1, 4);
  } else if (tracker.recentAccuracy < 0.4 || tracker.consecutiveWrong >= 2) {
    return Math.max(tracker.level - 1, 1);
  }
  
  return tracker.level;
}

