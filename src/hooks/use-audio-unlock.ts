'use client';

import { useEffect } from 'react';
import { unlockAudio } from '@/lib/sound-manager';

/**
 * Hook that unlocks the Web Audio API on first user interaction.
 * Modern browsers require user interaction before allowing audio playback.
 * This hook listens for click, touchstart, and keydown events and unlocks
 * audio on the first interaction.
 */
export function useAudioUnlock() {
  useEffect(() => {
    const handleInteraction = () => {
      unlockAudio();
      // Remove listeners after first unlock
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);
}
