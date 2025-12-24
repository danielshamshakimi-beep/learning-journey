'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnswerButtonProps {
  answer: number;
  onClick: () => void;
  isCorrect: boolean | null;
  disabled: boolean;
  wasWrong?: boolean; // If this answer was wrong earlier in the session
}

export default function AnswerButton({ answer, onClick, isCorrect, disabled, wasWrong = false }: AnswerButtonProps) {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (isCorrect !== null) {
      setAnimationKey(prev => prev + 1);
    }
  }, [isCorrect]);

  const getButtonStyle = () => {
    // If this answer was wrong earlier, grey it out permanently
    if (wasWrong) {
      return 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60';
    }
    if (disabled && isCorrect === null) {
      return 'bg-gray-50 text-gray-400 cursor-not-allowed';
    }
    if (isCorrect === true) {
      return 'bg-purple-600 text-white';
    }
    if (isCorrect === false) {
      return 'bg-gray-200 text-gray-400 opacity-60';
    }
    return 'bg-white text-purple-700 hover:bg-purple-50 active:bg-purple-100';
  };

  return (
    <motion.button
      key={animationKey}
      whileHover={!disabled && !wasWrong && isCorrect === null ? { scale: 1.03, y: -2 } : {}}
      whileTap={!disabled && !wasWrong ? { scale: 0.97 } : {}}
      animate={
        isCorrect === true
          ? {
              scale: [1, 1.08, 1],
              boxShadow: [
                '0 2px 8px rgba(0, 0, 0, 0.08)',
                '0 0 24px rgba(147, 51, 234, 0.3)',
                '0 2px 8px rgba(0, 0, 0, 0.08)',
              ],
              transition: { duration: 0.4, ease: 'easeOut' },
            }
          : isCorrect === false
          ? {
              opacity: [1, 0.5],
              scale: [1, 0.96],
              transition: { duration: 0.3 },
            }
          : {}
      }
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getButtonStyle()}
        min-h-[140px] min-w-[140px]
        rounded-3xl
        text-5xl font-bold
        shadow-sm
        transition-all duration-200
        p-6
      `}
      style={{ fontFamily: 'Comic Sans MS, cursive' }}
    >
      {answer}
    </motion.button>
  );
}
