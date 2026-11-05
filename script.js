
/* =========================================
   KIWAMI — COMPLETE JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  // ELEMENT SELECTOR HELPERS
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  // =====================================
  // 1. PAGE LOADER
  // =====================================

  const pageLoader = $("#pageLoader");

  window.addEventListener("load", () => {
    setTimeout(() => {
      pageLoader?.classList.add("loaded");
    }, 350);
  });

  // Fallback in case the load event has already fired.
  setTimeout(() => {
    pageLoader?.classList.add("loaded");
  }, 2500);

  // =====================================
  // 2. CURRENT YEAR
  // =====================================

  const yearElement = $("#year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // =====================================
  // 3. STAR BACKGROUND
  // =====================================

  const starsContainer = $("#stars");

  if (starsContainer) {
    const starCount = window.innerWidth < 600 ? 45 : 85;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("span");

      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 4}s`;
      star.style.opacity = `${0.15 + Math.random() * 0.5}`;

      fragment.appendChild(star);
    }

    starsContainer.appendChild(fragment);
  }

  // =====================================
  // 4. HEADER SCROLL EFFECT
  // =====================================

  const header = $("#siteHeader");

  function updateHeader() {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 35);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // =====================================
  // 5. MOBILE NAVIGATION
  // =====================================

  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");
  const navLinks = $$(".nav-link, .nav-cta");

  function closeMenu() {
    menuToggle?.classList.remove("active");
    mainNav?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = mainNav?.classList.toggle("open");

    menuToggle.classList.toggle("active", Boolean(isOpen));
    menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  navLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", event => {
    if (
      mainNav?.classList.contains("open") &&
      !mainNav.contains(event.target) &&
      !menuToggle?.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });

  // =====================================
  // 6. ACTIVE NAVIGATION ON SCROLL
  // =====================================

  const sections = $$("main section[id]");
  const pageNavLinks = $$(".nav-link");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        pageNavLinks.forEach(link => {
          const matches = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", matches);
        });
      });
    }, {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // =====================================
  // 7. SCROLL REVEAL
  // =====================================

  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add("visible");
    });
  }

  // =====================================
  // 8. INFINITE GAME CAROUSEL
  // =====================================

  const gamesTrack = $("#gamesTrack");
  const carouselWindow = $("#carouselWindow");
  const carouselPrev = $("#carouselPrev");
  const carouselNext = $("#carouselNext");

  let carouselAnimation = null;

  if (gamesTrack && carouselWindow) {
    const originalGroup = $(".games-group", gamesTrack);

    if (originalGroup) {
      // Duplicate the original group to create a seamless loop.
      const duplicateGroup = originalGroup.cloneNode(true);
      duplicateGroup.setAttribute("aria-hidden", "true");

      // Avoid duplicate interactive elements in the accessibility tree.
      duplicateGroup.querySelectorAll("button, a").forEach(element => {
        element.setAttribute("tabindex", "-1");
      });

      gamesTrack.appendChild(duplicateGroup);

      function getCarouselAnimation() {
        const animations = gamesTrack.getAnimations();

        carouselAnimation = animations.find(animation => {
          return animation.effect !== null;
        }) || null;

        return carouselAnimation;
      }

      // Wait for the CSS animation to initialize.
      requestAnimationFrame(() => {
        getCarouselAnimation();
      });

      // Pause when the user hovers over the cards.
      carouselWindow.addEventListener("mouseenter", () => {
        gamesTrack.style.animationPlayState = "paused";
      });

      carouselWindow.addEventListener("mouseleave", () => {
        gamesTrack.style.animationPlayState = "running";
      });

      // Pause when keyboard users focus a card.
      carouselWindow.addEventListener("focusin", () => {
        gamesTrack.style.animationPlayState = "paused";
      });

      carouselWindow.addEventListener("focusout", event => {
        if (!carouselWindow.contains(event.relatedTarget)) {
          gamesTrack.style.animationPlayState = "running";
        }
      });

      // Support touch interaction.
      carouselWindow.addEventListener("touchstart", () => {
        gamesTrack.style.animationPlayState = "paused";
      }, { passive: true });

      carouselWindow.addEventListener("touchend", () => {
        gamesTrack.style.animationPlayState = "running";
      }, { passive: true });

      function moveCarousel(direction) {
        const animation = getCarouselAnimation();

        if (!animation || typeof animation.currentTime !== "number") {
          return;
        }

        const duration = animation.effect?.getTiming().duration;

        if (typeof duration !== "number" || !Number.isFinite(duration)) {
          return;
        }

        const currentTime = animation.currentTime;

        animation.currentTime = Math.max(
          0,
          Math.min(duration, currentTime + direction * 900)
        );
      }

      carouselPrev?.addEventListener("click", () => {
        moveCarousel(-1);
      });

      carouselNext?.addEventListener("click", () => {
        moveCarousel(1);
      });
    }
  }

  // =====================================
  // 9. SHOOT-STREAK GAME
  // =====================================

  const shootGame = $("#shootGame");
  const shootArena = $("#shootArena");
  const shootTarget = $("#shootTarget");
  const startShootGame = $("#startShootGame");
  const closeShootGame = $("#closeShootGame");
  const arenaMessage = $("#arenaMessage");

  const scoreDisplay = $("#shootScore");
  const timeDisplay = $("#shootTime");
  const streakDisplay = $("#shootStreak");
  const bestDisplay = $("#shootBest");

  const BEST_SCORE_KEY = "kiwami_shoot_streak_best_v1";

  let score = 0;
  let streak = 0;
  let timeLeft = 30;
  let gameRunning = false;
  let gameTimer = null;

  let bestScore = Number(localStorage.getItem(BEST_SCORE_KEY)) || 0;

  if (bestDisplay) {
    bestDisplay.textContent = bestScore;
  }

  function updateGameHUD() {
    if (scoreDisplay) scoreDisplay.textContent = score;
    if (timeDisplay) timeDisplay.textContent = timeLeft;
    if (streakDisplay) streakDisplay.textContent = streak;
    if (bestDisplay) bestDisplay.textContent = bestScore;
  }

  function positionTarget() {
    if (!shootArena || !shootTarget) return;

    const arenaWidth = shootArena.clientWidth;
    const arenaHeight = shootArena.clientHeight;
    const targetSize = shootTarget.offsetWidth || 54;
    const padding = targetSize / 2 + 8;

    const availableWidth = Math.max(
      0,
      arenaWidth - padding * 2
    );

    const availableHeight = Math.max(
      0,
      arenaHeight - padding * 2
    );

    const x = padding + Math.random() * availableWidth;
    const y = padding + Math.random() * availableHeight;

    shootTarget.style.left = `${x}px`;
    shootTarget.style.top = `${y}px`;
  }

  function showGameMessage(title, description, buttonText) {
    if (!arenaMessage) return;

    arenaMessage.innerHTML = `
      <div class="arena-crosshair">+</div>
      <h3>${title}</h3>
      <p>${description}</p>
      <button class="button button-primary" id="restartShootGame">
        ${buttonText}
      </button>
    `;

    arenaMessage.style.display = "flex";

    $("#restartShootGame")?.addEventListener("click", startGame);
  }

  function finishGame() {
    gameRunning = false;

    clearInterval(gameTimer);
    gameTimer = null;

    if (shootTarget) {
      shootTarget.hidden = true;
    }

    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
    }

    updateGameHUD();

    showGameMessage(
      "TIME'S UP!",
      `You scored ${score} points with a best streak of ${streak}.`,
      "PLAY AGAIN"
    );
  }

  function startGame() {
    if (!shootGame || !shootArena) return;

    clearInterval(gameTimer);

    score = 0;
    streak = 0;
    timeLeft = 30;
    gameRunning = true;

    updateGameHUD();

    if (arenaMessage) {
      arenaMessage.style.display = "none";
    }

    if (shootTarget) {
      shootTarget.hidden = false;
    }

    positionTarget();

    gameTimer = setInterval(() => {
      timeLeft -= 1;
      updateGameHUD();

      if (timeLeft <= 0) {
        finishGame();
      }
    }, 1000);
  }

  function openGame() {
    if (!shootGame) return;

    shootGame.classList.add("open");
    shootGame.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    clearInterval(gameTimer);
    gameRunning = false;

    score = 0;
    streak = 0;
    timeLeft = 30;

    updateGameHUD();

    if (shootTarget) {
      shootTarget.hidden = true;
    }

    showGameMessage(
      "READY?",
      "Hit as many targets as you can in 30 seconds.",
      "START GAME"
    );
  }

  function closeGame() {
    if (!shootGame) return;

    shootGame.classList.remove("open");
    shootGame.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    clearInterval(gameTimer);
    gameTimer = null;
    gameRunning = false;

    if (shootTarget) {
      shootTarget.hidden = true;
    }
  }

  // Open the playable game from its game card.
  $$(".play-game").forEach(button => {
    button.addEventListener("click", openGame);
  });

  startShootGame?.addEventListener("click", startGame);

  closeShootGame?.addEventListener("click", closeGame);

  // Close when the backdrop is clicked.
  $$("[data-close-game]").forEach(element => {
    element.addEventListener("click", closeGame);
  });

  // Close with Escape.
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && shootGame?.classList.contains("open")) {
      closeGame();
    }
  });

  // Score when the target is hit.
  shootTarget?.addEventListener("click", event => {
    event.stopPropagation();

    if (!gameRunning) return;

    score += 10;
    streak += 1;

    updateGameHUD();
    positionTarget();
  });

  // A miss resets the streak.
  shootArena?.addEventListener("click", event => {
    if (!gameRunning) return;

    if (event.target === shootArena) {
      streak = 0;
      updateGameHUD();
    }
  });

  // Keep the target inside the arena when the window changes size.
  window.addEventListener("resize", () => {
    if (gameRunning) {
      positionTarget();
    }
  });

  // =====================================
  // 10. INITIAL STATE
  // =====================================

  updateHeader();
  updateGameHUD();
});
