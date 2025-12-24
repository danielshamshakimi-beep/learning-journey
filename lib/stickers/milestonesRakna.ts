/**
 * Milestone checking logic for Räkna mode (slower progression)
 */

import { GameState } from '../types';
import { MILESTONES } from './types';
import { hasMilestoneBeenReached, markMilestoneReached } from './storage';

export interface MilestoneCheckResult {
  milestoneId: string | null;
  milestone: typeof MILESTONES[string] | null;
}

/**
 * Check if any milestones have been reached in Räkna mode
 * Milestones unlock at 2x the points (slower progression)
 */
export function checkMilestonesRakna(
  state: GameState,
  previousState: GameState | null
): MilestoneCheckResult {
  if (!previousState) {
    return { milestoneId: null, milestone: null };
  }

  const totalScore = state.totalScore + state.score;
  const previousTotalScore = previousState.totalScore + previousState.score;

  // Check first round completed (same as Addition)
  if (state.roundNumber > 1 && previousState.roundNumber === 1) {
    if (!hasMilestoneBeenReached('first_round')) {
      markMilestoneReached('first_round');
      return {
        milestoneId: 'first_round',
        milestone: MILESTONES['first_round'],
      };
    }
  }

  // In Räkna mode, milestones unlock at 2x the points
  // Check 200 points milestone (equivalent to 100 in Addition)
  if (totalScore >= 200 && previousTotalScore < 200) {
    if (!hasMilestoneBeenReached('100_points')) {
      markMilestoneReached('100_points');
      return {
        milestoneId: '100_points',
        milestone: MILESTONES['100_points'],
      };
    }
  }

  // Check 400 points milestone (equivalent to 200 in Addition)
  if (totalScore >= 400 && previousTotalScore < 400) {
    if (!hasMilestoneBeenReached('200_points')) {
      markMilestoneReached('200_points');
      return {
        milestoneId: '200_points',
        milestone: MILESTONES['200_points'],
      };
    }
  }

  // Check 600 points milestone (equivalent to 300 in Addition)
  if (totalScore >= 600 && previousTotalScore < 600) {
    if (!hasMilestoneBeenReached('300_points')) {
      markMilestoneReached('300_points');
      return {
        milestoneId: '300_points',
        milestone: MILESTONES['300_points'],
      };
    }
  }

  // Streak milestones are less emphasized in Räkna, but still available
  // Check streak of 5 (same threshold)
  if (state.streak >= 5 && previousState.streak < 5) {
    if (!hasMilestoneBeenReached('streak_5')) {
      markMilestoneReached('streak_5');
      return {
        milestoneId: 'streak_5',
        milestone: MILESTONES['streak_5'],
      };
    }
  }

  // Check perfect round
  if (
    state.roundComplete &&
    state.hearts === 3 &&
    previousState.roundComplete === false
  ) {
    if (!hasMilestoneBeenReached('perfect_round')) {
      markMilestoneReached('perfect_round');
      return {
        milestoneId: 'perfect_round',
        milestone: MILESTONES['perfect_round'],
      };
    }
  }

  return { milestoneId: null, milestone: null };
}

