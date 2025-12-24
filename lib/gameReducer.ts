/**
 * Game state reducer for managing game state with useReducer
 */

import { GameState, Question, RoundSummary } from './types';
import { generateQuestionRound, checkAnswer, getFactString } from './games/math/generator';
import { calculateScore } from './games/math/scoring';
import { updateAbilityTracker, createAbilityTracker } from './adaptive/ability';
import { updateMissedFact } from './storage';

export type GameAction =
  | { type: 'INIT_ROUND'; level: number }
  | { type: 'SELECT_ANSWER'; answer: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'RESET_ROUND' }
  | { type: 'SHOW_SUMMARY' }
  | { type: 'HIDE_SUMMARY' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'LOAD_PROGRESS'; progress: Partial<GameState> };

const ROUND_SIZE = 10;
const MAX_HEARTS = 3;

export function createInitialState(level: number = 1): GameState {
  const questions = generateQuestionRound(level, ROUND_SIZE);
  
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
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INIT_ROUND': {
      const questions = generateQuestionRound(action.level, ROUND_SIZE);
      const newRoundNumber = state.roundComplete ? state.roundNumber + 1 : state.roundNumber;
      return {
        ...createInitialState(action.level),
        roundNumber: newRoundNumber,
        totalScore: state.totalScore + state.score, // Add current round score to total
        bestStreak: state.bestStreak,
      };
    }

    case 'SELECT_ANSWER': {
      if (!state.currentQuestion || state.hearts === 0 || state.roundComplete) {
        return state;
      }

      const correct = checkAnswer(action.answer, state.currentQuestion.answer);
      const newStreak = correct ? state.streak + 1 : 0;
      const newBestStreak = Math.max(newStreak, state.bestStreak);
      
      // Calculate score
      const scoreResult = calculateScore(correct, state.streak);
      const newScore = state.score + scoreResult.totalScore;
      
      // Update missed facts if wrong (also update in storage)
      if (!correct && state.currentQuestion) {
        const fact = getFactString(state.currentQuestion);
        updateMissedFact(fact);
      }
      
      // Lose a heart if wrong
      const newHearts = correct ? state.hearts : Math.max(0, state.hearts - 1);
      
      // Check if round is complete (all questions answered or out of hearts)
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
        roundComplete,
        showConfetti: correct,
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
      return createInitialState(state.level);
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
 * Calculate round summary
 */
export function calculateRoundSummary(state: GameState, startTime: number): RoundSummary {
  const accuracy = state.totalQuestions > 0 
    ? state.correctCount / state.totalQuestions 
    : 0;
  
  const timeSpent = Math.floor((Date.now() - startTime) / 1000);
  
  // Calculate stars (simplified - can be enhanced)
  let stars = 0;
  if (accuracy >= 0.9 && state.bestStreak >= 5) stars = 3;
  else if (accuracy >= 0.7 || state.bestStreak >= 3) stars = 2;
  else if (accuracy >= 0.5) stars = 1;
  
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

