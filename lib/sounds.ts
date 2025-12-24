// Sound effects using Web Audio API
export class SoundManager {
  private audioContext: AudioContext | null = null;

  constructor() {
    // Initialize audio context on first user interaction
    if (typeof window !== 'undefined') {
      this.audioContext = null; // Will be created on first play
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Play a success sound (happy chime - more kid-friendly)
  playSuccess() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      
      // Create a cheerful ascending melody (C-E-G-C)
      const notes = [
        { freq: 523.25, time: 0 },    // C5
        { freq: 659.25, time: 0.1 },  // E5
        { freq: 783.99, time: 0.2 },  // G5
        { freq: 1046.50, time: 0.3 }  // C6
      ];

      notes.forEach((note, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = note.freq;
        
        gainNode.gain.setValueAtTime(0, now + note.time);
        gainNode.gain.linearRampToValueAtTime(0.4, now + note.time + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.time + 0.25);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(now + note.time);
        oscillator.stop(now + note.time + 0.25);
      });
    } catch (error) {
      console.log('Sound playback not available:', error);
    }
  }

  // Play an error sound (gentle, kid-friendly "oops" sound)
  playError() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      
      // Create a gentle descending "oops" sound (two descending notes)
      const notes = [
        { freq: 392.00, time: 0 },    // G4
        { freq: 311.13, time: 0.15 }  // D#4
      ];

      notes.forEach((note) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = note.freq;
        oscillator.frequency.exponentialRampToValueAtTime(note.freq * 0.9, now + note.time + 0.15);
        
        gainNode.gain.setValueAtTime(0, now + note.time);
        gainNode.gain.linearRampToValueAtTime(0.25, now + note.time + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.time + 0.2);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(now + note.time);
        oscillator.stop(now + note.time + 0.2);
      });
    } catch (error) {
      console.log('Sound playback not available:', error);
    }
  }
}

// Singleton instance
export const soundManager = new SoundManager();

