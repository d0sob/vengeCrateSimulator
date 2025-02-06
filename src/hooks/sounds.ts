import { useEffect } from "react";

const audioContext = new AudioContext();
let clickBuffer: AudioBuffer | null = null;
let hoverBuffer: AudioBuffer | null = null;
let isHoverPlaying = false;

// Load sounds
const loadSound = async (url: string): Promise<AudioBuffer | null> => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.error("Error loading sound:", error);
    return null;
  }
};

// Initialize sounds once
export const useSound = () => {
  useEffect(() => {
    loadSound("./crateclick.mp3").then((buffer) => (clickBuffer = buffer));
    loadSound("./forhover.mp3").then((buffer) => (hoverBuffer = buffer));
  }, []);

  const playClickSound = () => {
    if (!clickBuffer) return;
    const source = audioContext.createBufferSource();
    source.buffer = clickBuffer;
    source.connect(audioContext.destination);
    source.start();
  };

  const playHoverSound = () => {
    if (!hoverBuffer || isHoverPlaying) return;
    isHoverPlaying = true;
    const source = audioContext.createBufferSource();
    source.buffer = hoverBuffer;
    source.connect(audioContext.destination);
    source.start();
    source.onended = () => (isHoverPlaying = false);
  };

  return { playClickSound, playHoverSound };
};
