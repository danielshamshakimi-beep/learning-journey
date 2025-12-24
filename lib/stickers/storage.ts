/**
 * Sticker Board storage with versioning
 */

import { StickerCollection, StickerBoard, StickerPlacement } from './types';

const STORAGE_KEY = 'kids-learning-game-stickers';
const CURRENT_VERSION = 'v1';
const BOARD_WIDTH = 4;
const BOARD_HEIGHT = 5;

interface StoredStickerCollection {
  version: string;
  earnedStickers: string[];
  boards: Array<{
    id: number;
    grid: (StickerPlacement | null)[][];
    width: number;
    height: number;
    createdAt: string;
  }>;
  currentBoardIndex: number;
  milestonesReached: string[]; // Array of milestone IDs
}

function createEmptyBoard(id: number): StickerBoard {
  const grid: (StickerPlacement | null)[][] = [];
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    grid[row] = [];
    for (let col = 0; col < BOARD_WIDTH; col++) {
      grid[row][col] = null;
    }
  }
  
  return {
    id,
    grid,
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    createdAt: new Date().toISOString(),
  };
}

function createDefaultCollection(): StickerCollection {
  return {
    earnedStickers: [],
    boards: [createEmptyBoard(1)],
    currentBoardIndex: 0,
    milestonesReached: new Set(),
  };
}

/**
 * Load sticker collection from localStorage
 */
export function loadStickerCollection(): StickerCollection {
  if (typeof window === 'undefined') {
    return createDefaultCollection();
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: StoredStickerCollection = JSON.parse(stored);
      
      if (data.version === CURRENT_VERSION) {
        // Convert array back to Set
        return {
          earnedStickers: data.earnedStickers,
          boards: data.boards as StickerBoard[],
          currentBoardIndex: data.currentBoardIndex,
          milestonesReached: new Set(data.milestonesReached),
        };
      }
    }
  } catch (error) {
    console.error('Failed to load sticker collection:', error);
  }
  
  return createDefaultCollection();
}

/**
 * Save sticker collection to localStorage
 */
export function saveStickerCollection(collection: StickerCollection): void {
  if (typeof window === 'undefined') return;
  
  try {
    const data: StoredStickerCollection = {
      version: CURRENT_VERSION,
      earnedStickers: collection.earnedStickers,
      boards: collection.boards,
      currentBoardIndex: collection.currentBoardIndex,
      milestonesReached: Array.from(collection.milestonesReached),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save sticker collection:', error);
  }
}

/**
 * Add an earned sticker to the collection
 */
export function addEarnedSticker(stickerId: string): void {
  const collection = loadStickerCollection();
  if (!collection.earnedStickers.includes(stickerId)) {
    collection.earnedStickers.push(stickerId);
    saveStickerCollection(collection);
  }
}

/**
 * Place a sticker on the board
 */
export function placeStickerOnBoard(
  stickerId: string,
  boardIndex: number,
  row: number,
  col: number
): boolean {
  const collection = loadStickerCollection();
  
  // Check if sticker is earned
  if (!collection.earnedStickers.includes(stickerId)) {
    return false;
  }
  
  // Check if board exists
  if (boardIndex >= collection.boards.length) {
    return false;
  }
  
  const board = collection.boards[boardIndex];
  
  // Check if position is valid
  if (row < 0 || row >= board.height || col < 0 || col >= board.width) {
    return false;
  }
  
  // Check if slot is empty
  if (board.grid[row][col] !== null) {
    return false;
  }
  
  // Place the sticker
  board.grid[row][col] = {
    stickerId,
    boardIndex,
    row,
    col,
  };
  
  saveStickerCollection(collection);
  return true;
}

/**
 * Move a sticker on the board
 */
export function moveStickerOnBoard(
  boardIndex: number,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean {
  const collection = loadStickerCollection();
  
  if (boardIndex >= collection.boards.length) {
    return false;
  }
  
  const board = collection.boards[boardIndex];
  
  // Check if from position is valid and has a sticker
  if (
    fromRow < 0 || fromRow >= board.height ||
    fromCol < 0 || fromCol >= board.width ||
    board.grid[fromRow][fromCol] === null
  ) {
    return false;
  }
  
  // Check if to position is valid and empty
  if (
    toRow < 0 || toRow >= board.height ||
    toCol < 0 || toCol >= board.width ||
    board.grid[toRow][toCol] !== null
  ) {
    return false;
  }
  
  // Move the sticker
  const sticker = board.grid[fromRow][fromCol]!;
  board.grid[toRow][toCol] = {
    ...sticker,
    row: toRow,
    col: toCol,
  };
  board.grid[fromRow][fromCol] = null;
  
  saveStickerCollection(collection);
  return true;
}

/**
 * Remove a sticker from the board (returns it to collection)
 */
export function removeStickerFromBoard(
  boardIndex: number,
  row: number,
  col: number
): boolean {
  const collection = loadStickerCollection();
  
  if (boardIndex >= collection.boards.length) {
    return false;
  }
  
  const board = collection.boards[boardIndex];
  
  if (
    row < 0 || row >= board.height ||
    col < 0 || col >= board.width ||
    board.grid[row][col] === null
  ) {
    return false;
  }
  
  board.grid[row][col] = null;
  saveStickerCollection(collection);
  return true;
}

/**
 * Check if a milestone has been reached
 */
export function hasMilestoneBeenReached(milestoneId: string): boolean {
  const collection = loadStickerCollection();
  return collection.milestonesReached.has(milestoneId);
}

/**
 * Mark a milestone as reached
 */
export function markMilestoneReached(milestoneId: string): void {
  const collection = loadStickerCollection();
  collection.milestonesReached.add(milestoneId);
  saveStickerCollection(collection);
}

/**
 * Get the current board
 */
export function getCurrentBoard(): StickerBoard {
  const collection = loadStickerCollection();
  return collection.boards[collection.currentBoardIndex];
}

/**
 * Check if current board is full
 */
export function isCurrentBoardFull(): boolean {
  const board = getCurrentBoard();
  for (let row = 0; row < board.height; row++) {
    for (let col = 0; col < board.width; col++) {
      if (board.grid[row][col] === null) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Create a new board if current is full
 */
export function createNewBoardIfNeeded(): StickerBoard | null {
  const collection = loadStickerCollection();
  
  if (!isCurrentBoardFull()) {
    return null;
  }
  
  const newBoardId = collection.boards.length + 1;
  const newBoard = createEmptyBoard(newBoardId);
  collection.boards.push(newBoard);
  collection.currentBoardIndex = collection.boards.length - 1;
  saveStickerCollection(collection);
  
  return newBoard;
}

