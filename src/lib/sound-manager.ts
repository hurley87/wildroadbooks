import { Howl, Howler } from 'howler';

const sounds = {
  correct: new Howl({ src: ['/sounds/correct.mp3'], volume: 0.5 }),
  wrong: new Howl({ src: ['/sounds/wrong.mp3'], volume: 0.4 }),
  partial: new Howl({ src: ['/sounds/partial.mp3'], volume: 0.4 }),
  streak: new Howl({ src: ['/sounds/streak.mp3'], volume: 0.6 }),
  levelUp: new Howl({ src: ['/sounds/level-up.mp3'], volume: 0.7 }),
  milestone: new Howl({ src: ['/sounds/milestone.mp3'], volume: 0.5 }),
  complete: new Howl({ src: ['/sounds/fanfare.mp3'], volume: 0.6 }),
  click: new Howl({ src: ['/sounds/click.mp3'], volume: 0.3 }),
};

export const playSound = (name: keyof typeof sounds) => {
  sounds[name]?.play();
};

export const setSoundEnabled = (enabled: boolean) => {
  Howler.volume(enabled ? 1.0 : 0.0);
};

