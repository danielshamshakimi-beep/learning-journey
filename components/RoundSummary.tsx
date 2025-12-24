'use client';

import { motion } from 'framer-motion';
import { RoundSummary as RoundSummaryType } from '@/lib/types';
import Link from 'next/link';
import { loadProgress } from '@/lib/storage';
import RewardAnticipation from './RewardAnticipation';

interface RoundSummaryProps {
  summary: RoundSummaryType;
  onNextRound: () => void;
  onRetry: () => void;
}

export default function RoundSummary({ summary, onNextRound, onRetry }: RoundSummaryProps) {
  const accuracyPercent = Math.round(summary.accuracy * 100);
  
  // Show reward progress during round completion
  const progress = loadProgress();
  const totalScore = progress?.totalScore || 0;
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
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        <h2 className="text-4xl font-bold text-purple-600 mb-6" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          Runda {summary.roundNumber} Klar! 🎉
        </h2>
        
        {/* Stars */}
        <div className="mb-6">
          <div className="text-6xl mb-2">
            {'⭐'.repeat(summary.stars)}
            {'☆'.repeat(3 - summary.stars)}
          </div>
          <p className="text-xl text-gray-600">
            {summary.stars === 3 && 'Perfekt!'}
            {summary.stars === 2 && 'Bra jobbat!'}
            {summary.stars === 1 && 'Bra försök!'}
            {summary.stars === 0 && 'Fortsätt öva!'}
          </p>
        </div>
        
        {/* Reward Progress - Show during round completion */}
        {totalScore < 300 && (
          <div className="mb-6">
            <RewardAnticipation
              currentScore={totalScore}
              nextMilestone={nextMilestone}
              milestoneName={milestoneName}
            />
          </div>
        )}

        {/* Stats */}
        <div className="space-y-3 mb-6 text-left bg-purple-50 rounded-2xl p-4">
          <div className="flex justify-between">
            <span className="text-lg font-semibold">Rätt svar:</span>
            <span className="text-lg font-bold text-green-600">
              {summary.correctAnswers} / {summary.totalQuestions}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-lg font-semibold">Noggrannhet:</span>
            <span className="text-lg font-bold text-purple-600">{accuracyPercent}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-lg font-semibold">Bästa streak:</span>
            <span className="text-lg font-bold text-blue-600">{summary.bestStreak}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-lg font-semibold">Poäng:</span>
            <span className="text-lg font-bold text-yellow-600">{summary.scoreEarned} ⭐</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNextRound}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold py-4 rounded-2xl shadow-lg"
            style={{ fontFamily: 'Comic Sans MS, cursive' }}
          >
            Nästa Runda →
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="bg-blue-500 text-white text-xl font-bold py-4 rounded-2xl shadow-lg"
            style={{ fontFamily: 'Comic Sans MS, cursive' }}
          >
            Spela Igen
          </motion.button>
          <Link
            href="/stickers"
            className="bg-gradient-to-r from-pink-400 to-pink-500 text-white text-xl font-bold py-4 rounded-2xl shadow-lg text-center hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'Comic Sans MS, cursive' }}
          >
            Se Prestationstavlan 🏆
          </Link>
          <Link
            href="/"
            className="text-gray-600 text-lg hover:text-gray-800 underline text-center"
          >
            Tillbaka till Menyn
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

