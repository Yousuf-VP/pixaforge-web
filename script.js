
"use strict";

/* =========================================
   KIWAMI — MAIN JAVASCRIPT
========================================= */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

/* =========================================
   PAGE INITIALIZATION
========================================= */

const pageLoader = $("#pageLoader");

window.addEventListener("load", () => {
  pageLoader?.classList.add("loaded");
});

$("#year").textContent = new Date().getFullYear();

const header = $("#siteHeader");

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 30);
});

/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

$$(".main-nav a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", event => {
  if (
    mainNav?.classList.contains("open") &&
    !mainNav.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

/* =========================================
   SCROLL REVEAL
========================================= */

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

/* =========================================
   ACTIVE NAVIGATION
========================================= */

const pageSections = $$("main section[id]");
const navLinks = $$(".main-nav a");

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

pageSections.forEach(section => sectionObserver.observe(section));

/* =========================================
   INFINITE GAME CAROUSEL

   The HTML contains two identical groups.
   Each group has exactly the same width.
   Moving the track by -50% returns it to
   the exact starting position, creating
   a seamless continuous loop.
========================================= */

const gamesTrack = $("#gamesTrack");
const carouselWindow = $("#carouselWindow");
const carouselPrev = $("#carouselPrev");
const carouselNext = $("#carouselNext");

let carouselAnimation = null;

function getCarouselAnimation() {
  if (!gamesTrack) return null;

  if (!carouselAnimation) {
    carouselAnimation = gamesTrack.getAnimations().find(animation => {
      return animation.effect?.getTiming().duration !== undefined;
    }) || null;
  }

  return carouselAnimation;
}

function shiftCarousel(direction) {
  const animation = getCarouselAnimation();

  if (!animation) return;

  const timing = animation.effect.getTiming();
  const duration = Number(timing.duration);

  if (!Number.isFinite(duration) || duration <= 0) return;

  const currentTime = Number(animation.currentTime || 0);
  const shiftAmount = duration * 0.12;

  animation.currentTime = direction === "next"
    ? currentTime + shiftAmount
    : currentTime - shiftAmount;
}

carouselNext?.addEventListener("click", () => {
  shiftCarousel("next");
});

carouselPrev?.addEventListener("click", () => {
  shiftCarousel("previous");
});

// Keep the animation moving when the user is not interacting.
// CSS pauses it while the pointer is over the carousel.
carouselWindow?.addEventListener("mouseenter", () => {
  gamesTrack.style.animationPlayState = "paused";
});

carouselWindow?.addEventListener("mouseleave", () => {
  gamesTrack.style.animationPlayState = "running";
});

/* =========================================
   SHOOT-STREAK ARCADE GAME
========================================= */

const shootModal = $("#shootModal");
const closeShoot = $("#closeShoot");
const startShoot = $("#startShoot");
const shootArena = $("#shootArena");
const shootTarget = $("#shootTarget");
const arenaMessage = $("#arenaMessage");

const scoreDisplay = $("#shootScore");
const timeDisplay = $("#shootTime");
const streakDisplay = $("#shootStreak");
const bestDisplay = $("#shootBest");

const BEST_SCORE_KEY = "kiwami_shoot_streak_best_v1";

let shootScore = 0;
let shootStreak = 0;
let shootTime = 30;
let shootTimer = null;
let gameRunning = false;

let bestScore = Number(localStorage.getItem(BEST_SCORE_KEY)) || 0;

bestDisplay.textContent = bestScore;

function openShootGame() {
  shootModal.classList.add("open");
  shootModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  resetShootGame();
}

function closeShootGame() {
  shootModal.classList.remove("open");
  shootModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  stopShootGame();
}

function resetShootGame() {
  stopShootGame();

  shootScore = 0;
  shootStreak = 0;
  shootTime = 30;

  updateShootHUD();

  shootTarget.classList.remove("show");
  arenaMessage.style.display = "flex";

  arenaMessage.innerHTML = `
    <h3>READY?</h3>
    <p>Hit as many targets as you can in 30 seconds.</p>
    <button class="button button-primary" id="startShoot">START GAME</button>
  `;

  $("#startShoot").addEventListener("click", startShootGame);
}

function updateShootHUD() {
  scoreDisplay.textContent = shootScore;
  timeDisplay.textContent = shootTime;
  streakDisplay.textContent = shootStreak;
  bestDisplay.textContent = bestScore;
}

function moveShootTarget() {
  const arenaRect = shootArena.getBoundingClientRect();
  const targetSize = shootTarget.offsetWidth || 48;

  const maxX = Math.max(0, arenaRect.width - targetSize);
  const maxY = Math.max(0, arenaRect.height - targetSize);

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  shootTarget.style.left = `${x}px`;
  shootTarget.style.top = `${y}px`;
}

function startShootGame() {
  if (gameRunning) return;

  gameRunning = true;
  shootScore = 0;
  shootStreak = 0;
  shootTime = 30;

  arenaMessage.style.display = "none";
  shootTarget.classList.add("show");

  moveShootTarget();
  updateShootHUD();

  shootTimer = window.setInterval(() => {
    shootTime--;
    updateShootHUD();

    if (shootTime <= 0) {
      endShootGame();
    }
  }, 1000);
}

function stopShootGame() {
  gameRunning = false;

  if (shootTimer !== null) {
    clearInterval(shootTimer);
    shootTimer = null;
  }

  shootTarget.classList.remove("show");
}

function endShootGame() {
  stopShootGame();

  if (shootScore > bestScore) {
    bestScore = shootScore;
    localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
  }

  updateShootHUD();

  arenaMessage.style.display = "flex";
  arenaMessage.innerHTML = `
    <h3>TIME'S UP!</h3>
    <p>
      Final score: <strong>${shootScore}</strong><br>
      Best streak: <strong>${shootStreak}</strong>
    </p>
    <button class="button button-primary" id="restartShoot">PLAY AGAIN</button>
  `;

  $("#restartShoot").addEventListener("click", startShootGame);
}

function hitShootTarget(event) {
  event.preventDefault();

  if (!gameRunning) return;

  shootScore += 10;
  shootStreak++;

  updateShootHUD();
  moveShootTarget();
}

shootTarget.addEventListener("pointerdown", hitShootTarget);

$$(".play-game").forEach(button => {
  button.addEventListener("click", openShootGame);
});

closeShoot.addEventListener("click", closeShootGame);

$$("[data-close-game]").forEach(element => {
  element.addEventListener("click", closeShootGame);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && shootModal.classList.contains("open")) {
    closeShootGame();
  }
});

startShoot?.addEventListener("click", startShootGame);

/* =========================================
   PREVENT ACCIDENTAL DOUBLE GAME STARTS
========================================= */

shootModal.addEventListener("transitionend", () => {
  if (!shootModal.classList.contains("open")) {
    stopShootGame();
  }
});
