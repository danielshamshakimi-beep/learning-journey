'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { StickerBoard as BoardType, STICKER_LIBRARY, MILESTONES } from '@/lib/stickers/types';
import {
  loadStickerCollection,
  placeStickerOnBoard,
  moveStickerOnBoard,
  removeStickerFromBoard,
  getCurrentBoard,
  createNewBoardIfNeeded,
} from '@/lib/stickers/storage';
import { loadProgress } from '@/lib/storage';
import { getUnlockedCategories } from '@/lib/stickers/progression';
import StickerPlacementEffect from './StickerPlacementEffect';

export default function StickerBoardComponent() {
  const [board, setBoard] = useState<BoardType | null>(null);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [draggingFrom, setDraggingFrom] = useState<{ row: number; col: number } | null>(null);
  const [collection, setCollection] = useState(loadStickerCollection());
  const [placingSticker, setPlacingSticker] = useState<{ row: number; col: number } | null>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Set<string>>(new Set());
  const previousStickersRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentBoard = getCurrentBoard();
    setBoard(currentBoard);
    const updatedCollection = loadStickerCollection();
    setCollection(updatedCollection);
    
    // Track newly unlocked stickers
    const currentStickers = new Set(updatedCollection.earnedStickers);
    const newStickers = new Set(
      Array.from(currentStickers).filter(id => !previousStickersRef.current.has(id))
    );
    setNewlyUnlocked(newStickers);
    previousStickersRef.current = currentStickers;
  }, []);

  const handleSlotClick = (row: number, col: number) => {
    if (!board) return;

    // If dragging a sticker from the board
    if (draggingFrom) {
      const fromRow = draggingFrom.row;
      const fromCol = draggingFrom.col;
      
      if (fromRow === row && fromCol === col) {
        // Clicked same slot, cancel drag
        setDraggingFrom(null);
        return;
      }
      
      // Move sticker
      if (moveStickerOnBoard(board.id - 1, fromRow, fromCol, row, col)) {
        const updatedBoard = getCurrentBoard();
        setBoard(updatedBoard);
        setDraggingFrom(null);
      }
      return;
    }

    // If placing a new sticker
    if (selectedSticker) {
      if (placeStickerOnBoard(selectedSticker, board.id - 1, row, col)) {
        // Trigger placement celebration
        setPlacingSticker({ row, col });
        const updatedBoard = getCurrentBoard();
        setBoard(updatedBoard);
        setSelectedSticker(null);
        setCollection(loadStickerCollection());
      }
      return;
    }

    // If clicking on an existing sticker, start dragging
    if (board.grid[row][col] !== null) {
      setDraggingFrom({ row, col });
    }
  };

  const handleStickerSelect = (stickerId: string) => {
    setSelectedSticker(stickerId);
    setDraggingFrom(null);
  };

  const handleRemoveSticker = (row: number, col: number) => {
    if (!board) return;
    if (removeStickerFromBoard(board.id - 1, row, col)) {
      const updatedBoard = getCurrentBoard();
      setBoard(updatedBoard);
      setCollection(loadStickerCollection());
    }
  };

  if (!board) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-4xl">Laddar...</div>
      </div>
    );
  }

  const unlockedCategories = getUnlockedCategories();
  const earnedStickers = collection.earnedStickers
    .map(id => STICKER_LIBRARY[id])
    .filter(Boolean)
    .filter(sticker => unlockedCategories.has(sticker.category));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4">
      {/* Dim overlay during sticker placement */}
      {placingSticker && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40 pointer-events-none"
        />
      )}
      
      <div className={`w-full max-w-4xl ${placingSticker ? 'pointer-events-none opacity-50' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-800 text-xl font-bold"
            style={{ fontFamily: 'Comic Sans MS, cursive' }}
          >
            ← Tillbaka
          </Link>
          <h1 className="text-5xl font-bold text-purple-600 text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            Din Tavla 🏆
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
        
        {/* Progress toward next sticker */}
        {(() => {
          const progress = loadProgress();
          if (!progress) return null;
          
          const totalScore = progress.totalScore || 0;
          let nextMilestone = 100;
          let milestoneName = '100 Poäng!';
          
          if (totalScore < 100) {
            nextMilestone = 100;
            milestoneName = '100 Poäng!';
          } else if (totalScore < 200) {
            nextMilestone = 200;
            milestoneName = '200 Poäng!';
          } else if (totalScore < 300) {
            nextMilestone = 300;
            milestoneName = '300 Poäng!';
          } else {
            return null;
          }
          
          const pointsNeeded = nextMilestone - totalScore;
          const progressPercent = Math.min(100, (totalScore / nextMilestone) * 100);
          
          return (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-3 mb-4"
            >
              <div className="flex items-center gap-2 justify-center">
                <span className="text-2xl">🎁</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-700 mb-1" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                    {pointsNeeded} poäng till nästa klistermärke ⭐
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}

        {/* Board Grid */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          <div className="grid grid-cols-4 gap-3">
            {board.grid.map((row, rowIndex) =>
              row.map((slot, colIndex) => {
                const isDraggingFrom = draggingFrom?.row === rowIndex && draggingFrom?.col === colIndex;
                const hasSticker = slot !== null;
                const sticker = hasSticker ? STICKER_LIBRARY[slot.stickerId] : null;
                const isSelected = selectedSticker !== null;

                const isPlacing = placingSticker?.row === rowIndex && placingSticker?.col === colIndex;
                
                return (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    whileHover={!hasSticker && isSelected ? { scale: 1.05 } : !hasSticker ? { scale: 1.02 } : {}}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSlotClick(rowIndex, colIndex)}
                    className={`
                      aspect-square rounded-2xl border-2 flex items-center justify-center relative overflow-hidden
                      ${hasSticker
                        ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 cursor-move'
                        : isSelected
                          ? 'bg-purple-50 border-purple-400 border-dashed cursor-pointer'
                          : 'bg-gray-50 border-gray-300 border-dashed cursor-pointer'
                      }
                      ${isDraggingFrom ? 'ring-4 ring-yellow-400' : ''}
                      ${!hasSticker && isSelected ? 'ring-2 ring-purple-300' : ''}
                    `}
                  >
                    {hasSticker && sticker ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <motion.div
                          key={`sticker-${rowIndex}-${colIndex}`}
                          initial={isPlacing ? { scale: 0.9 } : { scale: 0 }}
                          animate={isPlacing ? { 
                            scale: [0.9, 1.15, 1],
                            transition: { duration: 0.5, ease: 'easeOut' }
                          } : { scale: 1 }}
                          className="text-5xl relative z-10"
                        >
                          {sticker.emoji}
                        </motion.div>
                        {isPlacing && (
                          <StickerPlacementEffect
                            trigger={true}
                            onComplete={() => {
                              setPlacingSticker(null);
                            }}
                          />
                        )}
                        {isDraggingFrom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSticker(rowIndex, colIndex);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-20"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ) : (
                      <motion.div
                        animate={!hasSticker && !isSelected ? {
                          opacity: [0.4, 0.6, 0.4],
                        } : {}}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="flex flex-col items-center justify-center gap-1"
                      >
                        <div className="text-gray-400 text-xl">✨</div>
                        {isSelected && (
                          <div className="text-xs text-gray-500 font-semibold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                            Klicka här!
                          </div>
                        )}
                      </motion.div>
                    )}
                    {!hasSticker && isSelected && (
                      <motion.div
                        animate={{
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="absolute inset-0 bg-purple-200 rounded-2xl"
                      />
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Earned Stickers Collection */}
        {earnedStickers.length > 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              Dina Klistermärken
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {earnedStickers.map((sticker) => {
                const isSelected = selectedSticker === sticker.id;
                const isPlaced = board.grid.some(row =>
                  row.some(slot => slot?.stickerId === sticker.id)
                );
                const isNew = newlyUnlocked.has(sticker.id);
                // Determine if sticker is "special" (celebration category or certain milestones)
                const isSpecial = sticker.category === 'celebration' || 
                                 sticker.category === 'space' ||
                                 ['trophy', 'medal', 'party', 'confetti', 'rocket', 'planet'].includes(sticker.id);
                
                // Only animate if it's the selected one (single primary CTA)
                const shouldAnimate = isSelected || (isNew && !isPlaced && selectedSticker === null);

                return (
                  <motion.button
                    key={sticker.id}
                    initial={shouldAnimate && isNew ? { scale: 0, rotate: -180 } : {}}
                    animate={shouldAnimate && isNew ? { 
                      scale: [0, 1.2, 1],
                      rotate: [-180, 0],
                      transition: { duration: 0.6, ease: 'easeOut' }
                    } : isSelected ? {
                      scale: [1, 1.1, 1],
                      transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
                    } : {}}
                    whileHover={!isPlaced && !isSelected ? { scale: 1.05 } : {}}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStickerSelect(sticker.id)}
                    disabled={isPlaced}
                    className={`
                      aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 relative
                      ${isSelected
                        ? 'bg-purple-500 border-purple-600 ring-4 ring-yellow-400'
                        : isPlaced
                          ? 'bg-gray-200 border-gray-300 opacity-50 cursor-not-allowed'
                          : isSpecial
                            ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-400 hover:border-yellow-500'
                            : 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 hover:border-purple-500'
                      }
                      ${isNew && !isPlaced && !isSelected ? 'ring-2 ring-green-400' : ''}
                    `}
                  >
                    {isNew && !isPlaced && !isSelected && (
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        ✨
                      </div>
                    )}
                    {isSpecial && !isPlaced && (
                      <div className="absolute top-0.5 right-0.5 text-xs opacity-70">⭐</div>
                    )}
                    <div className="text-3xl mb-1">{sticker.emoji}</div>
                    <div className="text-xs font-bold text-purple-700 text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                      {sticker.name}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            {selectedSticker && (
              <p className="text-center text-purple-600 mt-4 font-semibold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                Klicka på en tom plats för att placera klistermärket!
              </p>
            )}
            {draggingFrom && (
              <p className="text-center text-purple-600 mt-4 font-semibold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                Klicka på en tom plats för att flytta klistermärket!
              </p>
            )}
          </div>
        )}

        {earnedStickers.length === 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <p className="text-2xl text-gray-600 mb-4">
              Du har inga klistermärken ännu! 🎯
            </p>
            <p className="text-lg text-gray-500">
              Spela spelet för att tjäna klistermärken!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

