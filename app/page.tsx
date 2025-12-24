'use client';

import Link from 'next/link';
import { FaCalculator, FaBook, FaStickyNote } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 p-4">
      <main className="flex flex-col items-center justify-center gap-6 px-6 py-8 max-w-4xl w-full">
        {/* Friendly Guide Character */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
            y: [0, -8, 0],
          }}
          transition={{ 
            scale: { duration: 0.5, type: 'spring' },
            rotate: { duration: 0.5, type: 'spring' },
            y: { 
              duration: 2, 
              repeat: Infinity, 
              repeatType: 'reverse',
              ease: 'easeInOut'
            }
          }}
          className="text-8xl mb-2"
        >
          👋
        </motion.div>
        
        {/* Welcoming Text */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-center text-purple-700 mb-2"
          style={{ fontFamily: 'Comic Sans MS, cursive' }}
        >
          Hej! Vad vill du leka idag?
        </motion.h1>
        
        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl mt-4">
          {/* Math Game - Purple tint */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/math"
              className="group relative flex flex-col items-center justify-center h-48 md:h-56 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 touch-manipulation"
              style={{
                backgroundColor: 'rgba(147, 51, 234, 0.03)', // Very subtle purple tint
              }}
            >
              <div className="text-center p-4">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: 'easeInOut'
                  }}
                  className="text-purple-600 mb-3"
                >
                  <FaCalculator className="text-7xl md:text-8xl mx-auto" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  Matte
                </h2>
                <p className="text-base md:text-lg text-gray-500">Räkna & Lär dig!</p>
              </div>
            </Link>
          </motion.div>

          {/* Language Game - Blue tint (locked) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="opacity-60"
          >
            <div className="group relative flex flex-col items-center justify-center h-48 md:h-56 bg-white rounded-3xl shadow-sm cursor-not-allowed"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.03)', // Very subtle blue tint
              }}
            >
              <div className="text-center p-4">
                <div className="text-gray-400 mb-3">
                  <FaBook className="text-7xl md:text-8xl mx-auto" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-400 mb-1" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  Språk
                </h2>
                <p className="text-base md:text-lg text-gray-400">Kommer Snart!</p>
              </div>
            </div>
          </motion.div>

          {/* Stickers - Yellow tint */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="col-span-2"
          >
            <Link 
              href="/stickers"
              className="group relative flex flex-col items-center justify-center h-40 md:h-48 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 touch-manipulation w-full"
              style={{
                backgroundColor: 'rgba(250, 204, 21, 0.03)', // Very subtle yellow tint
              }}
            >
              <div className="text-center p-4 flex items-center gap-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: 'easeInOut'
                  }}
                  className="text-yellow-600"
                >
                  <FaStickyNote className="text-6xl md:text-7xl" />
                </motion.div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                    Klistermärken
                  </h2>
                  <p className="text-base md:text-lg text-gray-500">Se dina prestationer! 🏆</p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
