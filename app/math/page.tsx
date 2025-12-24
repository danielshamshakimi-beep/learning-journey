'use client';

import Link from 'next/link';
import { FaCalculator, FaHandPointer } from 'react-icons/fa';

export default function MathModeSelection() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <main className="flex flex-col items-center justify-center gap-8 px-6 py-12 max-w-2xl w-full">
        <Link
          href="/"
          className="self-start text-gray-600 hover:text-gray-800 text-base font-medium mb-4"
          style={{ fontFamily: 'Comic Sans MS, cursive' }}
        >
          ← Tillbaka
        </Link>
        
        <h1 className="text-6xl md:text-7xl font-bold text-center text-purple-700 mb-8" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          Matematik
        </h1>
        <p className="text-xl text-gray-600 mb-8 text-center">
          Välj hur du vill öva!
        </p>
        
        <div className="flex flex-col gap-6 w-full">
          <Link 
            href="/math/addition"
            className="group relative flex flex-col items-center justify-center h-48 md:h-56 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-95 touch-manipulation"
          >
            <div className="text-center px-6">
              <div className="text-purple-600 mb-4">
                <FaCalculator className="text-6xl mx-auto" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                ➕ Addition
              </h2>
              <p className="text-lg text-gray-500">
                Räkna snabbt med siffror!
              </p>
            </div>
          </Link>

          <Link 
            href="/math/rakna"
            className="group relative flex flex-col items-center justify-center h-48 md:h-56 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-95 touch-manipulation"
          >
            <div className="text-center px-6">
              <div className="text-purple-600 mb-4">
                <FaHandPointer className="text-6xl mx-auto" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                🔢 Räkna
              </h2>
              <p className="text-lg text-gray-500">
                Räkna objekt och lär dig siffror!
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
