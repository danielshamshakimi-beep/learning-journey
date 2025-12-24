/**
 * Sticker Board types and data models
 */

export type StickerCategory = 'animals' | 'nature' | 'space' | 'food' | 'sports' | 'music' | 'art' | 'celebration';

export interface Sticker {
  id: string;
  category: StickerCategory;
  emoji: string;
  name: string; // Swedish name
  description: string; // Swedish description
}

export interface StickerPlacement {
  stickerId: string;
  boardIndex: number;
  row: number;
  col: number;
}

export interface StickerBoard {
  id: number;
  grid: (StickerPlacement | null)[][];
  width: number;
  height: number;
  createdAt: string;
}

export interface StickerCollection {
  earnedStickers: string[]; // Array of sticker IDs
  boards: StickerBoard[];
  currentBoardIndex: number;
  milestonesReached: Set<string>; // Track which milestones have been reached
}

export interface StickerMilestone {
  id: string;
  name: string; // Swedish
  description: string; // Swedish
  stickerOptions: string[]; // Array of sticker IDs (2-4 options)
}

// Predefined sticker library (generic, no copyrighted IP)
export const STICKER_LIBRARY: Record<string, Sticker> = {
  // Animals
  'cat': { id: 'cat', category: 'animals', emoji: '🐱', name: 'Katt', description: 'En söt katt' },
  'dog': { id: 'dog', category: 'animals', emoji: '🐶', name: 'Hund', description: 'En glad hund' },
  'rabbit': { id: 'rabbit', category: 'animals', emoji: '🐰', name: 'Kanin', description: 'En hoppig kanin' },
  'bear': { id: 'bear', category: 'animals', emoji: '🐻', name: 'Björn', description: 'En snäll björn' },
  'panda': { id: 'panda', category: 'animals', emoji: '🐼', name: 'Panda', description: 'En gullig panda' },
  'tiger': { id: 'tiger', category: 'animals', emoji: '🐯', name: 'Tiger', description: 'En modig tiger' },
  'lion': { id: 'lion', category: 'animals', emoji: '🦁', name: 'Lejon', description: 'En stark lejon' },
  'elephant': { id: 'elephant', category: 'animals', emoji: '🐘', name: 'Elefant', description: 'En stor elefant' },
  
  // Nature
  'sun': { id: 'sun', category: 'nature', emoji: '☀️', name: 'Sol', description: 'En varm sol' },
  'star': { id: 'star', category: 'nature', emoji: '⭐', name: 'Stjärna', description: 'En glittrande stjärna' },
  'rainbow': { id: 'rainbow', category: 'nature', emoji: '🌈', name: 'Regnbåge', description: 'En vacker regnbåge' },
  'flower': { id: 'flower', category: 'nature', emoji: '🌸', name: 'Blomma', description: 'En fin blomma' },
  'tree': { id: 'tree', category: 'nature', emoji: '🌳', name: 'Träd', description: 'Ett stort träd' },
  'butterfly': { id: 'butterfly', category: 'nature', emoji: '🦋', name: 'Fjäril', description: 'En färgglad fjäril' },
  
  // Space
  'rocket': { id: 'rocket', category: 'space', emoji: '🚀', name: 'Raket', description: 'En snabb raket' },
  'planet': { id: 'planet', category: 'space', emoji: '🪐', name: 'Planet', description: 'En mystisk planet' },
  'moon': { id: 'moon', category: 'space', emoji: '🌙', name: 'Måne', description: 'En vacker måne' },
  'alien': { id: 'alien', category: 'space', emoji: '👽', name: 'Utomjording', description: 'En vänlig utomjording' },
  
  // Food
  'pizza': { id: 'pizza', category: 'food', emoji: '🍕', name: 'Pizza', description: 'En god pizza' },
  'icecream': { id: 'icecream', category: 'food', emoji: '🍦', name: 'Glass', description: 'En söt glass' },
  'cake': { id: 'cake', category: 'food', emoji: '🎂', name: 'Tårta', description: 'En festlig tårta' },
  'apple': { id: 'apple', category: 'food', emoji: '🍎', name: 'Äpple', description: 'Ett friskt äpple' },
  
  // Sports
  'soccer': { id: 'soccer', category: 'sports', emoji: '⚽', name: 'Fotboll', description: 'En fotboll' },
  'basketball': { id: 'basketball', category: 'sports', emoji: '🏀', name: 'Basket', description: 'En basketboll' },
  'trophy': { id: 'trophy', category: 'sports', emoji: '🏆', name: 'Pokal', description: 'En vacker pokal' },
  
  // Music
  'guitar': { id: 'guitar', category: 'music', emoji: '🎸', name: 'Gitarr', description: 'En cool gitarr' },
  'piano': { id: 'piano', category: 'music', emoji: '🎹', name: 'Piano', description: 'Ett vackert piano' },
  'drum': { id: 'drum', category: 'music', emoji: '🥁', name: 'Trumma', description: 'En högljudd trumma' },
  
  // Art
  'palette': { id: 'palette', category: 'art', emoji: '🎨', name: 'Palett', description: 'En färgglad palett' },
  'crayon': { id: 'crayon', category: 'art', emoji: '🖍️', name: 'Kritor', description: 'Färgglada kritor' },
  
  // Celebration
  'party': { id: 'party', category: 'celebration', emoji: '🎉', name: 'Fest', description: 'En rolig fest' },
  'confetti': { id: 'confetti', category: 'celebration', emoji: '🎊', name: 'Konfetti', description: 'Färgglatt konfetti' },
  'medal': { id: 'medal', category: 'celebration', emoji: '🏅', name: 'Medalj', description: 'En stolt medalj' },
};

// Milestone definitions
export const MILESTONES: Record<string, StickerMilestone> = {
  'first_round': {
    id: 'first_round',
    name: 'Första Runda!',
    description: 'Du klarade din första runda!',
    stickerOptions: ['cat', 'dog', 'rabbit', 'sun'],
  },
  '100_points': {
    id: '100_points',
    name: '100 Poäng!',
    description: 'Du har samlat 100 poäng!',
    stickerOptions: ['star', 'rainbow', 'flower', 'rocket'],
  },
  'streak_5': {
    id: 'streak_5',
    name: '5 i Rad!',
    description: 'Du fick 5 rätt svar i rad!',
    stickerOptions: ['trophy', 'medal', 'party', 'confetti'],
  },
  'perfect_round': {
    id: 'perfect_round',
    name: 'Perfekt Runda!',
    description: 'Du klarade en runda utan att förlora hjärtan!',
    stickerOptions: ['cake', 'rainbow', 'trophy', 'medal'],
  },
  'daily_challenge': {
    id: 'daily_challenge',
    name: 'Daglig Utmaning!',
    description: 'Du klarade dagens utmaning!',
    stickerOptions: ['rocket', 'star', 'party', 'medal'],
  },
  '200_points': {
    id: '200_points',
    name: '200 Poäng!',
    description: 'Du har samlat 200 poäng!',
    stickerOptions: ['planet', 'moon', 'alien', 'rocket'],
  },
  '300_points': {
    id: '300_points',
    name: '300 Poäng!',
    description: 'Du har samlat 300 poäng!',
    stickerOptions: ['pizza', 'icecream', 'cake', 'apple'],
  },
};

