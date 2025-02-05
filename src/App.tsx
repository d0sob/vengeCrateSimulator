import React, { useState, useEffect } from "react";
import crateData from "./data/items.json";

interface Item {
  id: string;
  name: string;
  thumbnail: string;
  filename: string;
  color: string;
  rarity: string;
  owner: string;
  type: string;
  count: number;
}

interface Crate {
  name: string;
  image: string;
  rarityDrops: Record<string, number>;
}

function CrateBox({
  level,
  name,
  onOpen,
  image,
  rarityDrops,
  itemCount,
}: {
  level: string;
  name: string;
  onOpen: () => void;
  image: string;
  rarityDrops: Record<string, number>;
  itemCount: number;
}) {
  const [showDropRates, setShowDropRates] = useState(false);

  return (
    <div
      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105 w-full max-w-xs"
      onClick={onOpen}
      onMouseEnter={() => setShowDropRates(true)}
      onMouseLeave={() => setShowDropRates(false)}
    >
      <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl flex items-center justify-center border-2 border-gray-700 group-hover:border-yellow-500">
        <img
          src={image}
          alt={name}
          className="w-64 h-64 object-contain transition-transform duration-300 group-hover:scale-110"
        />
        {itemCount > 0 && (
          <div className="absolute top-0 right-0 bg-yellow-500 text-black p-2 rounded-full text-xs font-bold">
            {itemCount}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-75 text-white p-2 rounded-b-lg text-center">
        <h3 className="text-lg font-bold w-full">{name}</h3>
      </div>

      {showDropRates && (
        <div className="absolute top-0 left-0 w-full bg-black bg-opacity-80 text-white p-3 rounded-lg shadow-lg text-sm">
          <h4 className="font-semibold text-yellow-400">Drop Rates:</h4>
          <ul>
            {Object.entries(rarityDrops).map(([rarity, chance]) => (
              <li key={rarity}>
                {rarity}: {chance}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Creating a single AudioContext for both sounds
const audioContext = new AudioContext();

// Preloading crate click sound
let clickBuffer: AudioBuffer | null = null;
fetch("./crateclick.mp3")
  .then((res) => res.arrayBuffer())
  .then((data) => audioContext.decodeAudioData(data))
  .then((decodedBuffer) => (clickBuffer = decodedBuffer));

// Preloading hover sound
let hoverBuffer: AudioBuffer | null = null;
fetch("./forhover.mp3")
  .then((res) => res.arrayBuffer())
  .then((data) => audioContext.decodeAudioData(data))
  .then((decodedBuffer) => (hoverBuffer = decodedBuffer));

let isHoverPlaying = false;

// Function to play crate click sound
const playClickSound = () => {
  if (!clickBuffer) return;
  const source = audioContext.createBufferSource();
  source.buffer = clickBuffer;
  source.connect(audioContext.destination);
  source.start();
};
// Function to play hover sound
const playHoverSound = () => {
  if (!hoverBuffer || isHoverPlaying) return;
  isHoverPlaying = true;
  const source = audioContext.createBufferSource();
  source.buffer = hoverBuffer;
  source.connect(audioContext.destination);
  source.start();
  source.onended = () => {
    isHoverPlaying = false; // Reset flag when the sound ends
  };
};

const bgImages = [
  "./bgs/Sierra-Large.jpg",
  "./bgs/Xibalba-Large.jpg",
  "./bgs/Mistle-Large.jpg",
  "./bgs/Runes-Large.jpg",
  "./bgs/SandstormBlitz-Large.jpg",
  "./bgs/Temple-Large.jpg",
  "./bgs/Tundra-Large.jpg",
];

function App() {
  const [openingCrate, setOpeningCrate] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [showInventory, setShowInventory] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const handleMouseEnter = () => {
    if (!isHoverPlaying) {
      playHoverSound();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fading out

      setTimeout(() => {
        setCurrentBgIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
        setFade(true); // Start fading in after the image changes
      }, 1000); // Duration of fade-out before switching
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const audio = new Audio("./bg_music.mp3");
    audio.loop = true;
    audio.volume = 0.2; // Lower the volume

    if (isAudioPlaying) {
      audio.play().catch((err) => console.log("Audio play error:", err));
    } else {
      audio.pause();
    }

    return () => audio.pause(); // Cleanup the audio when the component unmounts
  }, [isAudioPlaying]); // Dependency on isAudioPlaying state

  const toggleAudio = () => {
    setIsAudioPlaying((prevState) => !prevState); // Toggle the audio play/pause
  };
  // Load inventory from localStorage
  useEffect(() => {
    const savedInventory = localStorage.getItem("inventory");
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
  }, []);

  // Save inventory to localStorage
  useEffect(() => {
    if (Object.keys(inventory).length > 0) {
      localStorage.setItem("inventory", JSON.stringify(inventory));
    }
  }, [inventory]);

  function openCrate(crateLevel: string) {
    const crate = crateData.crates[crateLevel];
    if (!crate) return;

    setOpeningCrate(crateLevel);

    setTimeout(() => {
      const rarityPool: string[] = [];
      Object.entries(crate.rarityDrops).forEach(([rarity, chance]) => {
        for (let i = 0; i < chance; i++) {
          rarityPool.push(rarity);
        }
      });
      const selectedRarity =
        rarityPool[Math.floor(Math.random() * rarityPool.length)];
      const filteredItems = Object.values(crateData.items).filter(
        (item) => item.rarity === selectedRarity
      );
      const selectedItem =
        filteredItems.length > 0
          ? filteredItems[Math.floor(Math.random() * filteredItems.length)]
          : null;

      if (selectedItem) {
        const key = `${selectedItem.name}-${selectedItem.type}`; // Composite key: name + type
        setInventory((prevInventory) => {
          const newInventory = { ...prevInventory };
          newInventory[key] = (newInventory[key] || 0) + 1;
          return newInventory;
        });
      }

      setSelectedItem(selectedItem);
      setOpeningCrate(null);
    }, 500);
  }

  function toggleInventory() {
    setShowInventory(!showInventory);
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center py-10">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImages[currentBgIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: fade ? 1 : 0, // Smooth fade in and out
          transition: "opacity 0.8s ease-in-out",
          filter: "blur(10px) brightness(0.5)",
        }}
      ></div>
      <header className=" relative z-10 text-center">
        <img
          src="https://venge.io/files/assets/182916517/1/Logo.png"
          alt="Venge.io"
          className="h-16 inline"
        />
        <h1 className="text-4xl py-2 font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Crate Simulator
        </h1>
        <p className="mt-3 text-gray-400">For All Your Venge Gambling Needs</p>
        <button
          onClick={toggleInventory}
          onPointerDown={playClickSound}
          onMouseEnter={handleMouseEnter}
          className="mt-5 w-48 bg-black opacity-50 hover:bg-gray-700 text-yellow-400 font-bold py-2 px-4 rounded-full transition-all"
        >
          {showInventory ? "Close Inventory" : "View Inventory"}
        </button>
        <button
          onClick={toggleAudio}
          onPointerDown={playClickSound}
          onMouseEnter={handleMouseEnter}
          className="mt-5 w-48 bg-black opacity-50 hover:bg-gray-700 text-yellow-400 font-bold py-2 px-4 rounded-full transition-all"
        >
          {isAudioPlaying ? "Pause Music" : "Play Music"}
        </button>
      </header>

      {!showInventory ? (
        <div
          onPointerDown={playClickSound}
          onMouseEnter={handleMouseEnter}
          className="container opacity-85 mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center"
        >
          {Object.entries(crateData.crates).map(([level, crate]) => (
            <CrateBox
              key={level}
              level={level}
              name={crate.name}
              image={crate.image}
              rarityDrops={crate.rarityDrops} // Pass drop rates here
              itemCount={inventory[crate.name] || 0} // Show item count on crate thumbnail
              onOpen={() => openCrate(level)}
            />
          ))}
        </div>
      ) : (
        <div className="container opacity-85 mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {Object.entries(inventory).map(([key, count]) => {
            const [itemName, itemType] = key.split("-");
            const item = Object.values(crateData.items).find(
              (i) => i.name === itemName && i.type === itemType
            );
            return (
              item && (
                <div key={key} className="relative group cursor-pointer">
                  <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl flex items-center justify-center border-2 border-gray-700">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-48 h-48 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-0 left-0 text-yellow-400 p-2 rounded-full text-sm font-bold">
                      {count}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-75 text-white p-2 rounded-b-lg text-center">
                    <h3 className="text-lg font-bold w-full">{item.name}</h3>
                    <p className="text-gray-400">{item.type}</p>
                  </div>
                </div>
              )
            );
          })}
        </div>
      )}

      {openingCrate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="text-center animate-pulse">
            <img
              src={crateData.crates[openingCrate].image}
              alt="Opening Crate"
              className="w-128 h-128 mx-auto"
            />
            <p className="text-yellow-400 mt-3 text-lg font-semibold">
              Opening...
            </p>
          </div>
        </div>
      )}

      {selectedItem && !openingCrate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full text-center ">
            <img
              src={selectedItem.thumbnail}
              alt={selectedItem.name}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="mt-3">
              <span
                className="inline-block px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: `#${crateData.colors[selectedItem.rarity]}`,
                }}
              >
                {selectedItem.rarity}
              </span>
            </div>
            <h3 className="text-2xl font-bold mt-3">{selectedItem.name}</h3>
            <p className="text-gray-400">Creator: {selectedItem.owner}</p>
            <button
              onClick={() => setSelectedItem(null)}
              onPointerDown={playClickSound}
              onMouseEnter={handleMouseEnter}
              className="mt-5 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition-all"
            >
              Continue Opening
            </button>
          </div>
        </div>
      )}
      <div className=" z-10 bottom-4 w-full text-center text-gray-500">
        <p className="text-sm">
          &copy; Made by <span className="text-yellow-400">d0sob</span>
        </p>
      </div>
    </div>
  );
}

export default App;
