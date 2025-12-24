/**
 * Object-based counting question generator for Räkna mode
 * Focuses on visual counting, NOT addition
 */

import { Question } from '@/lib/types';
import { checkAnswer } from './generator';

/**
 * Get the fact string for counting questions
 */
export function getFactStringObject(question: Question): string {
  return `count_${question.answer}`;
}

type ObjectType = 'apples' | 'oranges' | 'stars' | 'fish' | 'horses' | 'octopuses';

const OBJECT_TYPES: ObjectType[] = ['apples', 'oranges', 'stars', 'fish', 'horses', 'octopuses'];
const OBJECT_EMOJIS: Record<ObjectType, string> = {
  apples: '🍎',
  oranges: '🍊',
  stars: '⭐',
  fish: '🐟',
  horses: '🐴',
  octopuses: '🐙',
};

const OBJECT_NAMES: Record<ObjectType, string> = {
  apples: 'äpplen',
  oranges: 'apelsiner',
  stars: 'stjärnor',
  fish: 'fiskar',
  horses: 'hästar',
  octopuses: 'bläckfiskar',
};

/**
 * Get max count based on difficulty level
 */
function getMaxCount(level: number): number {
  if (level <= 1) return 10;   // 1-10
  if (level <= 2) return 15;   // 1-15
  if (level <= 3) return 20;   // 1-20
  return 20;
}

/**
 * Generate weighted count based on level and progress
 * - "1" is rare (tutorial-level only, ~1% chance)
 * - Early (level 1): mostly 2-5
 * - Mid (level 2): mostly 5-12
 * - Later (level 3+): mostly 8-20
 */
function generateWeightedCount(level: number, roundNumber: number, totalScore: number): number {
  const maxCount = getMaxCount(level);
  
  // "1" is tutorial-level only (very rare)
  if (Math.random() < 0.01 && (totalScore < 10 && roundNumber === 1)) {
    return 1; // Only 1% chance, and only in first round with low score
  }
  
  if (level <= 1) {
    // Early: mostly 2-5
    const rand = Math.random();
    if (rand < 0.70) return Math.floor(Math.random() * 4) + 2; // 70% for 2-5
    if (rand < 0.90) return Math.floor(Math.random() * 3) + 6; // 20% for 6-8
    return Math.floor(Math.random() * 2) + 9; // 10% for 9-10
  } else if (level <= 2) {
    // Mid: mostly 5-12
    const rand = Math.random();
    if (rand < 0.75) return Math.floor(Math.random() * 8) + 5; // 75% for 5-12
    if (rand < 0.90) return Math.floor(Math.random() * 4) + 2; // 15% for 2-5
    return Math.floor(Math.random() * 3) + 13; // 10% for 13-15
  } else {
    // Later: mostly 8-20
    const rand = Math.random();
    if (rand < 0.75) return Math.floor(Math.random() * 13) + 8; // 75% for 8-20
    if (rand < 0.90) return Math.floor(Math.random() * 4) + 4; // 15% for 4-7
    return Math.floor(Math.random() * 3) + 2; // 10% for 2-4
  }
}

/**
 * Generate a counting question (NOT addition)
 */
export function generateObjectQuestion(
  level: number = 1,
  roundNumber: number = 1,
  totalScore: number = 0,
  recentCounts: number[] = []
): Question {
  const maxCount = getMaxCount(level);
  
  // Generate count with weighted distribution
  let answer = generateWeightedCount(level, roundNumber, totalScore);
  
  // Anti-boring rule: Do not repeat the same number within the last 3 questions
  let attempts = 0;
  while (recentCounts.includes(answer) && attempts < 15) {
    answer = generateWeightedCount(level, roundNumber, totalScore);
    attempts++;
  }
  
  // Ensure within bounds
  answer = Math.max(1, Math.min(maxCount, answer));
  
  const objectType = OBJECT_TYPES[Math.floor(Math.random() * OBJECT_TYPES.length)];
  const emoji = OBJECT_EMOJIS[objectType];
  const objectName = OBJECT_NAMES[objectType];
  
  // Question format: "Hur många <objekt>?" with emoji data
  const questionText = `Hur många ${objectName}?|${emoji}|${answer}`;
  
  // Generate wrong options (close distractors: ±1, ±2, but never negative)
  const options = new Set<number>([answer]);
  let optionAttempts = 0;
  const maxOptionAttempts = 50;
  
  // Try to get close distractors first
  const distractorOffsets = [-2, -1, 1, 2, 3, -3, 4, -4];
  for (const offset of distractorOffsets) {
    if (options.size >= 4) break;
    const wrongAnswer = answer + offset;
    if (wrongAnswer > 0 && wrongAnswer <= maxCount && wrongAnswer !== answer) {
      options.add(wrongAnswer);
    }
  }
  
  // Fill remaining slots with random numbers in range
  while (options.size < 4 && optionAttempts < maxOptionAttempts) {
    optionAttempts++;
    const randomAnswer = Math.floor(Math.random() * maxCount) + 1;
    if (randomAnswer !== answer && randomAnswer > 0 && randomAnswer <= maxCount) {
      options.add(randomAnswer);
    }
  }
  
  // Convert to array and shuffle
  const optionsArray = Array.from(options);
  for (let i = optionsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
  }

  const questionId = `${Date.now()}-${Math.random()}`;

  return {
    id: questionId,
    question: questionText,
    answer,
    options: optionsArray,
    level,
    type: 'math',
  };
}

/**
 * Generate a set of counting questions for a round
 */
export function generateObjectQuestionRound(
  level: number = 1,
  count: number = 10,
  roundNumber: number = 1,
  totalScore: number = 0
): Question[] {
  const questions: Question[] = [];
  const recentCounts: number[] = [];
  
  for (let i = 0; i < count; i++) {
    const question = generateObjectQuestion(level, roundNumber, totalScore, recentCounts);
    questions.push(question);
    
    // Track recent counts (last 3) to avoid repetition
    recentCounts.push(question.answer);
    if (recentCounts.length > 3) {
      recentCounts.shift();
    }
  }
  
  return questions;
}
