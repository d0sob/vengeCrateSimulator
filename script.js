let items = [];

const crateTiers = [
  {
    name: "Basic Crate",
    dropRates: { Common: 60, Uncommon: 25, Rare: 10, Legendary: 4, Mythical: 1 },
    price: 250,
  },
  {
    name: "Advanced Crate",
    dropRates: { Common: 40, Uncommon: 30, Rare: 20, Legendary: 8, Mythical: 2 },
    price: 500,
  },
  {
    name: "Elite Crate",
    dropRates: { Common: 20, Uncommon: 25, Rare: 30, Legendary: 15, Mythical: 10 },
    price: 750,
  },
];

async function loadItems() {
  try {
    const response = await fetch("items.csv");
    if (!response.ok) throw new Error("Failed to fetch items.csv");
    const csvData = await response.text();
    items = parseCSV(csvData);
  } catch (error) {
    console.error("Error loading items:", error);
  }
}

function parseCSV(csvData) {
  return csvData
    .trim()
    .split("\n")
    .map((line) => {
      const [imgSrc, skinName, gunName, rarity] = line.split(";");
      if (!imgSrc || !skinName || !gunName || !rarity) {
        console.warn("Invalid line in CSV:", line);
        return null;
      }
      return {
        imgSrc: imgSrc.trim(),
        skinName: skinName.trim(),
        gunName: gunName.trim(),
        rarity: rarity.trim(),
      };
    })
    .filter((item) => item !== null); // Remove invalid entries
}

function startSimulation() {
  const crate = document.getElementById("crate");
  const openCrateButton = document.getElementById("openCrateButton");
  const result = document.getElementById("result");

  // Select crate tier from dropdown or default to Basic Crate
  const crateTierSelect = document.getElementById("crateTierSelect");
  let selectedTier = crateTiers[0]; // Default to Basic Crate

  // Update selectedTier based on user selection
  crateTierSelect.addEventListener("change", (event) => {
    const selectedCrateName = event.target.value;
    selectedTier = crateTiers.find((tier) => tier.name === selectedCrateName) || crateTiers[0];
    console.log("Selected Crate:", selectedTier.name);
  });

  openCrateButton.addEventListener("click", () => {
    if (items.length === 0) {
      console.error("No items loaded. Check items.csv file.");
      return;
    }

    // Select a random rarity based on the selected crate tier
    const randomRarity = getRandomRarity(selectedTier.dropRates);
    const filteredItems = items.filter((item) => item.rarity === randomRarity);
    const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];

    crate.classList.add("open");

    result.style.display = "none";

    setTimeout(() => {
      result.innerHTML = `
        <img src="${randomItem.imgSrc}" alt="${randomItem.skinName}">
        <h2>${randomItem.skinName}</h2>
        <p>${randomItem.gunName} - <span style="color: ${getRarityColor(randomItem.rarity)};">${randomItem.rarity}</span></p>
      `;
      result.style.display = "block";
      crate.classList.remove("open");
    }, 1000);
  });
}

function getRandomRarity(dropRates) {
  const random = Math.random() * 100;
  let cumulative = 0;

  for (const [rarity, rate] of Object.entries(dropRates)) {
    cumulative += rate;
    if (random <= cumulative) {
      return rarity;
    }
  }

  return "Common"; // Fallback in case of an error
}

function getRarityColor(rarity) {
  switch (rarity) {
    case "Common":
      return "#0000FF"; // Blue
    case "Uncommon":
      return "#008000"; // Green
    case "Rare":
      return "#00008B"; // Dark Blue
    case "Legendary":
      return "#800080"; // Purple
    case "Mythical":
      return "#FF0000"; // Red
    default:
      return "#FFFFFF"; // Default White
  }
}

loadItems().then(() => {
  console.log("Items loaded:", items);
  startSimulation();
});

