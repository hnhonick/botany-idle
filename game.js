const stages = [
  {
    name: "Seed",
    threshold: 0,
    nextThreshold: 10,
    passiveRate: 0,
    visual: "🌰",
    message: "A sunflower seed is waiting. Give it some light."
  },
  {
    name: "Germination",
    threshold: 10,
    nextThreshold: 25,
    passiveRate: 0,
    visual: "🌰〰️",
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
    visual: "🌱🌿",
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
    visual: "🌿🟢",
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
let moisture = 60;
let currentStageIndex = 0;
let upgradePurchased = false;
let shuttersOpened = false;
let waterUnlocked = false;

const energyDisplay = document.getElementById("energy");
const energyGoalDisplay = document.getElementById("energyGoal");
const stageDisplay = document.getElementById("stage");
const moistureDisplay = document.getElementById("moisture");
const efficiencyDisplay = document.getElementById("efficiency");
const passiveRateDisplay = document.getElementById("passiveRate");
const plantVisual = document.getElementById("plantVisual");
const plantDisplay = document.getElementById("plantDisplay");
const lightButton = document.getElementById("lightButton");
const waterButton = document.getElementById("waterButton");
const openShuttersButton = document.getElementById("openShuttersButton");
const shutters = document.getElementById("shutters");
const sun = document.getElementById("sun");
const growthProgress = document.getElementById("growthProgress");
const messageDisplay = document.getElementById("message");
const moistureStat = document.getElementById("moistureStat");
const efficiencyStat = document.getElementById("efficiencyStat");
const moistureMeterContainer = document.getElementById("moistureMeterContainer");
const moistureMarker = document.getElementById("moistureMarker");

function getCurrentStage() {
  return stages[currentStageIndex];
}

function getMoistureStatus() {
  if (moisture < 40) {
    return "Low";
  }

  if (moisture <= 70) {
    return "Good";
  }

  return "Saturated";
}

function getPhotosynthesisEfficiency() {
  const status = getMoistureStatus();

  if (status === "Low" || status === "Saturated") {
    return 0.5;
  }

  return 1;
}

function getPassiveRate() {
  let rate = getCurrentStage().passiveRate;

  if (upgradePurchased) {
    rate *= 1.25;
  }

  if (waterUnlocked) {
    rate *= getPhotosynthesisEfficiency();
  }

  return rate;
}

function unlockWater() {
  waterUnlocked = true;

  waterButton.hidden = false;
  moistureStat.hidden = false;
  efficiencyStat.hidden = false;
  moistureMeterContainer.hidden = false;
}

function playGrowthAnimation() {
  plantVisual.classList.remove("grow-pulse");

  void plantVisual.offsetWidth;

  plantVisual.classList.add("grow-pulse");
  ]
  
function updateStage() {
  while (
    currentStageIndex < stages.length - 1 &&
    energy >= stages[currentStageIndex + 1].threshold
  ) {
    currentStageIndex += 1;

    const newStage = getCurrentStage();

    messageDisplay.textContent = newStage.message;

    playGrowthAnimation();

    if (newStage.name === "Sprout" && !waterUnlocked) {
      unlockWater();
    }
  }
}

function updateUI() {
  const stage = getCurrentStage();
  const passiveRate = getPassiveRate();
  const efficiency = getPhotosynthesisEfficiency();
  const moistureStatus = getMoistureStatus();

  energyDisplay.textContent = energy.toFixed(1);
  stageDisplay.textContent = stage.name;
  passiveRateDisplay.textContent = passiveRate.toFixed(2);
  plantVisual.textContent = stage.visual;

  if (waterUnlocked) {
    moistureDisplay.textContent = moistureStatus;
    efficiencyDisplay.textContent =
      ${Math.round(efficiency * 100)}%;

    moistureMarker.style.left = ${moisture}%;
  }

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

function openShutters() {
  shuttersOpened = true;

  shutters.classList.remove("closed");
  shutters.classList.add("open");

  plantDisplay.classList.remove("dimmed");

  openShuttersButton.hidden = true;
  lightButton.hidden = false;
  sun.hidden = false;

  plantVisual.textContent = getCurrentStage().visual;

  messageDisplay.textContent =
    "A sunflower seed is waiting. Give it some light.";

  updateUI();
}

function provideLight() {
  if (!shuttersOpened) {
    return;
  }

  if (currentStageIndex === stages.length - 1) {
    return;
  }

  let efficiency = 1;

  if (waterUnlocked) {
    efficiency = getPhotosynthesisEfficiency();
  }

  energy += 1 * efficiency;

  updateStage();
  updateUI();
}

function waterPlant() {
  if (!waterUnlocked) {
    return;
  }

  moisture += 30;

  if (moisture > 100) {
    moisture = 100;
  }

  updateUI();
}

openShuttersButton.addEventListener("click", openShutters);
lightButton.addEventListener("click", provideLight);
waterButton.addEventListener("click", waterPlant);

setInterval(() => {
  if (!shuttersOpened) {
    return;
  }

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
  if (!waterUnlocked) {
    return;
  }

  if (moisture > 0) {
    moisture -= 1;
  }

  updateUI();
}, 3000);

updateUI();
