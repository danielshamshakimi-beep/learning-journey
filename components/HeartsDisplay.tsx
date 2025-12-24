'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface HeartsDisplayProps {
  hearts: number;
  maxHearts?: number;
}

export default function HeartsDisplay({ hearts, maxHearts = 3 }: HeartsDisplayProps) {
  const [previousHearts, setPreviousHearts] = useState(hearts);
  const [lostHeart, setLostHeart] = useState(false);

  useEffect(() => {
    if (hearts < previousHearts) {
      setLostHeart(true);
      setTimeout(() => setLostHeart(false), 600);
    }
    setPreviousHearts(hearts);
  }, [hearts, previousHearts]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
        Hjärtan:
      </span>
      <div className="flex gap-1.5">
        {Array.from({ length: maxHearts }).map((_, index) => {
          const isFull = index < hearts;
          const justLost = lostHeart && index === hearts && hearts < previousHearts;
          
          return (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={
                justLost
                  ? {
                      scale: [1, 1.5, 0],
                      opacity: [1, 0.5, 0],
                      rotate: [0, 180],
                      transition: { duration: 0.6, ease: 'easeIn' },
                    }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
            >
              <AnimatePresence mode="wait">
                {isFull ? (
                  <motion.span
                    key="full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-3xl"
                  >
                    ❤️
                  </motion.span>
                ) : (
                  <motion.span
                    key="empty"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-3xl opacity-20"
                  >
                    🤍
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
