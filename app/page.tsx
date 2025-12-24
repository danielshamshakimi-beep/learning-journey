import Link from 'next/link';
import { FaCalculator, FaBook, FaStickyNote } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <main className="flex flex-col items-center justify-center gap-8 px-6 py-12">
        <h1 className="text-6xl md:text-7xl font-bold text-center text-purple-700 mb-4" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          Lärande Kul!
        </h1>
        
        <div className="flex flex-col gap-6 w-full max-w-md">
          <Link 
            href="/math"
            className="group relative flex flex-col items-center justify-center h-48 md:h-56 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-95 touch-manipulation"
          >
            <div className="text-center">
              <div className="text-purple-600 mb-4">
                <FaCalculator className="text-6xl mx-auto" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                Matte Spel
              </h2>
              <p className="text-lg mt-2 text-gray-500">Lär dig Addition!</p>
            </div>
          </Link>

          <button
            disabled
            className="group relative flex flex-col items-center justify-center h-48 bg-gray-50 rounded-3xl shadow-sm opacity-60 cursor-not-allowed"
          >
            <div className="text-gray-400 text-center">
              <FaBook className="text-6xl mb-4 mx-auto" />
              <h2 className="text-3xl font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                Språk Spel
              </h2>
              <p className="text-lg mt-2">Kommer Snart!</p>
            </div>
          </button>

          <Link 
            href="/stickers"
            className="group relative flex flex-col items-center justify-center h-48 md:h-56 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-95 touch-manipulation"
          >
            <div className="text-center">
              <div className="text-yellow-600 mb-4">
                <FaStickyNote className="text-6xl mx-auto" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                Klistermärken
              </h2>
              <p className="text-lg mt-2 text-gray-500">Se dina klistermärken!</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
