import React from "react";
import { useSound } from "../hooks/sounds";

interface HeaderProps {
  toggleInventory: () => void;
  toggleAudio: () => void;
  isAudioPlaying: boolean;
  showInventory: boolean;
}

const Header: React.FC<HeaderProps> = ({
  toggleInventory,
  toggleAudio,
  isAudioPlaying,
  showInventory,
}) => {
  const { playClickSound, playHoverSound } = useSound();

  return (
    <header className="relative z-10 text-center">
      <img
        src="https://venge.io/files/assets/182916517/1/Logo.png"
        alt="Venge.io"
        className="h-16 inline"
      />
      <h1 className="text-4xl py-2 font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        Crate Simulator
      </h1>
      <button
        onClick={() => {
          playClickSound();
          toggleInventory();
        }}
        onMouseEnter={playHoverSound}
        className="mt-5 w-48 bg-black opacity-50 text-yellow-400 font-bold py-2 px-4 rounded-full"
      >
        {showInventory ? "Close Inventory" : "View Inventory"}
      </button>
      <button
        onClick={() => {
          playClickSound();
          toggleAudio();
        }}
        onMouseEnter={playHoverSound}
        className="mt-5 w-48 bg-black opacity-50 text-yellow-400 font-bold py-2 px-4 rounded-full"
      >
        {isAudioPlaying ? "Pause Music" : "Play Music"}
      </button>
    </header>
  );
};

export default Header;
