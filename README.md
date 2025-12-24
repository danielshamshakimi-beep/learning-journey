# Kids Learning Game 🎮

An interactive educational game for kids featuring math and letter recognition games.

## Features

### Math Game ✅
- Addition problems with multiple choice answers
- Visual feedback (green for correct, red for wrong)
- Confetti celebration for correct answers
- 3 tries per question
- Progressive difficulty (starts easy, gets harder)
- Score tracking with localStorage
- Navigation arrows (back/next)
- Home button to return to main menu

### Letter Game (Coming Soon)
- Letter recognition
- Word building
- Similar gameplay to math game

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Confetti**: canvas-confetti
- **Icons**: react-icons
- **Deployment**: Vercel

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
kids-learning-game/
├── app/
│   ├── page.tsx          # Landing page (choose game)
│   ├── math/
│   │   └── page.tsx      # Math game
│   └── letters/
│       └── page.tsx       # Letter game (placeholder)
├── components/
│   ├── GameCard.tsx      # Question display card
│   ├── AnswerButton.tsx  # Answer option button
│   ├── NavigationArrows.tsx  # Back/Next/Home buttons
│   ├── ProgressBar.tsx   # Score display
│   └── ConfettiEffect.tsx # Confetti animation
├── lib/
│   ├── gameLogic.ts      # Math question generation
│   ├── difficulty.ts    # Difficulty progression
│   └── storage.ts       # localStorage helpers
└── public/              # Static assets
```

## Game Rules

- **Math Game**: 
  - Start with simple addition (1+1 to 5+5)
  - Get 3 tries per question
  - Score points for correct answers
  - Difficulty increases after 5 correct answers
  - Use arrows to navigate between questions

## Deployment

Deploy to Vercel:

```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## License

Private project for personal use.
