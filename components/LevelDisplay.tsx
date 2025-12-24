'use client';

import { motion } from 'framer-motion';

interface LevelDisplayProps {
  currentLevel: number;
  onLevelSelect?: (level: number) => void;
  showProgress?: boolean;
}

const LEVELS = [
  { level: 1, name: 'Nivå 1', range: '1-5', color: 'from-green-400 to-green-600' },
  { level: 2, name: 'Nivå 2', range: '1-10', color: 'from-blue-400 to-blue-600' },
  { level: 3, name: 'Nivå 3', range: '1-15', color: 'from-purple-400 to-purple-600' },
  { level: 4, name: 'Nivå 4', range: '1-20', color: 'from-pink-400 to-pink-600' },
];

export default function LevelDisplay({ currentLevel, onLevelSelect, showProgress = false }: LevelDisplayProps) {
  return (
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-purple-600 mb-4 text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
        Välj Nivå
      </h3>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {LEVELS.map((level) => {
          const isCurrent = level.level === currentLevel;
          const isUnlocked = level.level <= currentLevel || level.level === 1;
          
          return (
            <motion.button
              key={level.level}
              whileHover={isUnlocked ? { scale: 1.05 } : {}}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
              onClick={() => isUnlocked && onLevelSelect && onLevelSelect(level.level)}
              disabled={!isUnlocked}
              className={`
                relative p-4 rounded-2xl font-bold text-white shadow-lg
                ${isCurrent 
                  ? `bg-gradient-to-br ${level.color} ring-4 ring-yellow-400` 
                  : isUnlocked
                    ? `bg-gradient-to-br ${level.color} opacity-80 hover:opacity-100`
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
              style={{ fontFamily: 'Comic Sans MS, cursive' }}
            >
              <div className="text-xl mb-1">{level.name}</div>
              <div className="text-sm opacity-90">{level.range}</div>
              {isCurrent && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 text-3xl"
                >
                  ⭐
                </motion.div>
              )}
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🔒</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

