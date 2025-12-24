'use client';

import { motion } from 'framer-motion';

interface RewardAnticipationProps {
  currentScore: number;
  nextMilestone: number;
  milestoneName: string;
}

export default function RewardAnticipation({ currentScore, nextMilestone, milestoneName }: RewardAnticipationProps) {
  const pointsNeeded = Math.max(0, nextMilestone - currentScore);
  const progress = Math.min(100, (currentScore / nextMilestone) * 100);

  if (pointsNeeded === 0) {
    return null; // Milestone reached, don't show
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-4 mb-4 w-full max-w-md"
    >
      <div className="flex items-center gap-3">
        <div className="text-4xl">
          🎁
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-700 mb-1" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            {milestoneName}
          </div>
          <div className="text-xs text-gray-600 mb-2">
            {pointsNeeded} poäng kvar till nästa klistermärke!
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

