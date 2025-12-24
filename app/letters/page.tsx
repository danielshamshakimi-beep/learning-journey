'use client';

import Link from 'next/link';

export default function LettersGamePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-purple-600 mb-8" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          Språk Spel
        </h1>
        <p className="text-3xl text-gray-600 mb-8">Kommer Snart! 🎉</p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-blue-500 text-white text-2xl font-bold rounded-2xl hover:bg-blue-600 transition-colors"
          style={{ fontFamily: 'Comic Sans MS, cursive' }}
        >
          Tillbaka till Menyn
        </Link>
      </div>
    </div>
  );
}

