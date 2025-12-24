'use client';

import { useReducer, useEffect, useRef, useState } from 'react';
import { gameReducer, calculateRoundSummary } from '@/lib/gameReducer';
import { createInitialState } from '@/lib/gameReducer';
import { loadProgress, saveProgress } from '@/lib/storage';
import GameCard from '@/components/GameCard';
import AnswerButton from '@/components/AnswerButton';
import HeartsDisplay from '@/components/HeartsDisplay';
import RoundSummary from '@/components/RoundSummary';
import ProgressBar from '@/components/ProgressBar';
import ConfettiEffect from '@/components/ConfettiEffect';
import BackgroundMusic from '@/components/BackgroundMusic';
import { soundManager } from '@/lib/sounds';
import { motion, AnimatePresence } from 'framer-motion';
import { RoundSummary as RoundSummaryType } from '@/lib/types';
import Link from 'next/link';
import StickerSelectionModal from '@/components/StickerSelectionModal';
import { MILESTONES } from '@/lib/stickers/types';
import { checkMilestones } from '@/lib/stickers/milestones';

export default function AdditionGamePage() {
  const roundStartTimeRef = useRef<number>(0);
  const previousStateRef = useRef<ReturnType<typeof createInitialState> | null>(null);
  const [summary, setSummary] = useState<RoundSummaryType | null>(null);
  const [state, dispatch] = useReducer(gameReducer, null, () => {
    // Initialize state
    const savedProgress = loadProgress();
    const initialLevel = savedProgress?.currentLevel || 1;
    return createInitialState(initialLevel);
  });

  // Initialize round start time
  useEffect(() => {
    if (roundStartTimeRef.current === 0) {
      roundStartTimeRef.current = Date.now();
    }
  }, []);

  // Load progress on mount
  useEffect(() => {
    const savedProgress = loadProgress();
    if (savedProgress) {
      dispatch({
        type: 'LOAD_PROGRESS',
        progress: {
          totalScore: savedProgress.totalScore,
          bestStreak: savedProgress.bestStreak,
          level: savedProgress.currentLevel,
        },
      });
    }
  }, []);

  // Save progress when score changes
  useEffect(() => {
    if (state.totalScore > 0 || state.bestStreak > 0) {
      saveProgress({
        totalScore: state.totalScore + state.score,
        bestStreak: state.bestStreak,
        currentLevel: state.level,
      });
    }
  }, [state.totalScore, state.bestStreak, state.level, state.score]);

  // Calculate summary when showing summary
  useEffect(() => {
    if (state.showSummary && roundStartTimeRef.current > 0) {
      const calculatedSummary = calculateRoundSummary(state, roundStartTimeRef.current);
      setSummary(calculatedSummary);
    } else {
      setSummary(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.showSummary, state.roundNumber, state.correctCount, state.totalQuestions, state.bestStreak, state.score]);

  // Auto-advance to summary when round completes
  useEffect(() => {
    if (state.roundComplete && !state.showSummary) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SHOW_SUMMARY' });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.roundComplete, state.showSummary]);

  // Reset round start time when round number changes
  useEffect(() => {
    roundStartTimeRef.current = Date.now();
  }, [state.roundNumber]);

  // Check for milestones and show sticker selection
  const [pendingMilestone, setPendingMilestone] = useState<string | null>(null);
  
  useEffect(() => {
    if (previousStateRef.current) {
      const milestoneResult = checkMilestones(state, previousStateRef.current);
      if (milestoneResult.milestoneId && milestoneResult.milestone) {
        setPendingMilestone(milestoneResult.milestoneId);
      }
    }
    previousStateRef.current = { ...state };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.totalScore, state.score, state.roundNumber, state.streak, state.roundComplete, state.hearts]);

  const handleStickerSelected = () => {
    setPendingMilestone(null);
  };

  const handleAnswerClick = (answer: number) => {
    // Don't allow clicks if already answered correctly, out of hearts, or round complete
    if (state.isCorrect === true || state.hearts === 0 || state.roundComplete) {
      return;
    }

    dispatch({ type: 'SELECT_ANSWER', answer });

    // Play sound
    if (state.currentQuestion) {
      const isCorrect = answer === state.currentQuestion.answer;
      if (isCorrect) {
        soundManager.playSuccess();
        // Auto-advance to next question after 1 second
        setTimeout(() => {
          if (!state.roundComplete) {
            dispatch({ type: 'NEXT_QUESTION' });
          }
        }, 1000);
      } else {
        soundManager.playError();
      }
    }
  };

  const handleNext = () => {
    if (state.roundComplete) {
      dispatch({ type: 'SHOW_SUMMARY' });
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  };

  const handleNextRound = () => {
    // Total score is already updated in reducer, just save it
    const finalTotalScore = state.totalScore + state.score;
    saveProgress({
      totalScore: finalTotalScore,
      bestStreak: state.bestStreak,
      currentLevel: state.level,
    });

    roundStartTimeRef.current = Date.now();
    dispatch({ type: 'INIT_ROUND', level: state.level });
  };

  const handleRetry = () => {
    roundStartTimeRef.current = Date.now();
    dispatch({ type: 'INIT_ROUND', level: state.level });
  };

  if (!state.currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-4xl">Laddar...</div>
      </div>
    );
  }

  // Show correct answer if out of hearts
  const showCorrectAnswer = state.hearts === 0 && state.isCorrect === false;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 p-4">
      <BackgroundMusic />
      <ConfettiEffect trigger={state.showConfetti} />
      
      {pendingMilestone && MILESTONES[pendingMilestone] && (
        <StickerSelectionModal
          milestone={MILESTONES[pendingMilestone]}
          onSelect={handleStickerSelected}
        />
      )}
      
      {state.showSummary && summary && (
        <RoundSummary
          summary={summary}
          onNextRound={handleNextRound}
          onRetry={handleRetry}
        />
      )}

      {!state.showSummary && (
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <Link
              href="/math"
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              style={{ fontFamily: 'Comic Sans MS, cursive' }}
            >
              ← Tillbaka
            </Link>
            <Link
              href="/stickers"
              className="bg-white text-gray-600 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm shadow-sm"
              style={{ fontFamily: 'Comic Sans MS, cursive' }}
            >
              🏆 Prestationstavla
            </Link>
          </div>
          
          <HeartsDisplay hearts={state.hearts} />
          
          <ProgressBar
            score={state.totalScore + state.score}
            difficulty={state.level}
            currentQuestion={state.currentRoundIndex + 1}
            totalQuestions={state.questionsInRound.length}
          />

          <div className="text-center mb-4">
            <span className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              Runda {state.roundNumber} • Fråga {state.currentRoundIndex + 1} / {state.questionsInRound.length}
            </span>
            {state.streak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-lg text-yellow-600 mt-2 font-medium"
              >
                Streak: {state.streak} 🔥
              </motion.div>
            )}
          </div>

          <div className="mb-8">
            <GameCard 
              question={state.currentQuestion.question} 
              isCorrect={state.isCorrect}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 max-w-md w-full mx-auto">
            <AnimatePresence mode="wait">
              {state.currentQuestion?.options.map((option, index) => {
                // Show correct answer if out of hearts
                let buttonIsCorrect: boolean | null = null;
                if (state.selectedAnswer === option) {
                  buttonIsCorrect = state.isCorrect;
                } else if (showCorrectAnswer && state.currentQuestion && option === state.currentQuestion.answer) {
                  buttonIsCorrect = true;
                }
                
                return (
                  <motion.div
                    key={`${state.currentQuestion?.id}-${option}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AnswerButton
                      answer={option}
                      onClick={() => handleAnswerClick(option)}
                      isCorrect={buttonIsCorrect}
                      disabled={state.hearts === 0 || state.isCorrect === true || state.roundComplete}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {state.isCorrect === true && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl mb-4 text-center"
            >
              ⭐ Bra Jobbat! ⭐
            </motion.div>
          )}

          {showCorrectAnswer && state.currentQuestion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl text-gray-600 mb-4 text-center"
            >
              Svaret var: {state.currentQuestion.answer}
            </motion.div>
          )}

          {/* Show Next button only as fallback (when auto-advance didn't work or wrong answer) */}
          {!state.roundComplete && state.isCorrect === false && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="px-8 py-3 bg-white text-purple-700 rounded-3xl font-bold shadow-sm hover:bg-purple-50 mx-auto block transition-colors"
              style={{ fontFamily: 'Comic Sans MS, cursive' }}
            >
              Nästa Fråga →
            </motion.button>
          )}

          {state.roundComplete && !state.showSummary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-2xl font-bold text-purple-700 mb-4">
                Runda Klar! 🎉
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

