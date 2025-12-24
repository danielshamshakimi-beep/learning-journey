'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StickerPlacementEffectProps {
  trigger: boolean;
  onComplete: () => void;
}

export default function StickerPlacementEffect({ trigger, onComplete }: StickerPlacementEffectProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {/* Sparkles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 40;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x,
              y,
            }}
            transition={{
              duration: 0.6,
              delay: i * 0.05,
              ease: 'easeOut',
            }}
            className="absolute text-2xl"
          >
            ✨
          </motion.div>
        );
      })}
    </div>
  );
}

