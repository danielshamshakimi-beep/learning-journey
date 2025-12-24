/**
 * Scoring system with streaks and multipliers
 */

export interface ScoreResult {
  points: number;
  streakBonus: number;
  multiplier: number;
  totalScore: number;
}

/**
 * Calculate score based on correct answer, streak, and speed
 */
export function calculateScore(
  correct: boolean,
  streak: number,
  speedBonus: number = 0 // 0-1, based on how fast they answered
): ScoreResult {
  if (!correct) {
    return {
      points: 0,
      streakBonus: 0,
      multiplier: 1,
      totalScore: 0,
    };
  }

  // Base points
  const basePoints = 10;
  
  // Streak multiplier (increases every 3 correct answers)
  const streakMultiplier = 1 + Math.floor(streak / 3) * 0.5; // 1x, 1.5x, 2x, 2.5x...
  const maxMultiplier = 3; // Cap at 3x
  const multiplier = Math.min(streakMultiplier, maxMultiplier);
  
  // Streak bonus (extra points for maintaining streak)
  const streakBonus = Math.min(streak * 2, 20); // Max 20 bonus points
  
  // Speed bonus (if answered quickly)
  const speedPoints = Math.floor(basePoints * speedBonus);
  
  const points = Math.floor(basePoints * multiplier);
  const totalScore = points + streakBonus + speedPoints;

  return {
    points,
    streakBonus,
    multiplier,
    totalScore,
  };
}

/**
 * Calculate stars rating for a round (1-3 stars)
 */
export function calculateStars(
  correctAnswers: number,
  totalQuestions: number,
  bestStreak: number
): number {
  const accuracy = correctAnswers / totalQuestions;
  
  if (accuracy >= 0.9 && bestStreak >= 5) {
    return 3; // Perfect or near-perfect with good streak
  } else if (accuracy >= 0.7 || bestStreak >= 3) {
    return 2; // Good performance
  } else if (accuracy >= 0.5) {
    return 1; // Passing
  }
  
  return 0; // Below passing
}

