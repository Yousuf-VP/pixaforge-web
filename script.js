
"use strict";

/* =========================================
   KIWAMI — MAIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------------------
     CURRENT YEAR
  --------------------------------------- */

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* ---------------------------------------
     MOBILE NAVIGATION
  --------------------------------------- */

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".nav-link, .nav-contact");

  function closeMobileMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    mainNav.classList.remove("is-open");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation menu" : "Close navigation menu"
      );

      mainNav.classList.toggle("is-open", !isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    document.addEventListener("click", (event) => {
      const clickedInsideNav =
        mainNav.contains(event.target) || menuToggle.contains(event.target);

      if (!clickedInsideNav) {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 680) {
        closeMobileMenu();
      }
    });
  }


  /* ---------------------------------------
     HEADER SCROLL EFFECT
  --------------------------------------- */

  const siteHeader = document.getElementById("siteHeader");

  function updateHeader() {
    if (!siteHeader) return;

    if (window.scrollY > 30) {
      siteHeader.classList.add("header-scrolled");
    } else {
      siteHeader.classList.remove("header-scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();


  /* ---------------------------------------
     SCROLL REVEAL
  --------------------------------------- */

  const revealElements = document.querySelectorAll(".reveal");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }


  /* ---------------------------------------
     ACTIVE NAVIGATION LINK
  --------------------------------------- */

  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.id;

          document.querySelectorAll(".nav-link").forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${currentId}`;

            link.classList.toggle("active", isActive);
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px"
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }


  /* ---------------------------------------
     GAME CAROUSEL CONTROLS
  --------------------------------------- */

  const gamesWindow = document.getElementById("gamesWindow");
  const gamesTrack = document.getElementById("gamesTrack");
  const gamesPrev = document.getElementById("gamesPrev");
  const gamesNext = document.getElementById("gamesNext");

  function scrollGames(direction) {
    if (!gamesWindow) return;

    const card = gamesWindow.querySelector(".game-card");
    const cardWidth = card ? card.getBoundingClientRect().width : 300;
    const gap = window.innerWidth <= 680 ? 13 : 20;

    gamesWindow.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth"
    });
  }

  if (gamesPrev) {
    gamesPrev.addEventListener("click", () => {
      scrollGames(-1);
    });
  }

  if (gamesNext) {
    gamesNext.addEventListener("click", () => {
      scrollGames(1);
    });
  }

  // Pause the desktop marquee when the user interacts with it.
  if (gamesTrack && gamesWindow) {
    gamesWindow.addEventListener("focusin", () => {
      gamesTrack.style.animationPlayState = "paused";
    });

    gamesWindow.addEventListener("focusout", () => {
      gamesTrack.style.animationPlayState = "";
    });
  }


  /* =======================================
     SHOOT-STREAK MINI GAME
  ======================================= */

  const shootModal = document.getElementById("shootModal");
  const closeShoot = document.getElementById("closeShoot");
  const shootArena = document.getElementById("shootArena");
  const shootTarget = document.getElementById("shootTarget");
  const arenaMessage = document.getElementById("arenaMessage");
  const startShoot = document.getElementById("startShoot");

  const scoreDisplay = document.getElementById("shootScore");
  const timeDisplay = document.getElementById("shootTime");
  const streakDisplay = document.getElementById("shootStreak");
  const bestDisplay = document.getElementById("shootBest");

  const playButtons = document.querySelectorAll(".play-game");

  let score = 0;
  let streak = 0;
  let timeLeft = 30;
  let gameRunning = false;
  let gameTimer = null;
  let bestScore = 0;
  let previousFocus = null;

  const BEST_SCORE_KEY = "kiwami_shoot_streak_best";

  // Load the saved best score safely.
  try {
    bestScore = Number(localStorage.getItem(BEST_SCORE_KEY)) || 0;
  } catch (error) {
    bestScore = 0;
  }

  function updateGameStats() {
    if (scoreDisplay) scoreDisplay.textContent = score;
    if (timeDisplay) timeDisplay.textContent = timeLeft;
    if (streakDisplay) streakDisplay.textContent = streak;
    if (bestDisplay) bestDisplay.textContent = bestScore;
  }

  updateGameStats();


  /* OPEN GAME */

  function openShootGame() {
    if (!shootModal) return;

    previousFocus = document.activeElement;

    shootModal.classList.add("is-open");
    shootModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    resetGame();

    if (startShoot) {
      startShoot.focus();
    }
  }

  playButtons.forEach((button) => {
    button.addEventListener("click", openShootGame);
  });


  /* CLOSE GAME */

  function closeShootGame() {
    if (!shootModal) return;

    stopGame();

    shootModal.classList.remove("is-open");
    shootModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  if (closeShoot) {
    closeShoot.addEventListener("click", closeShootGame);
  }

  if (shootModal) {
    shootModal.addEventListener("click", (event) => {
      if (event.target.matches("[data-close-modal]")) {
        closeShootGame();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      shootModal &&
      shootModal.classList.contains("is-open")
    ) {
      closeShootGame();
    }
  });


  /* RESET GAME */

  function resetGame() {
    stopGame();

    score = 0;
    streak = 0;
    timeLeft = 30;
    gameRunning = false;

    if (shootTarget) {
      shootTarget.hidden = true;
    }

    if (arenaMessage) {
      arenaMessage.hidden = false;
      arenaMessage.innerHTML = `
        <span class="arena-symbol">✳</span>
        <strong>READY WHEN YOU ARE?</strong>
        <span>Press start to begin your 30-second round.</span>
      `;
    }

    if (startShoot) {
      startShoot.disabled = false;
      startShoot.innerHTML = 'START GAME <span>↗</span>';
    }

    updateGameStats();
  }


  /* START GAME */

  function startGame() {
    if (gameRunning) return;

    stopGame();

    score = 0;
    streak = 0;
    timeLeft = 30;
    gameRunning = true;

    if (arenaMessage) {
      arenaMessage.hidden = true;
    }

    if (shootTarget) {
      shootTarget.hidden = false;
    }

    if (startShoot) {
      startShoot.disabled = true;
      startShoot.textContent = "GAME IN PROGRESS";
    }

    updateGameStats();
    moveTarget();

    gameTimer = window.setInterval(() => {
      timeLeft -= 1;

      updateGameStats();

      if (timeLeft <= 0) {
        finishGame();
      }
    }, 1000);
  }

  if (startShoot) {
    startShoot.addEventListener("click", startGame);
  }


  /* MOVE TARGET */

  function moveTarget() {
    if (!shootArena || !shootTarget) return;

    const arenaRect = shootArena.getBoundingClientRect();
    const targetSize = shootTarget.offsetWidth || 45;

    const maxX = Math.max(0, arenaRect.width - targetSize - 16);
    const maxY = Math.max(0, arenaRect.height - targetSize - 16);

    const randomX = 8 + Math.random() * Math.max(0, maxX - 8);
    const randomY = 8 + Math.random() * Math.max(0, maxY - 8);

    shootTarget.style.left = `${randomX}px`;
    shootTarget.style.top = `${randomY}px`;
  }


  /* HIT TARGET */

  if (shootTarget) {
    shootTarget.addEventListener("pointerdown", (event) => {
      event.preventDefault();

      if (!gameRunning) return;

      score += 1;
      streak += 1;

      updateGameStats();
      moveTarget();
    });
  }


  /* FINISH GAME */

  function finishGame() {
    stopGame();

    gameRunning = false;
    timeLeft = 0;
    streak = 0;

    if (score > bestScore) {
      bestScore = score;

      try {
        localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
      } catch (error) {
        // The game still works if browser storage is unavailable.
      }
    }

    if (shootTarget) {
      shootTarget.hidden = true;
    }

    if (arenaMessage) {
      arenaMessage.hidden = false;
      arenaMessage.innerHTML = `
        <span class="arena-symbol">✦</span>
        <strong>ROUND COMPLETE</strong>
        <span>You scored ${score} points. Ready for another round?</span>
      `;
    }

    if (startShoot) {
      startShoot.disabled = false;
      startShoot.innerHTML = 'PLAY AGAIN <span>↗</span>';
    }

    updateGameStats();
  }


  /* STOP TIMER */

  function stopGame() {
    if (gameTimer !== null) {
      window.clearInterval(gameTimer);
      gameTimer = null;
    }

    gameRunning = false;
  }
});
