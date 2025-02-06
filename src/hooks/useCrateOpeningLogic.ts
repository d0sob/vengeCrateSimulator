import { useState } from "react";
import crateData from "../data/items.json";

// Custom hook for handling crate opening logic
export const useCrateOpening = () => {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [openingCrate, setOpeningCrate] = useState<string | null>(null);
  const [inventory, setInventory] = useState<Record<string, number>>({});

const openCrate = (
  crateLevel: string,
  setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>,
  setStoredInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>
) => {
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
      setInventory((prev) => {
        const updatedInventory = {
          ...prev,
          [key]: (prev[key] || 0) + 1,
        };
        setStoredInventory(updatedInventory); // Save updated inventory to localStorage
        return updatedInventory;
      });
    }

    setSelectedItem(selectedItem);
    setOpeningCrate(null);
  }, 500);
};



  return { selectedItem, openingCrate, openCrate, setSelectedItem, inventory, setInventory};
};
