import { useState, useEffect } from "react";

// Custom hook to handle inventory state with localStorage
export const useInventoryStorage = () => {
  const [inventory, setInventory] = useState<Record<string, number>>({});

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

  return { inventory, setInventory };
};
