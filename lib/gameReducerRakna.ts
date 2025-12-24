/**
 * Game state reducer for Räkna mode (object-based, slower pace)
 */

import { GameState, Question, RoundSummary } from './types';
import { checkAnswer } from './games/math/generator';
import { generateObjectQuestionRound } from './games/math/objectGenerator';
import { getFactStringObject } from './games/math/objectGenerator';
import { calculateScore } from './games/math/scoring';
import { updateMissedFact } from './storage';
import { loadProgress } from './storage';

export type GameAction =
  | { type: 'INIT_ROUND'; level: number }
  | { type: 'SELECT_ANSWER'; answer: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'RESET_ROUND' }
  | { type: 'SHOW_SUMMARY' }
  | { type: 'HIDE_SUMMARY' }
  | { type: 'LOAD_PROGRESS'; progress: Partial<GameState> };

const ROUND_SIZE = 10;
const MAX_HEARTS = 3;

export function createInitialStateRakna(level: number = 1, roundNumber: number = 1, totalScore: number = 0): GameState {
  const questions = generateObjectQuestionRound(level, ROUND_SIZE, roundNumber, totalScore);
  
  return {
    currentQuestion: questions[0],
    questionIndex: 0,
    selectedAnswer: null,
    isCorrect: null,
    roundNumber: 1,
    questionsInRound: questions,
    currentRoundIndex: 0,
    roundComplete: false,
    score: 0,
    totalScore: 0,
    streak: 0,
    bestStreak: 0,
    hearts: MAX_HEARTS,
    level,
    correctCount: 0,
    totalQuestions: 0,
    missedFacts: new Map(),
    showSummary: false,
    showConfetti: false,
    pendingMilestone: null,
    wrongAnswers: new Set<number>(),
  };
}

export function gameReducerRakna(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INIT_ROUND': {
      const level = action.level || state.level;
      const newRoundNumber = state.roundComplete ? state.roundNumber + 1 : state.roundNumber;
      const newTotalScore = state.totalScore + state.score;
      const questions = generateObjectQuestionRound(level, ROUND_SIZE, newRoundNumber, newTotalScore);
      const newState = createInitialStateRakna(level, newRoundNumber, newTotalScore);
      return {
        ...newState,
        roundNumber: newRoundNumber,
        totalScore: newTotalScore,
        bestStreak: state.bestStreak,
      };
    }

    case 'SELECT_ANSWER': {
      if (!state.currentQuestion || state.hearts === 0 || state.roundComplete) {
        return state;
      }

      // If this answer was already marked as wrong, don't process it again
      if (state.wrongAnswers.has(action.answer)) {
        return state;
      }

      const correct = checkAnswer(action.answer, state.currentQuestion.answer);
      // In Räkna mode, streaks don't give bonuses (still track for stats)
      const newStreak = correct ? state.streak + 1 : 0;
      const newBestStreak = Math.max(newStreak, state.bestStreak);
      
      // Calculate score (simpler, no streak multipliers in Räkna)
      const scoreResult = calculateScore(correct, 0); // No streak bonus
      const newScore = state.score + scoreResult.totalScore;
      
      // Update missed facts if wrong
      const newMissedFacts = new Map(state.missedFacts);
      if (!correct && state.currentQuestion) {
        const fact = getFactStringObject(state.currentQuestion);
        updateMissedFact(fact);
        const currentCount = newMissedFacts.get(fact) || 0;
        newMissedFacts.set(fact, currentCount + 1);
      }
      
      // Lose a heart if wrong
      const newHearts = correct ? state.hearts : Math.max(0, state.hearts - 1);
      
      // Track wrong answers to grey them out
      const newWrongAnswers = new Set(state.wrongAnswers);
      if (!correct) {
        newWrongAnswers.add(action.answer);
      }
      
      // Check if round is complete
      const isLastQuestion = state.currentRoundIndex >= state.questionsInRound.length - 1;
      const roundComplete = isLastQuestion || newHearts === 0;
      
      return {
        ...state,
        selectedAnswer: action.answer,
        isCorrect: correct,
        score: newScore,
        streak: newStreak,
        bestStreak: newBestStreak,
        hearts: newHearts,
        correctCount: correct ? state.correctCount + 1 : state.correctCount,
        totalQuestions: state.totalQuestions + 1,
        missedFacts: newMissedFacts,
        roundComplete,
        showConfetti: correct,
        wrongAnswers: newWrongAnswers,
      };
    }

    case 'NEXT_QUESTION': {
      if (state.roundComplete) {
        return { ...state, showSummary: true };
      }
      
      const nextIndex = state.currentRoundIndex + 1;
      if (nextIndex >= state.questionsInRound.length) {
        return { ...state, showSummary: true, roundComplete: true };
      }
      
      return {
        ...state,
        currentRoundIndex: nextIndex,
        currentQuestion: state.questionsInRound[nextIndex],
        selectedAnswer: null,
        isCorrect: null,
        showConfetti: false,
        wrongAnswers: new Set<number>(), // Reset wrong answers for new question
      };
    }

    case 'PREV_QUESTION': {
      if (state.currentRoundIndex === 0) {
        return state;
      }
      
      const prevIndex = state.currentRoundIndex - 1;
      return {
        ...state,
        currentRoundIndex: prevIndex,
        currentQuestion: state.questionsInRound[prevIndex],
        selectedAnswer: null,
        isCorrect: null,
        showConfetti: false,
      };
    }

    case 'RESET_ROUND': {
      return createInitialStateRakna();
    }

    case 'SHOW_SUMMARY': {
      return { ...state, showSummary: true };
    }

    case 'HIDE_SUMMARY': {
      return { ...state, showSummary: false };
    }

    case 'LOAD_PROGRESS': {
      return {
        ...state,
        ...action.progress,
      };
    }

    default:
      return state;
  }
}

/**
 * Calculate round summary for Räkna mode
 */
export function calculateRoundSummaryRakna(state: GameState, startTime: number): RoundSummary {
  const accuracy = state.totalQuestions > 0 
    ? state.correctCount / state.totalQuestions 
    : 0;
  
  const timeSpent = Math.floor((Date.now() - startTime) / 1000);
  
  // Calculate stars (more lenient for Räkna mode)
  let stars = 0;
  if (accuracy >= 0.8 && state.correctCount >= 8) stars = 3;
  else if (accuracy >= 0.6 || state.correctCount >= 6) stars = 2;
  else if (accuracy >= 0.4) stars = 1;
  
  return {
    roundNumber: state.roundNumber,
    correctAnswers: state.correctCount,
    totalQuestions: state.totalQuestions,
    accuracy,
    bestStreak: state.bestStreak,
    timeSpent,
    stars,
    scoreEarned: state.score,
  };
}

