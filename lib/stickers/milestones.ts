/**
 * Milestone checking logic
 */

import { GameState } from '../types';
import { MILESTONES } from './types';
import { hasMilestoneBeenReached, markMilestoneReached } from './storage';
import { isDailyChallengeComplete } from '../storage';

export interface MilestoneCheckResult {
  milestoneId: string | null;
  milestone: typeof MILESTONES[string] | null;
}

/**
 * Check if any milestones have been reached based on current game state
 */
export function checkMilestones(
  state: GameState,
  previousState: GameState | null
): MilestoneCheckResult {
  if (!previousState) {
    return { milestoneId: null, milestone: null };
  }

  const totalScore = state.totalScore + state.score;
  const previousTotalScore = previousState.totalScore + previousState.score;

  // Check first round completed
  if (state.roundNumber > 1 && previousState.roundNumber === 1) {
    if (!hasMilestoneBeenReached('first_round')) {
      markMilestoneReached('first_round');
      return {
        milestoneId: 'first_round',
        milestone: MILESTONES['first_round'],
      };
    }
  }

  // Check 100 points milestone
  if (totalScore >= 100 && previousTotalScore < 100) {
    if (!hasMilestoneBeenReached('100_points')) {
      markMilestoneReached('100_points');
      return {
        milestoneId: '100_points',
        milestone: MILESTONES['100_points'],
      };
    }
  }

  // Check 200 points milestone
  if (totalScore >= 200 && previousTotalScore < 200) {
    if (!hasMilestoneBeenReached('200_points')) {
      markMilestoneReached('200_points');
      return {
        milestoneId: '200_points',
        milestone: MILESTONES['200_points'],
      };
    }
  }

  // Check 300 points milestone
  if (totalScore >= 300 && previousTotalScore < 300) {
    if (!hasMilestoneBeenReached('300_points')) {
      markMilestoneReached('300_points');
      return {
        milestoneId: '300_points',
        milestone: MILESTONES['300_points'],
      };
    }
  }

  // Check streak of 5
  if (state.streak >= 5 && previousState.streak < 5) {
    if (!hasMilestoneBeenReached('streak_5')) {
      markMilestoneReached('streak_5');
      return {
        milestoneId: 'streak_5',
        milestone: MILESTONES['streak_5'],
      };
    }
  }

  // Check perfect round (completed with all hearts)
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

  // Check daily challenge (this would need to be checked separately when daily challenge completes)
  // We'll handle this in the component that manages daily challenges

  return { milestoneId: null, milestone: null };
}

