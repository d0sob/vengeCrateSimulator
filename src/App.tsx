import React, { useState, useEffect } from "react";
import CrateBox from "./components/CrateBox";
import Inventory from "./components/Inventory";
import Modal from "./components/Modal";
import Header from "./components/Header";
import Background from "./components/Background"; // Import the new Background component
import crateData from "./data/items.json";

const App: React.FC = () => {
  const [openingCrate, setOpeningCrate] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [showInventory, setShowInventory] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

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

  // Handle music toggle
  useEffect(() => {
    const audio = new Audio("./bg_music.mp3");
    audio.loop = true;
    audio.volume = 0.2;

    if (isAudioPlaying) {
      audio.play().catch((err) => console.log("Audio play error:", err));
    } else {
      audio.pause();
    }

    return () => audio.pause();
  }, [isAudioPlaying]);

  const toggleAudio = () => setIsAudioPlaying((prev) => !prev);
  const toggleInventory = () => setShowInventory((prev) => !prev);

  // Handle crate opening logic
  const openCrate = (crateLevel: string) => {
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
        const key = `${selectedItem.name}-${selectedItem.type}`;
        setInventory((prev) => ({
          ...prev,
          [key]: (prev[key] || 0) + 1,
        }));
      }

      setSelectedItem(selectedItem);
      setOpeningCrate(null);
    }, 500);
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center py-10">
      {/* Background Component */}
      <Background />

      {/* Header Section */}
      <Header
        toggleInventory={toggleInventory}
        toggleAudio={toggleAudio}
        isAudioPlaying={isAudioPlaying}
        showInventory={showInventory}
      />

      {/* Crate List or Inventory */}
      {!showInventory ? (
        <div className="container opacity-85 mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {Object.entries(crateData.crates).map(([level, crate]) => (
            <CrateBox
              key={level}
              level={level}
              name={crate.name}
              image={crate.image}
              rarityDrops={crate.rarityDrops}
              itemCount={inventory[crate.name] || 0}
              onOpen={() => openCrate(level)}
            />
          ))}
        </div>
      ) : (
        <Inventory inventory={inventory} />
      )}

      {/* Modals for opening crates and revealing items */}
      <Modal
        openingCrate={openingCrate}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />

      {/* Footer */}
      <div className="z-10 bottom-4 w-full text-center text-gray-500">
        <p className="text-sm">
          &copy; Made by <span className="text-yellow-400">d0sob</span>
        </p>
      </div>
    </div>
  );
};

export default App;
