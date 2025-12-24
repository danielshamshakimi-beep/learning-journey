'use client';

import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

interface NavigationArrowsProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export default function NavigationArrows({ 
  onPrevious, 
  onNext, 
  canGoPrevious, 
  canGoNext 
}: NavigationArrowsProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-2xl mt-8">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`
          flex items-center justify-center
          w-16 h-16
          rounded-full
          text-2xl
          transition-all duration-200
          ${canGoPrevious 
            ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        <FaArrowLeft />
      </button>

      <Link
        href="/"
        className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-500 text-white hover:bg-purple-600 active:scale-95 transition-all duration-200 text-xl"
      >
        🏠
      </Link>

      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`
          flex items-center justify-center
          w-16 h-16
          rounded-full
          text-2xl
          transition-all duration-200
          ${canGoNext 
            ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        <FaArrowRight />
      </button>
    </div>
  );
}

