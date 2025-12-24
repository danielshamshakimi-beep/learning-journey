/**
 * Shared types for the learning game
 */

export interface Question {
  id: string;
  question: string;
  answer: number;
  options: number[];
  level: number;
  type: 'math' | 'letters';
}

export interface AnswerOption {
  value: number | string;
  isCorrect: boolean;
  display: string;
}

export interface GameState {
  // Current question state
  currentQuestion: Question | null;
  questionIndex: number;
  selectedAnswer: number | null;
  isCorrect: boolean | null;
  
  // Round state
  roundNumber: number;
  questionsInRound: Question[];
  currentRoundIndex: number;
  roundComplete: boolean;
  
  // Game progression
  score: number;
  totalScore: number;
  streak: number;
  bestStreak: number;
  hearts: number; // 0-3 hearts per round
  level: number;
  
  // Statistics
  correctCount: number;
  totalQuestions: number;
  missedFacts: Map<string, number>; // Track which facts are missed (e.g., "7+8")
  
  // UI state
  showSummary: boolean;
  showConfetti: boolean;
  pendingMilestone: string | null; // Milestone ID that needs sticker selection
}

export interface RoundSummary {
  roundNumber: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  bestStreak: number;
  timeSpent: number; // in seconds
  stars: number; // 1-3 stars rating
  scoreEarned: number;
}

export interface GameProgress {
  version: string;
  totalScore: number;
  bestStreak: number;
  lastPlayed: string;
  currentLevel: number;
  statsByLevel: Record<number, {
    questionsAnswered: number;
    correctAnswers: number;
    averageTime: number;
  }>;
  missedFacts: Record<string, number>; // fact -> miss count
  dailyChallenges: Record<string, boolean>; // date -> completed
  coins: number; // For future rewards shop
}

