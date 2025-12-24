import { Question } from '@/lib/types';

/**
 * Generate a random math question based on difficulty level
 */
export function generateMathQuestion(level: number): Question {
  let maxNumber: number;
  
  // Determine max number based on level
  if (level <= 1) {
    maxNumber = 5; // 1+1 to 5+5
  } else if (level <= 2) {
    maxNumber = 10; // 1+1 to 10+10
  } else if (level <= 3) {
    maxNumber = 15; // 5+5 to 15+15
  } else {
    maxNumber = 20; // 10+10 to 20+20
  }

  // Generate random numbers
  const num1 = Math.floor(Math.random() * maxNumber) + 1;
  const num2 = Math.floor(Math.random() * maxNumber) + 1;
  const answer = num1 + num2;

  // Generate wrong options (ensure they're different from answer and realistic)
  const options = new Set<number>([answer]);
  let attempts = 0;
  const maxAttempts = 50; // Prevent infinite loop
  
  while (options.size < 4 && attempts < maxAttempts) {
    attempts++;
    // Generate wrong answers that are close to the correct answer (more realistic for kids)
    const offset = Math.floor(Math.random() * 6) - 3; // -3 to +3
    const wrongAnswer = answer + offset;
    // Make sure wrong answer is positive and different
    if (wrongAnswer > 0 && wrongAnswer !== answer && !options.has(wrongAnswer)) {
      options.add(wrongAnswer);
    }
  }
  
  // Fallback: if we still don't have 4 options, fill with random numbers
  while (options.size < 4) {
    const randomAnswer = Math.floor(Math.random() * (answer * 2 + 10)) + 1;
    if (randomAnswer !== answer && randomAnswer > 0) {
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
    question: `${num1} + ${num2}`,
    answer,
    options: optionsArray,
    level,
    type: 'math',
  };
}

/**
 * Generate a set of questions for a round
 */
export function generateQuestionRound(level: number, count: number = 10): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    questions.push(generateMathQuestion(level));
  }
  return questions;
}

/**
 * Check if answer is correct
 */
export function checkAnswer(userAnswer: number, correctAnswer: number): boolean {
  return userAnswer === correctAnswer;
}

/**
 * Get the fact string for tracking (e.g., "7+8")
 */
export function getFactString(question: Question): string {
  if (question.type === 'math') {
    return question.question.replace(' = ?', '').trim();
  }
  return question.question;
}

