let items = [];

async function loadItems() {
  const response = await fetch("items.csv");
  const csvData = await response.text();
  items = parseCSV(csvData);
}

function parseCSV(csvData) {
  return csvData
    .trim()
    .split("\n")
    .map((line) => {
      const [imgSrc, skinName, gunName, rarity] = line.split(";");
      return {
        imgSrc: imgSrc.trim(),
        skinName: skinName.trim(),
        gunName: gunName.trim(),
        rarity: rarity.trim(),
      };
    });
}

function startSimulation() {
  const crate = document.getElementById("crate");
  const openCrateButton = document.getElementById("openCrateButton");
  const result = document.getElementById("result");

  openCrateButton.addEventListener("click", () => {
    crate.classList.add("open");

    result.style.display = "none";

    setTimeout(() => {
      const randomItem = items[Math.floor(Math.random() * items.length)];

      result.innerHTML = `
        <img src="${randomItem.imgSrc}" alt="${randomItem.skinName}">
        <h2>${randomItem.skinName}</h2>
        <p>${randomItem.gunName} - <span style="color: ${getRarityColor(
        randomItem.rarity
      )};">${randomItem.rarity}</span></p>
      `;
      result.style.display = "block";
      crate.classList.remove("open");
    }, 1000);
  });
}

function getRarityColor(rarity) {
  switch (rarity) {
    case "Legendary":
      return "#f39c12";
    case "Epic":
      return "#9b59b6";
    case "Rare":
      return "#3498db";
    case "Uncommon":
      return "#2ecc71";
    case "Common":
      return "#bdc3c7";
    default:
      return "#ffffff";
  }
}

loadItems().then(() => {
  console.log("Items loaded:", items);
  startSimulation();
});
