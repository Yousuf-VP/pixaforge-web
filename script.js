
/* ==========================================
   KIWAMI — MAIN WEBSITE
   + COOKIE EMPEROR — PLAYABLE FIRST BUILD
========================================== */

"use strict";

// ------------------------------------------
// WEBSITE INITIALIZATION
// ------------------------------------------

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const loader = $("#pageLoader");
const header = $("#siteHeader");
const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");

window.addEventListener("load", () => {
  setTimeout(() => loader?.classList.add("loaded"), 450);
});

$("#year").textContent = new Date().getFullYear();

// Generate decorative stars.
const stars = $("#stars");

if (stars) {
  for (let i = 0; i < 55; i++) {
    const star = document.createElement("span");
    star.style.position = "absolute";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.width = `${Math.random() > 0.9 ? 3 : 1}px`;
    star.style.height = star.style.width;
    star.style.borderRadius = "50%";
    star.style.background = "#ffffff";
    star.style.opacity = `${0.2 + Math.random() * 0.65}`;
    stars.appendChild(star);
  }
}

// Header scroll appearance.
window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 25);
}, { passive: true });

// Mobile navigation.
menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

$$(".nav-link, .nav-cta").forEach(link => {
  link.addEventListener("click", () => {
    mainNav?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

// Active navigation section.
const sections = $$("main section[id]");
const navLinks = $$(".nav-link");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      navLinks.forEach(link => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach(section => sectionObserver.observe(section));
}

// Reveal animations.
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach(element => revealObserver.observe(element));
} else {
  $$(".reveal").forEach(element => element.classList.add("visible"));
}

// ------------------------------------------
// GAME CAROUSEL
// ------------------------------------------

const carouselWindow = $("#carouselWindow");
const gamesTrack = $("#gamesTrack");
const carouselProgress = $("#carouselProgress");
const previousButton = $("#carouselPrev");
const nextButton = $("#carouselNext");

let carouselIndex = 0;
let carouselTimer = null;
let carouselPaused = false;

function getCarouselStep() {
  const card = $(".game-card", gamesTrack);
  if (!card) return 0;

  const gap = parseFloat(getComputedStyle(gamesTrack).gap) || 0;
  return card.getBoundingClientRect().width + gap;
}

function getMaxCarouselIndex() {
  if (!gamesTrack || !carouselWindow) return 0;

  const maxScroll = gamesTrack.scrollWidth - carouselWindow.clientWidth;
  return Math.max(0, Math.ceil(maxScroll / getCarouselStep()));
}

function updateCarousel() {
  if (!gamesTrack || !carouselProgress) return;

  const maxIndex = getMaxCarouselIndex();
  carouselIndex = Math.min(carouselIndex, maxIndex);

  const step = getCarouselStep();
  gamesTrack.style.transform = `translateX(-${carouselIndex * step}px)`;

  const progress = maxIndex === 0
    ? 100
    : ((carouselIndex + 1) / (maxIndex + 1)) * 100;

  carouselProgress.style.width = `${progress}%`;
}

function moveCarousel(direction) {
  const maxIndex = getMaxCarouselIndex();
  if (maxIndex === 0) return;

  carouselIndex += direction;

  if (carouselIndex > maxIndex) carouselIndex = 0;
  if (carouselIndex < 0) carouselIndex = maxIndex;

  updateCarousel();
}

previousButton?.addEventListener("click", () => moveCarousel(-1));
nextButton?.addEventListener("click", () => moveCarousel(1));

function stopCarouselTimer() {
  if (carouselTimer) clearInterval(carouselTimer);
  carouselTimer = null;
}

function startCarouselTimer() {
  stopCarouselTimer();

  if (carouselPaused || getMaxCarouselIndex() === 0) return;

  carouselTimer = setInterval(() => {
    if (!carouselPaused) moveCarousel(1);
  }, 4500);
}

carouselWindow?.addEventListener("mouseenter", () => {
  carouselPaused = true;
  stopCarouselTimer();
});

carouselWindow?.addEventListener("mouseleave", () => {
  carouselPaused = false;
  startCarouselTimer();
});

carouselWindow?.addEventListener("focusin", () => {
  carouselPaused = true;
  stopCarouselTimer();
});

carouselWindow?.addEventListener("focusout", () => {
  carouselPaused = false;
  startCarouselTimer();
});

// Basic touch swipe.
let touchStartX = 0;

carouselWindow?.addEventListener("touchstart", event => {
  touchStartX = event.changedTouches[0].clientX;
  carouselPaused = true;
  stopCarouselTimer();
}, { passive: true });

carouselWindow?.addEventListener("touchend", event => {
  const difference = touchStartX - event.changedTouches[0].clientX;

  if (Math.abs(difference) > 40) {
    moveCarousel(difference > 0 ? 1 : -1);
  }

  carouselPaused = false;
  startCarouselTimer();
}, { passive: true });

window.addEventListener("resize", () => {
  carouselIndex = 0;
  updateCarousel();
  startCarouselTimer();
});

updateCarousel();
startCarouselTimer();

// ------------------------------------------
// COOKIE EMPEROR — GAME DATA
// ------------------------------------------

const GAME_SAVE_KEY = "pixaforge_cookie_emperor_economy_v1";

const BUILDINGS = [
  {
    id: "bakery",
    name: "Small Bakery",
    description: "Produces fresh cookies.",
    icon: "⌂",
    baseCost: 15,
    production: 0.2
  },
  {
    id: "farm",
    name: "Cookie Farm",
    description: "Grows ingredients for production.",
    icon: "♧",
    baseCost: 100,
    production: 1.5
  },
  {
    id: "factory",
    name: "Cookie Factory",
    description: "Mass-produces royal cookies.",
    icon: "⚙",
    baseCost: 600,
    production: 8
  },
  {
    id: "castle",
    name: "Royal Castle",
    description: "The heart of your cookie empire.",
    icon: "♜",
    baseCost: 3500,
    production: 35
  },
  {
    id: "temple",
    name: "Cookie Temple",
    description: "Blesses your kingdom with production.",
    icon: "♛",
    baseCost: 18000,
    production: 150
  }
];

const UPGRADES = [
  {
    id: "strongHands",
    name: "Strong Hands",
    description: "Double cookies earned per click.",
    icon: "✊",
    cost: 50,
    type: "click",
    multiplier: 2
  },
  {
    id: "goldenOven",
    name: "Golden Oven",
    description: "Increase all production by 25%.",
    icon: "♨",
    cost: 250,
    type: "production",
    multiplier: 1.25
  },
  {
    id: "royalRecipe",
    name: "Royal Recipe",
    description: "Double your cookie clicking power.",
    icon: "✦",
    cost: 1200,
    type: "click",
    multiplier: 2
  },
  {
    id: "emperorBlessing",
    name: "Emperor's Blessing",
    description: "Increase all production by 50%.",
    icon: "♛",
    cost: 5000,
    type: "production",
    multiplier: 1.5
  }
];

function createInitialGameState() {
  return {
    cookies: 0,
    totalBaked: 0,
    clickPower: 1,
    productionMultiplier: 1,
    buildings: {},
    purchasedUpgrades: [],
    kingdomName: "Cookie Kingdom",
    lastSaved: Date.now()
  };
}

let gameState = createInitialGameState();
let activeShopTab = "upgrades";
let toastTimeout = null;

function loadGame() {
  try {
    const saved = localStorage.getItem(GAME_SAVE_KEY);

    if (!saved) return;

    const parsed = JSON.parse(saved);

    if (!parsed || typeof parsed !== "object") return;

    const initial = createInitialGameState();

    gameState = {
      ...initial,
      ...parsed,
      buildings: {
        ...initial.buildings,
        ...(parsed.buildings || {})
      },
      purchasedUpgrades: Array.isArray(parsed.purchasedUpgrades)
        ? parsed.purchasedUpgrades
        : []
    };

    gameState.cookies = Math.max(0, Number(gameState.cookies) || 0);
    gameState.totalBaked = Math.max(0, Number(gameState.totalBaked) || 0);
    gameState.clickPower = Math.max(1, Number(gameState.clickPower) || 1);
    gameState.productionMultiplier = Math.max(
      1,
      Number(gameState.productionMultiplier) || 1
    );

    // Offline production: maximum 8 hours at 50% production.
    const elapsedSeconds = Math.max(
      0,
      (Date.now() - Number(gameState.lastSaved || Date.now())) / 1000
    );

    const offlineSeconds = Math.min(elapsedSeconds, 8 * 60 * 60);
    const offlineCookies = offlineSeconds * getCookiesPerSecond() * 0.5;

    if (offlineCookies > 0) {
      gameState.cookies += offlineCookies;
      gameState.totalBaked += offlineCookies;

      setTimeout(() => {
        showToast(`Welcome back! +${formatNumber(offlineCookies)} offline cookies`);
      }, 500);
    }
  } catch (error) {
    console.warn("Could not load Cookie Emperor save:", error);
    gameState = createInitialGameState();
  }
}

function saveGame(showMessage = false) {
  try {
    gameState.lastSaved = Date.now();
    localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(gameState));

    const status = $("#saveStatus");
    if (status) status.textContent = "GAME SAVED";

    if (showMessage) showToast("Kingdom saved successfully.");
  } catch (error) {
    console.error("Could not save Cookie Emperor:", error);
    showToast("Save failed. Check your browser storage.");
  }
}

// ------------------------------------------
// GAME CALCULATIONS
// ------------------------------------------

function getBuildingCount(id) {
  return Math.max(0, Number(gameState.buildings[id]) || 0);
}

function getBuildingCost(building) {
  const owned = getBuildingCount(building.id);
  return Math.ceil(building.baseCost * Math.pow(1.15, owned));
}

function getTotalBuildings() {
  return BUILDINGS.reduce(
    (total, building) => total + getBuildingCount(building.id),
    0
  );
}

function getCookiesPerSecond() {
  const baseProduction = BUILDINGS.reduce((total, building) => {
    return total + getBuildingCount(building.id) * building.production;
  }, 0);

  return baseProduction * gameState.productionMultiplier;
}

function formatNumber(number) {
  if (!Number.isFinite(number)) return "0";

  if (number < 1000) {
    return number.toLocaleString("en-IN", {
      maximumFractionDigits: number < 10 ? 1 : 0
    });
  }

  const units = [
    { value: 1e12, suffix: "T" },
    { value: 1e9, suffix: "B" },
    { value: 1e6, suffix: "M" },
    { value: 1e3, suffix: "K" }
  ];

  for (const unit of units) {
    if (number >= unit.value) {
      return `${(number / unit.value).toFixed(2)}${unit.suffix}`;
    }
  }

  return Math.floor(number).toString();
}

// ------------------------------------------
// GAME RENDERING
// ------------------------------------------

function renderGame() {
  const cps = getCookiesPerSecond();

  $("#cookieCount").textContent = formatNumber(gameState.cookies);
  $("#totalBaked").textContent = formatNumber(gameState.totalBaked);
  $("#perClick").textContent = formatNumber(gameState.clickPower);
  $("#cps").textContent = formatNumber(cps);
  $("#sideCps").textContent = formatNumber(cps);
  $("#buildingCount").textContent = formatNumber(getTotalBuildings());

  $("#kingdomName").value = gameState.kingdomName;
  $("#kingdomHeading").textContent = gameState.kingdomName;

  renderShop();
}

function renderShop() {
  const shopList = $("#shopList");
  if (!shopList) return;

  shopList.replaceChildren();

  const items = activeShopTab === "buildings" ? BUILDINGS : UPGRADES;

  items.forEach(item => {
    const isBuilding = activeShopTab === "buildings";
    const owned = isBuilding ? getBuildingCount(item.id) : 0;
    const purchased = gameState.purchasedUpgrades.includes(item.id);
    const cost = isBuilding ? getBuildingCost(item) : item.cost;
    const unavailable = gameState.cookies < cost || purchased;

    const button = document.createElement("button");
    button.className = "shop-item";
    button.disabled = unavailable;

    const icon = document.createElement("span");
    icon.className = "shop-item-icon";
    icon.textContent = item.icon;

    const info = document.createElement("span");
    info.className = "shop-item-info";

    const name = document.createElement("strong");
    name.textContent = item.name;

    const description = document.createElement("small");
    description.textContent = isBuilding
      ? `${item.description} Owned: ${owned}`
      : purchased
        ? "Already purchased"
        : item.description;

    info.append(name, description);

    const price = document.createElement("span");
    price.className = "shop-item-cost";
    price.textContent = purchased ? "OWNED" : `${formatNumber(cost)} cookies`;

    button.append(icon, info, price);

    button.addEventListener("click", () => {
      if (isBuilding) buyBuilding(item.id);
      else buyUpgrade(item.id);
    });

    shopList.appendChild(button);
  });
}

// ------------------------------------------
// GAME ACTIONS
// ------------------------------------------

function bakeCookie() {
  gameState.cookies += gameState.clickPower;
  gameState.totalBaked += gameState.clickPower;

  updateGameNumbers();
}

function updateGameNumbers() {
  const cps = getCookiesPerSecond();

  $("#cookieCount").textContent = formatNumber(gameState.cookies);
  $("#totalBaked").textContent = formatNumber(gameState.totalBaked);
  $("#cps").textContent = formatNumber(cps);
  $("#sideCps").textContent = formatNumber(cps);
  $("#perClick").textContent = formatNumber(gameState.clickPower);
  $("#buildingCount").textContent = formatNumber(getTotalBuildings());

  renderShop();
}

function buyBuilding(id) {
  const building = BUILDINGS.find(item => item.id === id);
  if (!building) return;

  const cost = getBuildingCost(building);

  if (gameState.cookies < cost) {
    showToast("Not enough cookies!");
    return;
  }

  gameState.cookies -= cost;
  gameState.buildings[id] = getBuildingCount(id) + 1;

  updateGameNumbers();
  saveGame();
  showToast(`${building.name} added to your kingdom!`);
}

function buyUpgrade(id) {
  const upgrade = UPGRADES.find(item => item.id === id);
  if (!upgrade) return;

  if (gameState.purchasedUpgrades.includes(id)) return;

  if (gameState.cookies < upgrade.cost) {
    showToast("Not enough cookies!");
    return;
  }

  gameState.cookies -= upgrade.cost;
  gameState.purchasedUpgrades.push(id);

  if (upgrade.type === "click") {
    gameState.clickPower *= upgrade.multiplier;
  }

  if (upgrade.type === "production") {
    gameState.productionMultiplier *= upgrade.multiplier;
  }

  updateGameNumbers();
  saveGame();
  showToast(`${upgrade.name} unlocked!`);
}

// ------------------------------------------
// GAME UI EVENTS
// ------------------------------------------

const gameOverlay = $("#cookieGame");

function openCookieEmperor() {
  gameOverlay.classList.add("open");
  gameOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  renderGame();
  saveGame();
}

function closeCookieEmperor() {
  gameOverlay.classList.remove("open");
  gameOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  saveGame();
}

$$("[data-launch='cookie']").forEach(button => {
  button.addEventListener("click", openCookieEmperor);
});

$("#closeGame")?.addEventListener("click", closeCookieEmperor);

$("#saveGame")?.addEventListener("click", () => saveGame(true));

$("#bakeCookie")?.addEventListener("click", bakeCookie);

$("#kingdomName")?.addEventListener("input", event => {
  const value = event.target.value.trim().slice(0, 22);

  gameState.kingdomName = value || "Cookie Kingdom";
  $("#kingdomHeading").textContent = gameState.kingdomName;
  saveGame();
});

$$(".shop-tab").forEach(button => {
  button.addEventListener("click", () => {
    activeShopTab = button.dataset.tab;

    $$(".shop-tab").forEach(tab => {
      tab.classList.toggle("active", tab === button);
    });

    renderShop();
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && gameOverlay.classList.contains("open")) {
    closeCookieEmperor();
  }
});

// ------------------------------------------
// GAME PRODUCTION & AUTO-SAVING
// ------------------------------------------

function gameTick() {
  const production = getCookiesPerSecond();

  if (production > 0) {
    const earned = production;

    gameState.cookies += earned;
    gameState.totalBaked += earned;

    $("#cookieCount").textContent = formatNumber(gameState.cookies);
    $("#totalBaked").textContent = formatNumber(gameState.totalBaked);

    // Refresh shop affordability.
    if (Math.floor(gameState.cookies) % 5 === 0) {
      renderShop();
    }
  }
}

setInterval(gameTick, 1000);
setInterval(() => saveGame(), 10000);

// Save when leaving or hiding the page.
window.addEventListener("pagehide", () => saveGame());

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveGame();
});

// ------------------------------------------
// GAME TOAST
// ------------------------------------------

function showToast(message) {
  const toast = $("#gameToast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// ------------------------------------------
// START COOKIE EMPEROR
// ------------------------------------------

loadGame();
renderGame();

console.log("KIWAMI initialized.");
console.log("COOKIE EMPEROR initialized.");
