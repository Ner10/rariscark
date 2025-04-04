import { Howl } from 'howler';

// Create Howl instances for our sounds using publicly available sounds
// Using a realistic, short spinning sound for the wheel
const wheelSpinSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2022/2022-preview.mp3'], // Ratchet mechanical click sound
  volume: 0.5,
  loop: true,
  rate: 1.2 // Slightly faster to sound more like a spinning wheel
});

// Using a cheerful, celebratory sound for winning
const winSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'], // Winning game sound with bells
  volume: 0.7
});

const clickSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3'],
  volume: 0.5
});

// Sound utility functions
export const playSpinSound = () => {
  wheelSpinSound.stop(); // Make sure it's not already playing
  wheelSpinSound.rate(1.2); // Reset to default rate
  wheelSpinSound.play();
};

export const stopSpinSound = () => {
  wheelSpinSound.stop();
};

// Adjust spin sound rate - for slowing down effect
export const adjustSpinSoundRate = (rate: number) => {
  wheelSpinSound.rate(rate);
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