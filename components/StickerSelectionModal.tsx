'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { StickerMilestone, STICKER_LIBRARY } from '@/lib/stickers/types';
import { addEarnedSticker, getCurrentBoard, placeStickerOnBoard, createNewBoardIfNeeded } from '@/lib/stickers/storage';
import { filterStickersByProgression } from '@/lib/stickers/progression';

interface StickerSelectionModalProps {
  milestone: StickerMilestone;
  onSelect: (stickerId: string) => void;
}

export default function StickerSelectionModal({ milestone, onSelect }: StickerSelectionModalProps) {
  const router = useRouter();
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  const handleStickerSelect = (stickerId: string) => {
    addEarnedSticker(stickerId);
    setSelectedStickerId(stickerId);
    
    // Try to automatically place on board
    createNewBoardIfNeeded();
    const board = getCurrentBoard();
    
    // Find first empty slot
    let placed = false;
    for (let row = 0; row < board.height && !placed; row++) {
      for (let col = 0; col < board.width && !placed; col++) {
        if (board.grid[row][col] === null) {
          if (placeStickerOnBoard(stickerId, board.id - 1, row, col)) {
            placed = true;
          }
        }
      }
    }
  };

  const handleViewBoard = () => {
    onSelect(selectedStickerId || '');
    router.push('/stickers');
  };

  const handleContinue = () => {
    onSelect(selectedStickerId || '');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <h2 className="text-3xl font-bold text-purple-600 mb-2" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            Du gjorde något bra! 🎉
          </h2>
          <p className="text-xl font-semibold text-purple-600 mb-4" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            Välj en klistermärke!
          </p>
          
          {!selectedStickerId ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {filterStickersByProgression(milestone.stickerOptions).map((stickerId) => {
                  const sticker = STICKER_LIBRARY[stickerId];
                  if (!sticker) return null;
                  
                  return (
                    <motion.button
                      key={stickerId}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStickerSelect(stickerId)}
                      className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all"
                    >
                      <div className="text-6xl mb-2">{sticker.emoji}</div>
                      <div className="text-lg font-bold text-purple-700" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                        {sticker.name}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-6"
              >
                <div className="text-8xl mb-4">
                  {STICKER_LIBRARY[selectedStickerId]?.emoji}
                </div>
                <p className="text-2xl font-bold text-purple-600 mb-2" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  {STICKER_LIBRARY[selectedStickerId]?.name} vald! 🎉
                </p>
                <p className="text-lg text-gray-600">
                  Klistermärket har placerats på din prestationstavla!
                </p>
              </motion.div>
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewBoard}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold py-4 rounded-2xl shadow-lg"
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}
                >
                  Se Prestationstavlan 🎨
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleContinue}
                  className="bg-blue-500 text-white text-xl font-bold py-4 rounded-2xl shadow-lg"
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}
                >
                  Fortsätt Spela
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

