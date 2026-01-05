import { Howl, Howler } from 'howler';

// Track whether audio has been unlocked
let audioUnlocked = false;

// Lazy-initialize sounds to avoid creating them before user interaction
let soundsInitialized = false;
let sounds: Record<string, Howl> = {};

// Helper to create a Howl instance with error handling
const createSound = (src: string, volume: number): Howl => {
  return new Howl({
    src: [src],
    volume,
    onloaderror: (_id, err) => {
      console.warn(`Failed to load sound ${src}:`, err);
    },
    onplayerror: (_id, err) => {
      console.warn(`Failed to play sound ${src}:`, err);
      // Attempt to unlock and retry on play error
      unlockAudio();
    },
  });
};

const initializeSounds = () => {
  if (soundsInitialized) return;

  sounds = {
    correct: createSound('/sounds/correct.mp3', 0.5),
    wrong: createSound('/sounds/wrong.mp3', 0.4),
    // Map missing sounds to existing files as placeholders
    partial: createSound('/sounds/correct.mp3', 0.3),
    streak: createSound('/sounds/fanfare.mp3', 0.5),
    levelUp: createSound('/sounds/fanfare.mp3', 0.6),
    milestone: createSound('/sounds/correct.mp3', 0.4),
    complete: createSound('/sounds/fanfare.mp3', 0.6),
    click: createSound('/sounds/click.mp3', 0.3),
  };

  soundsInitialized = true;
};

// Unlock the AudioContext - call this on first user interaction
export const unlockAudio = (): void => {
  if (audioUnlocked) return;

  // Initialize sounds on first unlock attempt
  initializeSounds();

  // Resume the AudioContext if it's suspended
  const ctx = Howler.ctx;
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().then(() => {
      audioUnlocked = true;
      console.log('AudioContext unlocked successfully');
    }).catch((err) => {
      console.warn('Failed to unlock AudioContext:', err);
    });
  } else {
    audioUnlocked = true;
  }
};

// Type for sound names
type SoundName = 'correct' | 'wrong' | 'partial' | 'streak' | 'levelUp' | 'milestone' | 'complete' | 'click';

export const playSound = (name: SoundName): void => {
  // Ensure sounds are initialized
  initializeSounds();

  // Attempt to unlock audio if not already done
  if (!audioUnlocked) {
    unlockAudio();
  }

  const sound = sounds[name];
  if (!sound) {
    console.warn(`Sound "${name}" not found`);
    return;
  }

  try {
    sound.play();
  } catch (err) {
    console.warn(`Failed to play sound "${name}":`, err);
  }
};

export const setSoundEnabled = (enabled: boolean): void => {
  Howler.volume(enabled ? 1.0 : 0.0);
};

// Preload all sounds (call after audio is unlocked)
export const preloadSounds = (): void => {
  initializeSounds();
  Object.values(sounds).forEach(sound => {
    sound.load();
  });
};
