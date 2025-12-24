'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ObjectQuestionCardProps {
  question: string; // Format: "Hur många äpplen?|🍎|5"
  className?: string;
  isCorrect?: boolean | null;
}

// Dice-like subitizing patterns for 1-5 (tight, recognizable)
// Using 3x3 grid positions (0-2 for both row and col)
const SUBITIZING_PATTERNS: Record<number, Array<{ row: number; col: number }>> = {
  1: [{ row: 1, col: 1 }], // Center of 3x3 grid
  2: [{ row: 1, col: 0 }, { row: 1, col: 2 }], // Horizontal pair (center row)
  3: [{ row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 2 }], // Triangle (top center, left, right)
  4: [{ row: 0, col: 0 }, { row: 0, col: 2 }, { row: 2, col: 0 }, { row: 2, col: 2 }], // Square (corners)
  5: [{ row: 0, col: 0 }, { row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }, { row: 2, col: 2 }], // Quincunx (dice-5: corners + center)
};

// Theme-based background colors (very subtle, low opacity) - OUTER container only
const THEME_BACKGROUNDS: Record<string, string> = {
  '🍎': 'rgba(239, 68, 68, 0.02)', // Apple - very light red
  '🍊': 'rgba(249, 115, 22, 0.02)', // Orange - very light orange
  '⭐': 'rgba(250, 204, 21, 0.02)', // Star - very light yellow
  '🐟': 'rgba(59, 130, 246, 0.02)', // Fish - very light blue
  '🐴': 'rgba(139, 92, 246, 0.02)', // Horse - very light purple
  '🐙': 'rgba(168, 85, 247, 0.02)', // Octopus - very light purple
};

/**
 * Generate grid positions for objects
 * - 1-5: Dice-like subitizing patterns in 3x3 grid
 * - 6-20: Regular grid (5 columns) for counting
 */
function generateGridPositions(count: number): Array<{ row: number; col: number }> {
  if (count <= 5 && SUBITIZING_PATTERNS[count]) {
    // Use dice patterns in 3x3 grid
    return SUBITIZING_PATTERNS[count];
  }

  // For 6-20: Use regular grid (5 columns)
  const positions: Array<{ row: number; col: number }> = [];
  const cols = 5;
  
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    positions.push({ row, col });
  }
  
  return positions;
}

export default function ObjectQuestionCard({ question, className = '', isCorrect = null }: ObjectQuestionCardProps) {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (isCorrect !== null) {
      setAnimationKey(prev => prev + 1);
    }
  }, [question, isCorrect]);

  // Parse question format: "Hur många äpplen?|🍎|5"
  const parts = question.split('|');
  const questionText = parts[0] || '';
  const emoji = parts[1] || '🍎';
  const count = parseInt(parts[2] || '0', 10);

  // Generate grid positions
  const gridPositions = generateGridPositions(count);
  
  // Determine grid layout
  const isSubitizing = count <= 5;
  const gridCols = isSubitizing ? 3 : 5;
  const gridRows = isSubitizing ? 3 : Math.ceil(count / 5);
  
  // Object size: Increased 5-10% (text-6xl to text-8xl)
  const objectSize = count <= 5 ? 'text-8xl' : count <= 10 ? 'text-7xl' : 'text-6xl';
  // Cell size: Larger to prevent clipping, with extra space for emojis
  const cellSize = count <= 5 ? 'h-32 w-32' : 'h-24 w-24';
  const gridGap = count <= 5 ? 'gap-2' : 'gap-3 md:gap-4'; // More space to prevent clipping
  
  // Padding: Extra padding to prevent clipping
  const cardPadding = count <= 5 ? 'p-6' : count <= 10 ? 'p-8' : 'p-10';
  
  // Get subtle theme-based background for OUTER container only
  const themeBackground = THEME_BACKGROUNDS[emoji] || 'rgba(0, 0, 0, 0.005)';

  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      {/* Counting Card - Visually dominant, taller, stronger border/shadow */}
      <motion.div
        key={animationKey}
        animate={
          isCorrect === true
            ? {
                scale: [1, 1.02, 1],
                transition: { duration: 0.4, ease: 'easeOut' },
              }
            : isCorrect === false
            ? {
                x: [0, -8, 8, -8, 8, 0],
                transition: { duration: 0.5, ease: 'easeInOut' },
              }
            : {}
        }
        className="relative w-full max-w-2xl"
      >
        {/* Counting card container - filled surface, soft shadow */}
        <div 
          className="relative w-full rounded-3xl bg-white"
          style={{
            minHeight: count <= 5 ? '280px' : count <= 10 ? '400px' : '480px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            overflow: 'visible', // Allow emojis to render fully
          }}
        >
          {/* Outer container with subtle theme (very low opacity) */}
          <div 
            className={`flex items-center justify-center h-full ${cardPadding}`}
            style={{
              backgroundColor: themeBackground,
            }}
          >
            {/* Inner object surface - FLAT, SOLID white background for objects */}
            <div 
              className="w-full h-full flex items-center justify-center rounded-2xl overflow-visible"
              style={{
                backgroundColor: '#ffffff', // Solid white - no transparency
              }}
            >
              <div 
                className={`grid ${gridGap} overflow-visible`}
                style={{
                  gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
                }}
              >
                {/* Render grid cells - each with solid white background */}
                {Array.from({ length: gridRows * gridCols }).map((_, index) => {
                  const row = Math.floor(index / gridCols);
                  const col = index % gridCols;
                  const hasObject = gridPositions.some(pos => pos.row === row && pos.col === col);
                  
                  return (
                    <div
                      key={index}
                      className={`${cellSize} flex items-center justify-center overflow-visible`}
                      style={{
                        backgroundColor: '#ffffff', // Solid white for each cell
                      }}
                    >
                      {hasObject && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ 
                            delay: gridPositions.findIndex(p => p.row === row && p.col === col) * 0.05,
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                          }}
                          className={`${objectSize} relative flex items-center justify-center`}
                          style={{
                            backgroundColor: '#ffffff', // Solid white behind emoji
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: '#ffffff', // Additional solid background
                              display: 'inline-block',
                              lineHeight: '1',
                            }}
                          >
                            {emoji}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
