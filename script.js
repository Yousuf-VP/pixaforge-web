
/* ==========================================
   KIWAMI — MAIN WEBSITE
   COOKIE EMPEROR — PLAYABLE FIRST BUILD
========================================== */

"use strict";

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// ==========================================
// WEBSITE INITIALIZATION
// ==========================================

const loader = $("#pageLoader");
const header = $("#siteHeader");
const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");

window.addEventListener("load", () => {
  setTimeout(() => loader?.classList.add("loaded"), 450);
});

$("#year").textContent = new Date().getFullYear();

// Decorative stars.
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

// Header scroll effect.
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
  }, {
    rootMargin: "-35% 0px -55% 0px"
  });

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
  }, {
    threshold: 0.12
  });

  $$(".reveal").forEach(element => revealObserver.observe(element));
} else {
  $$(".reveal").forEach(element => element.classList.add("visible"));
}

// ==========================================
// KIWAMI — INFINITE GAME CAROUSEL
// ==========================================

const gamesTrack = $("#gamesTrack");
const carouselWindow = $("#carouselWindow");
const previousButton = $("#carouselPrev");
const nextButton = $("#carouselNext");

let carouselAnimation = null;

function initializeInfiniteCarousel() {
  if (!gamesTrack || gamesTrack.dataset.initialized === "true") {
    return;
  }

  // Collect original cards.
  const originalCards = [...gamesTrack.children];

  if (originalCards.length === 0) return;

  // Put original cards into one group.
  const firstGroup = document.createElement("div");
  firstGroup.className = "games-group";

  originalCards.forEach(card => {
    firstGroup.appendChild(card);
  });

  // Duplicate the group for the seamless loop.
  const secondGroup = firstGroup.cloneNode(true);

  secondGroup.setAttribute("aria-hidden", "true");

  // Prevent duplicate interactive controls from receiving keyboard focus.
  secondGroup.querySelectorAll("button, a, input").forEach(element => {
    element.setAttribute("tabindex", "-1");
  });

  // Replace the original track contents.
  gamesTrack.replaceChildren(firstGroup, secondGroup);

  gamesTrack.dataset.initialized = "true";
}

// Initialize the carousel.
initializeInfiniteCarousel();

// Get the CSS animation.
function getCarouselAnimation() {
  if (!gamesTrack) return null;

  if (!carouselAnimation) {
    carouselAnimation = gamesTrack.getAnimations()[0] || null;
  }

  return carouselAnimation;
}

// Pause when the user hovers over the carousel.
carouselWindow?.addEventListener("mouseenter", () => {
  gamesTrack.style.animationPlayState = "paused";
});

carouselWindow?.addEventListener("mouseleave", () => {
  gamesTrack.style.animationPlayState = "running";
});

// Pause while the user focuses a carousel control.
carouselWindow?.addEventListener("focusin", () => {
  gamesTrack.style.animationPlayState = "paused";
});

carouselWindow?.addEventListener("focusout", event => {
  if (!carouselWindow.contains(event.relatedTarget)) {
    gamesTrack.style.animationPlayState = "running";
  }
});

// Pause on mobile touch.
carouselWindow?.addEventListener("touchstart", () => {
  gamesTrack.style.animationPlayState = "paused";
}, { passive: true });

carouselWindow?.addEventListener("touchend", () => {
  gamesTrack.style.animationPlayState = "running";
}, { passive: true });

carouselWindow?.addEventListener("touchcancel", () => {
  gamesTrack.style.animationPlayState = "running";
}, { passive: true });

// Arrow controls adjust the carousel animation position.
function moveCarousel(direction) {
  const animation = getCarouselAnimation();

  if (!animation || !gamesTrack) return;

  const duration = Number(animation.effect?.getTiming().duration) || 32000;
  const currentTime = Number(animation.currentTime) || 0;

  let nextTime = currentTime + direction * 5000;

  nextTime = ((nextTime % duration) + duration) % duration;

  animation.currentTime = nextTime;
  gamesTrack.style.animationPlayState = "running";
}

previousButton?.addEventListener("click", () => moveCarousel(-1));
nextButton?.addEventListener("click", () => moveCarousel(1));

// ==========================================
// COOKIE EMPEROR — GAME DATA
// ==========================================

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

