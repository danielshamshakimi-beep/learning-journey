'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  score: number;
  difficulty: number;
  currentQuestion: number;
  totalQuestions: number;
  tries?: number;
}

export default function ProgressBar({ score, difficulty, currentQuestion, totalQuestions, tries }: ProgressBarProps) {
  const progress = (currentQuestion / totalQuestions) * 100;
  const isNearEnd = currentQuestion >= 8;

  return (
    <div className="flex flex-col items-center gap-2 mb-6 w-full max-w-md">
      <div className="text-xl font-semibold text-gray-700" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
        Poäng: <span className="text-yellow-600">{score}</span> ⭐
      </div>
      
      <div className="w-full">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            Fråga {currentQuestion} / {totalQuestions}
          </span>
          <span className="text-sm text-gray-500">
            Nivå {difficulty}
          </span>
        </div>
        <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              isNearEnd
                ? 'bg-yellow-500'
                : 'bg-purple-500'
            }`}
          />
          {isNearEnd && (
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-white opacity-30"
            />
          )}
        </div>
      </div>
    </div>
  );
}
