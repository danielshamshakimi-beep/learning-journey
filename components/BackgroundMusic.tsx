'use client';

import { useEffect, useRef, useState } from 'react';

interface BackgroundMusicProps {
  src?: string; // URL to background music file
  volume?: number; // 0.0 to 1.0
}

export default function BackgroundMusic({ src, volume = 0.3 }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    // Create audio element
    if (typeof window !== 'undefined' && src) {
      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = volume;
      audioRef.current = audio;

      // Try to play on user interaction
      const handleFirstInteraction = () => {
        setUserInteracted(true);
        if (audio.paused) {
          audio.play().catch((err) => {
            console.log('Could not play background music:', err);
          });
          setIsPlaying(true);
        }
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };

      document.addEventListener('click', handleFirstInteraction);
      document.addEventListener('touchstart', handleFirstInteraction);

      return () => {
        audio.pause();
        audio.src = '';
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };
    }
  }, [src, volume]);

  // If no src provided, use a generated kid-friendly ambient sound
  useEffect(() => {
    if (!src && typeof window !== 'undefined') {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      let oscillators: OscillatorNode[] = [];
      let gainNodes: GainNode[] = [];
      let intervalId: NodeJS.Timeout | null = null;

      const startAmbient = () => {
        if (oscillators.length > 0) return; // Already playing

        // Create a gentle, repeating melody pattern (C major scale notes)
        const melody = [
          261.63, // C4
          293.66, // D4
          329.63, // E4
          349.23, // F4
          392.00, // G4
        ];

        // Create a soft pad with multiple oscillators for richness
        const padNotes = [261.63, 329.63, 392.00]; // C, E, G (C major chord)
        
        padNotes.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.type = 'sine';
          oscillator.frequency.value = freq;
          
          // Very quiet, ambient volume
          gainNode.gain.value = 0.03;
          
          // Add slight detuning for warmth
          if (index > 0) {
            oscillator.frequency.value = freq * (1 + (index - 1) * 0.002);
          }

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.start();
          oscillators.push(oscillator);
          gainNodes.push(gainNode);
        });

        // Add a gentle, slow melody that plays every 8 seconds
        let melodyIndex = 0;
        const playMelodyNote = () => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.type = 'sine';
          oscillator.frequency.value = melody[melodyIndex % melody.length];
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.3);
          gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.5);

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 1.5);
          
          melodyIndex++;
        };

        // Play first note immediately, then every 8 seconds
        playMelodyNote();
        intervalId = setInterval(playMelodyNote, 8000);

        setIsPlaying(true);
      };

      const handleFirstInteraction = () => {
        setUserInteracted(true);
        startAmbient();
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };

      document.addEventListener('click', handleFirstInteraction);
      document.addEventListener('touchstart', handleFirstInteraction);

      return () => {
        oscillators.forEach(osc => {
          osc.stop();
          osc.disconnect();
        });
        gainNodes.forEach(gain => {
          gain.disconnect();
        });
        if (intervalId) {
          clearInterval(intervalId);
        }
        oscillators = [];
        gainNodes = [];
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };
    }
  }, [src]);

  return null; // This component doesn't render anything
}

