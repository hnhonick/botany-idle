const stages = [
  {
    name: "Seed",
    threshold: 0,
    nextThreshold: 10,
    passiveRate: 0,
    visual: "🌱",
    message: "A seed is waiting. Give it some light."
  },
  {
    name: "Germination",
    threshold: 10,
    nextThreshold: 25,
    passiveRate: 0,
    visual: "🌱",
    message: "Germination has begun."
  },
  {
    name: "Sprout",
    threshold: 25,
    nextThreshold: 50,
    passiveRate: 0,
    visual: "🌱",
    message: "A shoot has emerged. The young root can now absorb water."
  },
  {
    name: "Seedling",
    threshold: 50,
    nextThreshold: 90,
    passiveRate: 0.5,
    visual: "🌿",
    message: "The first leaves have opened. Passive photosynthesis has begun."
  },
  {
    name: "Vegetative Growth",
    threshold: 90,
    nextThreshold: 140,
    passiveRate: 1,
    visual: "🌿",
    message: "More leaves are developing, increasing photosynthetic capacity."
  },
  {
    name: "Bud",
    threshold: 140,
    nextThreshold: 200,
    passiveRate: 1,
    visual: "🌻",
    message: "A flower bud has formed."
  },
  {
    name: "Flower",
    threshold: 200,
    nextThreshold: 260,
    passiveRate: 1,
    visual: "🌻",
    message: "First Flower! Your sunflower has bloomed."
  },
  {
    name: "Seeds",
    threshold: 260,
    nextThreshold: null,
    passiveRate: 0,
    visual: "🌻",
    message: "First Sunflower Complete! Your sunflower has produced seeds."
  }
];

let energy = 0;
let moisture = "Not needed yet";
let currentStageIndex = 0;
let upgradePurchased = false;

const energyDisplay = document.getElementById("energy");
const energyGoalDisplay = document.getElementById("energyGoal");
const efficiencyDisplay = document.getElementById("efficiency");
const stageDisplay = document.getElementById("stage");
const moistureDisplay = document.getElementById("moisture");
const passiveRateDisplay = document.getElementById("passiveRate");
const plantVisual = document.getElementById("plantVisual");
const lightButton = document.getElementById("lightButton");
const waterButton = document.getElementById("waterButton");
const growthProgress = document.getElementById("growthProgress");
const messageDisplay = document.getElementById("message");

function getCurrentStage() {
  return stages[currentStageIndex];
}

function updateStage() {
  while (
    currentStageIndex < stages.length - 1 &&
    energy >= stages[currentStageIndex + 1].threshold
  ) {
    currentStageIndex += 1;

    const newStage = getCurrentStage();
    messageDisplay.textContent = newStage.message;

    if (newStage.name === "Sprout") {
      moisture = "Good";
      waterButton.hidden = false;
    }
  }
}

function getPassiveRate() {
  let rate = getCurrentStage().passiveRate;

  if (upgradePurchased) {
    rate *= 1.25;
  }

  if (moisture === "Low" || moisture === "Saturated") {
    rate *= 0.5;
  }

  return rate;
}

function updateUI() {
  const stage = getCurrentStage();
  const passiveRate = getPassiveRate();

  energyDisplay.textContent = energy.toFixed(1);
  stageDisplay.textContent = stage.name;
  moistureDisplay.textContent = moisture;
  passiveRateDisplay.textContent = passiveRate.toFixed(2);
  plantVisual.textContent = stage.visual;

  if (stage.nextThreshold !== null) {
    energyGoalDisplay.textContent = stage.nextThreshold;

    growthProgress.max =
      stage.nextThreshold - stage.threshold;

    growthProgress.value =
      energy - stage.threshold;
  } else {
    energyGoalDisplay.textContent = "Complete";
    growthProgress.max = 1;
    growthProgress.value = 1;
  }
}

function provideLight() {
  if (currentStageIndex === stages.length - 1) {
    return;
  }

  energy += 1;
  updateStage();
  updateUI();
}

function waterPlant() {
  if (moisture === "Low") {
    moisture = "Good";
  } else if (moisture === "Good") {
    moisture = "Saturated";
  } else if (moisture === "Saturated") {
    moisture = "Saturated";
  }

  updateUI();
}

lightButton.addEventListener("click", provideLight);
waterButton.addEventListener("click", waterPlant);

setInterval(() => {
  if (currentStageIndex === stages.length - 1) {
    return;
  }

  const passiveRate = getPassiveRate();

  if (passiveRate > 0) {
    energy += passiveRate;
    updateStage();
    updateUI();
  }
}, 1000);

setInterval(() => {
  if (moisture === "Saturated") {
    moisture = "Good";
  } else if (moisture === "Good") {
    moisture = "Low";
  }

  updateUI();
}, 30000);

updateUI();
