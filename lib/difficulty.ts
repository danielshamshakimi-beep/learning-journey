import { generateMathQuestion, type MathQuestion } from './gameLogic';

export interface DifficultyConfig {
  level: number;
  name: string;
  maxNumber: number;
}

export const DIFFICULTY_LEVELS: DifficultyConfig[] = [
  { level: 1, name: 'Easy', maxNumber: 5 },
  { level: 2, name: 'Medium', maxNumber: 10 },
  { level: 3, name: 'Hard', maxNumber: 15 },
  { level: 4, name: 'Expert', maxNumber: 20 },
];

/**
 * Get difficulty level based on score
 */
export function getDifficultyLevel(score: number): number {
  if (score < 50) return 1;
  if (score < 100) return 2;
  if (score < 200) return 3;
  return 4;
}

/**
 * Check if difficulty should increase based on correct answers
 */
export function shouldIncreaseDifficulty(correctCount: number, currentLevel: number): boolean {
  // Increase after 5 correct answers in a row
  return correctCount >= 5 && currentLevel < DIFFICULTY_LEVELS.length;
}

/**
 * Get question pool for a specific level
 */
export function getQuestionPool(level: number, count: number = 10): MathQuestion[] {
  const questions: MathQuestion[] = [];
  for (let i = 0; i < count; i++) {
    questions.push(generateMathQuestion(level));
  }
  return questions;
}