// ==========================================
// SAVE AND LOAD
// ==========================================

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

    // Offline production: up to 8 hours at 50% production.
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
        showToast(
          `Welcome back! +${formatNumber(offlineCookies)} offline cookies`
        );
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

    localStorage.setItem(
      GAME_SAVE_KEY,
      JSON.stringify(gameState)
    );

    const status = $("#saveStatus");

    if (status) {
      status.textContent = "GAME SAVED";
    }

    if (showMessage) {
      showToast("Kingdom saved successfully.");
    }
  } catch (error) {
    console.error("Could not save Cookie Emperor:", error);
    showToast("Save failed. Check your browser storage.");
  }
}

// ==========================================
// GAME CALCULATIONS
// ==========================================

function getBuildingCount(id) {
  return Math.max(0, Number(gameState.buildings[id]) || 0);
}

function getBuildingCost(building) {
  const owned = getBuildingCount(building.id);

  return Math.ceil(
    building.baseCost * Math.pow(1.15, owned)
  );
}

function getTotalBuildings() {
  return BUILDINGS.reduce((total, building) => {
    return total + getBuildingCount(building.id);
  }, 0);
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

// ==========================================
// GAME RENDERING
// ==========================================

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

  const items = activeShopTab === "buildings"
    ? BUILDINGS
    : UPGRADES;

  items.forEach(item => {
    const isBuilding = activeShopTab === "buildings";

    const owned = isBuilding
      ? getBuildingCount(item.id)
      : 0;

    const purchased = gameState.purchasedUpgrades.includes(item.id);

    const cost = isBuilding
      ? getBuildingCost(item)
      : item.cost;

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

    price.textContent = purchased
      ? "OWNED"
      : `${formatNumber(cost)} cookies`;

    button.append(icon, info, price);

    button.addEventListener("click", () => {
      if (isBuilding) {
        buyBuilding(item.id);
      } else {
        buyUpgrade(item.id);
      }
    });

    shopList.appendChild(button);
  });
}

// ==========================================
// GAME ACTIONS
// ==========================================

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

  gameState.buildings[id] =
    getBuildingCount(id) + 1;

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

// ==========================================
// GAME UI EVENTS
// ==========================================

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

// Launch game from original game card.
$$("[data-launch='cookie']").forEach(button => {
  button.addEventListener("click", openCookieEmperor);
});

$("#closeGame")?.addEventListener("click", closeCookieEmperor);

$("#saveGame")?.addEventListener("click", () => {
  saveGame(true);
});

$("#bakeCookie")?.addEventListener("click", bakeCookie);

// Kingdom naming.
$("#kingdomName")?.addEventListener("input", event => {
  const value = event.target.value.trim().slice(0, 22);

  gameState.kingdomName = value || "Cookie Kingdom";

  $("#kingdomHeading").textContent = gameState.kingdomName;

  saveGame();
});

// Shop tabs.
$$(".shop-tab").forEach(button => {
  button.addEventListener("click", () => {
    activeShopTab = button.dataset.tab;

    $$(".shop-tab").forEach(tab => {
      tab.classList.toggle("active", tab === button);
    });

    renderShop();
  });
});

// Escape key closes game.
document.addEventListener("keydown", event => {
  if (
    event.key === "Escape" &&
    gameOverlay.classList.contains("open")
  ) {
    closeCookieEmperor();
  }
});

// ==========================================
// GAME PRODUCTION
// ==========================================

function gameTick() {
  const production = getCookiesPerSecond();

  if (production <= 0) return;

  gameState.cookies += production;
  gameState.totalBaked += production;

  $("#cookieCount").textContent = formatNumber(gameState.cookies);
  $("#totalBaked").textContent = formatNumber(gameState.totalBaked);

  // Update shop affordability as the player earns cookies.
  if (Math.floor(gameState.cookies) % 5 === 0) {
    renderShop();
  }
}

setInterval(gameTick, 1000);

// Automatic save every 10 seconds.
setInterval(() => {
  saveGame();
}, 10000);

// Save when leaving or hiding the page.
window.addEventListener("pagehide", () => {
  saveGame();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    saveGame();
  }
});

// ==========================================
// GAME NOTIFICATIONS
// ==========================================

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

// ==========================================
// START COOKIE EMPEROR
// ==========================================

loadGame();
renderGame();

console.log("KIWAMI initialized.");
console.log("Infinite game carousel initialized.");
console.log("COOKIE EMPEROR initialized.");
