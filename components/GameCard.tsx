'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface GameCardProps {
  question: string;
  className?: string;
  isCorrect?: boolean | null;
}

export default function GameCard({ question, className = '', isCorrect = null }: GameCardProps) {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (isCorrect !== null) {
      setAnimationKey(prev => prev + 1);
    }
  }, [isCorrect]);

  return (
    <motion.div
      key={question}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
      className={`bg-white rounded-3xl shadow-sm p-10 text-center ${className}`}
    >
      <motion.div
        key={animationKey}
        animate={
          isCorrect === true
            ? {
                scale: [1, 1.05, 1],
                transition: { duration: 0.4, ease: 'easeOut' },
              }
            : isCorrect === false
            ? {
                x: [0, -8, 8, -8, 8, 0],
                transition: { duration: 0.5, ease: 'easeInOut' },
              }
            : {}
        }
      >
        <div className="text-8xl md:text-9xl font-bold text-purple-700 mb-4" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          {question}
        </div>
        <div className="text-5xl md:text-6xl text-gray-400">= ?</div>
      </motion.div>
    </motion.div>
  );
}
