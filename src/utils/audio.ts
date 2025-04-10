
// Audio context singleton
let audioContextInstance: AudioContext | null = null;

export const getAudioContext = (): AudioContext => {
  if (!audioContextInstance) {
    audioContextInstance = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContextInstance;
};

// Ensure the audio context is ready
export const ensureAudioContext = (): boolean => {
  try {
    const context = getAudioContext();
    if (context.state === 'suspended') {
      context.resume();
    }
    return true;
  } catch (error) {
    console.error("Error initializing audio context:", error);
    return false;
  }
};

// Notes in the C major pentatonic scale
const NOTES = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.00, // G4
  440.00, // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
];

export const playTone = (index: number, duration = 0.2, gain = 0.3): void => {
  try {
    ensureAudioContext();
    const audioContext = getAudioContext();
    
    // Calculate note based on index (modulo to stay within our scale)
    const noteIndex = index % NOTES.length;
    const frequency = NOTES[noteIndex];
    
    // Create oscillator and gain nodes
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure oscillator
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    // Configure gain (volume)
    gainNode.gain.value = 0;
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Schedule envelope
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(gain, now + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);
    
    // Start and stop oscillator
    oscillator.start(now);
    oscillator.stop(now + duration + 0.05);
    
    // Cleanup
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  } catch (error) {
    console.error("Error playing tone:", error);
  }
};

export const playSuccessSound = (): void => {
  // Play an ascending pattern for success
  const baseDelay = 0.1;
  [0, 2, 4, 7].forEach((noteOffset, i) => {
    setTimeout(() => playTone(noteOffset, 0.3, 0.2), baseDelay * i * 1000);
  });
};

export const playErrorSound = (): void => {
  // Play a dissonant pattern for errors
  const baseDelay = 0.1;
  [3, 2].forEach((noteOffset, i) => {
    setTimeout(() => playTone(noteOffset, 0.2, 0.15), baseDelay * i * 1000);
  });
};

export const playLevelCompleteSound = (): void => {
  // Play a more elaborate success pattern
  const baseDelay = 0.15;
  [0, 2, 4, 7, 9].forEach((noteOffset, i) => {
    setTimeout(() => playTone(noteOffset, 0.3, 0.25), baseDelay * i * 1000);
  });
};
