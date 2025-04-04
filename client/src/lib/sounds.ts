import { Howl } from 'howler';

// Create Howl instances for our sounds using publicly available sounds
// Using a shorter spinning sound that will loop during wheel rotation
const spinSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3'],
  volume: 0.4,
  loop: true
});

const winSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3'],
  volume: 0.7
});

const clickSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3'],
  volume: 0.5
});

// Sound utility functions
export const playSpinSound = () => {
  spinSound.stop(); // Make sure it's not already playing
  spinSound.play();
};

export const stopSpinSound = () => {
  spinSound.stop();
};

export const playWinSound = () => {
  winSound.play();
};

export const playClickSound = () => {
  clickSound.play();
};

// Mute/unmute functions
let isMuted = false;
export const toggleMute = () => {
  isMuted = !isMuted;
  Howler.mute(isMuted);
  return isMuted;
};

export const getMuteState = () => isMuted;

export const setMuted = (muted: boolean) => {
  isMuted = muted;
  Howler.mute(isMuted);
};