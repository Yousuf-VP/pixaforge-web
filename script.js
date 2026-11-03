
/* =========================================================
   PIXAFORGE — MAIN WEBSITE JAVASCRIPT
   Landing page interactions
========================================================= */

"use strict";

/* =========================================================
   CONFIGURATION
========================================================= */

const PIXAFORGE_CONFIG = {
  particleCount: 32,
  revealThreshold: 0.12,
  carouselSpeed: 0.45,
  toastDuration: 2600,
  favoriteStorageKey: "pixaforge_favorites_v1"
};

/* =========================================================
   EDITABLE STUDIO NEWS
========================================================= */

const PIXAFORGE_NEWS = [
  {
    category: "studio",
    label: "STUDIO UPDATE",
    date: "NOVEMBER 2026",
    title: "A new digital playground is taking shape.",
    description:
      "PIXAFORGE is building a collection of original browser gaming experiences. The journey is just getting started.",
    link: "#about",
    linkText: "EXPLORE THE STUDIO"
  },
  {
    category: "development",
    label: "DEVELOPMENT",
    date: "NOVEMBER 2026",
    title: "Cookie Emperor continues to grow.",
    description:
      "Our first original game is expanding with new systems, progression and a growing cookie kingdom.",
    link: "#games",
    linkText: "VIEW THE GAME"
  },
  {
    category: "development",
    label: "IN DEVELOPMENT",
    date: "COMING SOON",
    title: "A mysterious world is on the horizon.",
    description:
      "Unknown World is part of the next chapter of the PIXAFORGE collection.",
    link: "#games",
    linkText: "VIEW COLLECTION"
  },
  {
    category: "release",
    label: "COLLECTION",
    date: "PIXAFORGE",
    title: "Three game worlds. One growing collection.",
    description:
      "Explore the current lineup and follow the development of upcoming experiences.",
    link: "#games",
    linkText: "EXPLORE ARCADE"
  }
];

/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const isTouchDevice =
  window.matchMedia("(hover: none)").matches;

/* =========================================================
   ELEMENT REFERENCES
========================================================= */

const pageLoader = $("#pageLoader");
const siteHeader = $("#siteHeader");
const scrollProgress = $("#scrollProgress");

const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");

const cursorGlow = $("#cursorGlow");
const cursorDot = $("#cursorDot");

const gamesGrid = $("#gamesGrid");
const gameSearch = $("#gameSearch");
const gamesEmpty = $("#gamesEmpty");

const newsGrid = $("#newsGrid");
const newsEmpty = $("#newsEmpty");

const detailsModal = $("#detailsModal");
const modalImage = $("#modalImage");
const modalTitle = $("#modalTitle");
const modalDescription = $("#modalDescription");
const modalCategory = $("#modalCategory");
const modalStatus = $("#modalStatus");
const modalPlay = $("#modalPlay");

const toastContainer = $("#toastContainer");

const floatingTopButton = $("#floatingTopButton");

/* =========================================================
   PRELOADER
========================================================= */

function finishLoading() {
  if (!pageLoader) return;

  pageLoader.classList.add("loaded");

  window.setTimeout(() => {
    pageLoader.remove();
  }, 800);
}

if (document.readyState === "complete") {
  finishLoading();
} else {
  window.addEventListener("load", finishLoading, { once: true });
}

window.setTimeout(finishLoading, 3500);

/* =========================================================
   TOAST NOTIFICATIONS
========================================================= */

function showToast(message) {
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  toastContainer.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("removing");

    window.setTimeout(() => {
      toast.remove();
    }, 320);
  }, PIXAFORGE_CONFIG.toastDuration);
}

/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function closeNavigation() {
  if (!menuToggle || !mainNav) return;

  menuToggle.classList.remove("active");
  mainNav.classList.remove("open");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");

  document.body.classList.remove("menu-open");
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );

    document.body.classList.toggle("menu-open", isOpen);
  });

  $$(".nav-link", mainNav).forEach(link => {
    link.addEventListener("click", closeNavigation);
  });

  document.addEventListener("click", event => {
    if (
      mainNav.classList.contains("open") &&
      !mainNav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeNavigation();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeNavigation();
    }
  });
}

/* =========================================================
   HEADER + SCROLL PROGRESS
========================================================= */

let scrollTicking = false;

function updateScrollInterface() {
  const scrollTop = window.scrollY;

  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress =
    scrollableHeight > 0
      ? (scrollTop / scrollableHeight) * 100
      : 0;

  if (scrollProgress) {
    scrollProgress.style.width = `${progress}%`;
  }

  if (siteHeader) {
    siteHeader.classList.toggle("scrolled", scrollTop > 40);
  }

  if (floatingTopButton) {
    floatingTopButton.classList.toggle("visible", scrollTop > 600);
  }

  scrollTicking = false;
}

window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollInterface);
    scrollTicking = true;
  }
}, { passive: true });

updateScrollInterface();

/* =========================================================
   BACK TO TOP
========================================================= */

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "instant" : "smooth"
  });
}

if (floatingTopButton) {
  floatingTopButton.addEventListener("click", scrollToTop);
}

const backToTop = $("#backToTop");

if (backToTop) {
  backToTop.addEventListener("click", event => {
    event.preventDefault();
    scrollToTop();
  });
}

/* =========================================================
   ACTIVE NAVIGATION TRACKING
========================================================= */

const navigationSections = $$("#home, #games, #features, #news, #about");
const navigationLinks = $$(".nav-link");

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      navigationLinks.forEach(link => {
        const active =
          link.getAttribute("href") === `#${entry.target.id}`;

        link.classList.toggle("active", active);
      });
    });
  }, {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  });

  navigationSections.forEach(section => navObserver.observe(section));
}

/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements = $$(".reveal");

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: PIXAFORGE_CONFIG.revealThreshold,
    rootMargin: "0px 0px -35px 0px"
  });

  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("visible"));
}

/* =========================================================
   STAGGERED REVEAL
========================================================= */

$$(".games-grid, .features-grid, .news-grid, .numbers-grid").forEach(group => {
  const items = [...group.children];

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
  });
});

/* =========================================================
   ANIMATED NUMBER COUNTERS
========================================================= */

const counterElements = $$("[data-count]");

function animateCounter(element) {
  const target = Number(element.dataset.count);

  if (!Number.isFinite(target)) return;

  if (prefersReducedMotion) {
    element.textContent = target.toLocaleString();
    return;
  }

  const duration = 1300;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);

    const value = Math.round(target * eased);

    element.textContent = value.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.65 });

  counterElements.forEach(counter => counterObserver.observe(counter));
} else {
  counterElements.forEach(animateCounter);
}

/* =========================================================
   PARTICLE GENERATOR
========================================================= */

function createParticles() {
  const field = $("#particleField");

  if (!field || prefersReducedMotion || isTouchDevice) return;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < PIXAFORGE_CONFIG.particleCount; i++) {
    const particle = document.createElement("span");

    particle.className = "particle";

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    particle.style.animationDuration =
      `${12 + Math.random() * 20}s`;

    particle.style.animationDelay =
      `${-Math.random() * 25}s`;

    particle.style.opacity =
      `${0.15 + Math.random() * 0.45}`;

    fragment.appendChild(particle);
  }

  field.appendChild(fragment);
}

createParticles();

/* =========================================================
   CUSTOM CURSOR
========================================================= */

if (
  cursorGlow &&
  cursorDot &&
  !isTouchDevice &&
  !prefersReducedMotion
) {
  let cursorX = 0;
  let cursorY = 0;
  let dotX = 0;
  let dotY = 0;
  let cursorFrame = false;

  window.addEventListener("mousemove", event => {
    cursorX = event.clientX;
    cursorY = event.clientY;

    cursorGlow.style.opacity = "1";
    cursorDot.style.opacity = "1";

    if (!cursorFrame) {
      cursorFrame = true;
      requestAnimationFrame(updateCursor);
    }
  }, { passive: true });

  function updateCursor() {
    dotX += (cursorX - dotX) * 0.25;
    dotY += (cursorY - dotY) * 0.25;

    cursorGlow.style.left = `${cursorX}px`;
    cursorGlow.style.top = `${cursorY}px`;

    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;

    if (
      Math.abs(cursorX - dotX) > 0.1 ||
      Math.abs(cursorY - dotY) > 0.1
    ) {
      requestAnimationFrame(updateCursor);
    } else {
      cursorFrame = false;
    }
  }

  document.addEventListener("mouseleave", () => {
    cursorGlow.style.opacity = "0";
    cursorDot.style.opacity = "0";
  });
}

/* =========================================================
   GAME LIBRARY — DATA
========================================================= */

function getGameCards() {
  return gamesGrid ? $$(".game-card", gamesGrid) : [];
}

function getGameData(card) {
  return {
    title: card.dataset.title || "Untitled game",
    description: card.dataset.description || "",
    category: card.dataset.category || "",
    status: card.dataset.status || "soon",
    image: card.dataset.image || "",
    link: card.dataset.link || ""
  };
}

/* =========================================================
   GAME SEARCH + CATEGORY FILTERS
========================================================= */

let activeGameFilter = "all";

function filterGames() {
  if (!gamesGrid) return;

  const query = (gameSearch?.value || "").trim().toLowerCase();
  let visibleCount = 0;

  getGameCards().forEach(card => {
    const data = getGameData(card);

    const matchesCategory =
      activeGameFilter === "all" ||
      data.category.split(/\s+/).includes(activeGameFilter);

    const searchable =
      `${data.title} ${data.description} ${data.category}`.toLowerCase();

    const matchesSearch = searchable.includes(query);
    const visible = matchesCategory && matchesSearch;

    card.classList.toggle("is-filtered-out", !visible);
    card.setAttribute("aria-hidden", String(!visible));

    if (visible) visibleCount++;
  });

  if (gamesEmpty) {
    gamesEmpty.hidden = visibleCount !== 0;
  }
}

$$(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    activeGameFilter = button.dataset.filter || "all";

    $$(".filter-button").forEach(item => {
      item.classList.toggle("active", item === button);
    });

    filterGames();
  });
});

if (gameSearch) {
  gameSearch.addEventListener("input", filterGames);
}

const clearGameSearch = $("#clearGameSearch");

if (clearGameSearch) {
  clearGameSearch.addEventListener("click", () => {
    activeGameFilter = "all";

    if (gameSearch) gameSearch.value = "";

    $$(".filter-button").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.filter === "all"
      );
    });

    filterGames();
  });
}

/* =========================================================
   KEYBOARD SEARCH SHORTCUT
========================================================= */

document.addEventListener("keydown", event => {
  const target = event.target;
  const isTyping =
    target instanceof HTMLElement &&
    (
      target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
    );

  if (event.key === "/" && !isTyping && gameSearch) {
    event.preventDefault();
    gameSearch.focus();
    $("#games")?.scrollIntoView({ behavior: "smooth" });
  }

  if (event.key === "Escape") {
    closeDetailsModal();
    closeNavigation();
  }
});

/* =========================================================
   FAVORITES — LOCAL STORAGE
========================================================= */

function loadFavorites() {
  try {
    const saved = localStorage.getItem(
      PIXAFORGE_CONFIG.favoriteStorageKey
    );

    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  try {
    localStorage.setItem(
      PIXAFORGE_CONFIG.favoriteStorageKey,
      JSON.stringify(favorites)
    );
  } catch {
    showToast("Favorites could not be saved in this browser.");
  }
}

let favorites = loadFavorites();

function updateFavoriteButtons() {
  getGameCards().forEach(card => {
    const button = $(".favorite-button", card);
    if (!button) return;

    const title = getGameData(card).title;
    const isFavorite = favorites.includes(title);

    button.setAttribute("aria-pressed", String(isFavorite));
    button.textContent = isFavorite ? "★" : "☆";
  });
}

getGameCards().forEach(card => {
  const button = $(".favorite-button", card);
  if (!button) return;

  button.addEventListener("click", () => {
    const title = getGameData(card).title;

    if (favorites.includes(title)) {
      favorites = favorites.filter(item => item !== title);
      showToast(`${title} removed from favorites.`);
    } else {
      favorites.push(title);
      showToast(`${title} added to favorites.`);
    }

    saveFavorites(favorites);
    updateFavoriteButtons();
  });
});

updateFavoriteButtons();

/* =========================================================
   GAME DETAILS MODAL
========================================================= */

function openDetailsModal(card) {
  if (!detailsModal) return;

  const data = getGameData(card);

  if (modalTitle) modalTitle.textContent = data.title;
  if (modalDescription) modalDescription.textContent = data.description;
  if (modalCategory) modalCategory.textContent = data.category.toUpperCase();

  if (modalImage) {
    modalImage.src = data.image;
    modalImage.alt = `${data.title} artwork`;
  }

  if (modalStatus) {
    modalStatus.textContent =
      data.status === "available"
        ? "● AVAILABLE TO PLAY"
        : "◷ IN DEVELOPMENT";
  }

  if (modalPlay) {
    if (data.status === "available" && data.link) {
      modalPlay.hidden = false;
      modalPlay.href = data.link;
      modalPlay.removeAttribute("aria-disabled");
    } else {
      modalPlay.hidden = true;
      modalPlay.removeAttribute("href");
    }
  }

  detailsModal.classList.add("open");
  detailsModal.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");

  $(".modal-close", detailsModal)?.focus();
}

function closeDetailsModal() {
  if (!detailsModal) return;

  detailsModal.classList.remove("open");
  detailsModal.setAttribute("aria-hidden", "true");

  document.body.classList.remove("modal-open");
}

getGameCards().forEach(card => {
  const detailsButton = $(".game-details-button", card);

  if (detailsButton) {
    detailsButton.addEventListener("click", () => {
      openDetailsModal(card);
    });
  }
});

if (detailsModal) {
  $$("[data-modal-close]", detailsModal).forEach(button => {
    button.addEventListener("click", closeDetailsModal);
  });
}

/* =========================================================
   NEWS RENDERING
========================================================= */

function renderNews(filter = "all") {
  if (!newsGrid) return;

  newsGrid.innerHTML = "";

  const items = PIXAFORGE_NEWS.filter(item => {
    return filter === "all" || item.category === filter;
  });

  if (newsEmpty) {
    newsEmpty.hidden = items.length !== 0;
  }

  const fragment = document.createDocumentFragment();

  items.forEach(item => {
    const article = document.createElement("article");
    article.className = "news-card reveal visible";

    const top = document.createElement("div");
    top.className = "news-card-top";

    const tag = document.createElement("span");
    tag.className = "news-tag";
    tag.textContent = item.label;

    const date = document.createElement("span");
    date.className = "news-date";
    date.textContent = item.date;

    top.append(tag, date);

    const title = document.createElement("h3");
    title.textContent = item.title;

    const description = document.createElement("p");
    description.textContent = item.description;

    const link = document.createElement("a");
    link.className = "news-read";
    link.href = item.link || "#news";
    link.textContent = `${item.linkText || "READ MORE"} ↗`;

    article.append(top, title, description, link);
    fragment.appendChild(article);
  });

  newsGrid.appendChild(fragment);
}

renderNews();

/* =========================================================
   NEWS FILTERS
========================================================= */

$$(".news-filter").forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.newsFilter || "all";

    $$(".news-filter").forEach(item => {
      item.classList.toggle("active", item === button);
    });

    renderNews(filter);
  });
});

/* =========================================================
   MOBILE GAME CAROUSEL
========================================================= */

let carouselTimer = null;
let carouselPaused = false;
let carouselLastInteraction = 0;
let carouselPosition = 0;

const mobileCarouselQuery = window.matchMedia("(max-width: 760px)");

function isMobileCarousel() {
  return mobileCarouselQuery.matches && gamesGrid;
}

function getVisibleCarouselCards() {
  return getGameCards().filter(card =>
    !card.classList.contains("is-filtered-out")
  );
}

function stopCarousel() {
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = null;
  }
}

function startCarousel() {
  stopCarousel();

  if (!isMobileCarousel() || prefersReducedMotion) return;

  carouselTimer = window.setInterval(() => {
    if (carouselPaused || Date.now() - carouselLastInteraction < 3200) {
      return;
    }

    const cards = getVisibleCarouselCards();

    if (cards.length < 2) return;

    const current = cards[carouselPosition % cards.length];
    const nextIndex = (carouselPosition + 1) % cards.length;
    const next = cards[nextIndex];

    if (!current || !next) return;

    if (nextIndex === 0) {
      gamesGrid.scrollTo({
        left: 0,
        behavior: "smooth"
      });
    } else {
      next.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }

    carouselPosition = nextIndex;
  }, 4200);
}

function pauseCarousel() {
  carouselPaused = true;
  carouselLastInteraction = Date.now();
}

function resumeCarousel() {
  carouselLastInteraction = Date.now();

  window.setTimeout(() => {
    carouselPaused = false;
  }, 1200);
}

if (gamesGrid) {
  gamesGrid.addEventListener("touchstart", pauseCarousel, { passive: true });
  gamesGrid.addEventListener("touchend", resumeCarousel, { passive: true });
  gamesGrid.addEventListener("pointerdown", pauseCarousel);
  gamesGrid.addEventListener("pointerup", resumeCarousel);
  gamesGrid.addEventListener("wheel", pauseCarousel, { passive: true });
  gamesGrid.addEventListener("scroll", () => {
    carouselLastInteraction = Date.now();
  }, { passive: true });
}

function updateCarouselMode() {
  if (isMobileCarousel()) {
    carouselPosition = 0;
    startCarousel();
  } else {
    stopCarousel();
    carouselPosition = 0;
  }
}

mobileCarouselQuery.addEventListener("change", updateCarouselMode);
updateCarouselMode();

// Keep carousel position valid when filters change.
$$(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    carouselPosition = 0;

    if (gamesGrid) {
      gamesGrid.scrollTo({ left: 0, behavior: "smooth" });
    }

    updateCarouselMode();
  });
});

/* =========================================================
   DESKTOP CARD TILT
========================================================= */

if (!isTouchDevice && !prefersReducedMotion) {
  getGameCards().forEach(card => {
    card.addEventListener("pointermove", event => {
      if (window.innerWidth <= 760) return;

      const rect = card.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 5;
      const rotateX = (0.5 - y) * 5;

      card.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

/* =========================================================
   HERO PARALLAX
========================================================= */

const heroVisual = $(".hero-visual");

if (heroVisual && !isTouchDevice && !prefersReducedMotion) {
  heroVisual.addEventListener("pointermove", event => {
    const rect = heroVisual.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    const emblem = $(".hero-emblem-container", heroVisual);

    if (emblem) {
      emblem.style.transform =
        `translate(${x * 12}px,${y * 12}px)`;
    }
  });

  heroVisual.addEventListener("pointerleave", () => {
    const emblem = $(".hero-emblem-container", heroVisual);

    if (emblem) {
      emblem.style.transform = "";
    }
  });
}

/* =========================================================
   MARQUEE ACCESSIBILITY
========================================================= */

if (prefersReducedMotion) {
  const marquee = $(".marquee-content");

  if (marquee) {
    marquee.style.animation = "none";
    marquee.style.transform = "none";
  }
}

/* =========================================================
   IMAGE ERROR HANDLING
========================================================= */

$$(".game-art img").forEach(image => {
  image.addEventListener("error", () => {
    image.classList.add("image-unavailable");
  });
});

/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopCarousel();
  } else {
    updateCarouselMode();
  }
});

/* =========================================================
   INITIALIZATION
========================================================= */

function initializePixaforge() {
  filterGames();
  updateFavoriteButtons();
  updateScrollInterface();

  console.log(
    "%cPIXAFORGE",
    "color:#c084fc;font-size:24px;font-weight:900;"
  );

  console.log(
    "%cFORGE YOUR EXPERIENCE.",
    "color:#00e5ff;font-size:12px;"
  );
}

initializePixaforge();

/* ================================================================
   PIXAFORGE — COOKIE EMPEROR GAME ENGINE + HASH ROUTER
   Save data: pixaforge_cookie_emperor_v2
================================================================ */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const gameView = $("cookieEmperorView");
  const siteMain = $("siteMain");

  if (!gameView || !siteMain) return;

  const SAVE_KEY = "pixaforge_cookie_emperor_v2";
  const DAY = 86400000;

  const number = (value) => Math.max(0, Number(value) || 0);

  const fmt = (value) => {
    const n = number(value);

    if (n < 1000) return Math.floor(n).toLocaleString();

    const units = ["K", "M", "B", "T", "Qa", "Qi"];
    let unit = -1;
    let scaled = n;

    while (scaled >= 1000 && unit < units.length - 1) {
      scaled /= 1000;
      unit++;
    }

    return `${scaled.toFixed(
      scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2
    )}${units[unit]}`;
  };

  const escapeHTML = (value) =>
    String(value).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));

  const toast = (message) => {
    if (typeof window.showToast === "function") {
      window.showToast(message);
    } else {
      const box = $("toastContainer");
      if (!box) return;

      const item = document.createElement("div");
      item.className = "toast-message";
      item.textContent = message;
      box.append(item);

      setTimeout(() => item.remove(), 3200);
    }
  };

  const BUILDINGS = [
    {
      id: "tiny",
      name: "Tiny Bakery",
      icon: "🏠",
      desc: "A humble oven that starts your royal production.",
      base: 30,
      rate: 0.5,
      workers: 1,
      time: 5
    },
    {
      id: "farm",
      name: "Cookie Farm",
      icon: "🌾",
      desc: "Grow ingredients and bake cookies in steady batches.",
      base: 120,
      rate: 2.4,
      workers: 2,
      time: 8
    },
    {
      id: "oven",
      name: "Royal Oven",
      icon: "🔥",
      desc: "A royal-grade oven built for serious production.",
      base: 650,
      rate: 9,
      workers: 3,
      time: 12
    },
    {
      id: "factory",
      name: "Cookie Factory",
      icon: "🏭",
      desc: "Automated production for a growing empire.",
      base: 3200,
      rate: 38,
      workers: 5,
      time: 18
    },
    {
      id: "mine",
      name: "Cookie Mine",
      icon: "⛏️",
      desc: "Mine rare sugar crystals to fuel the kingdom.",
      base: 15000,
      rate: 170,
      workers: 8,
      time: 25
    },
    {
      id: "generator",
      name: "Enchanted Generator",
      icon: "🔮",
      desc: "Turn royal magic into endless baking energy.",
      base: 85000,
      rate: 760,
      workers: 12,
      time: 35
    },
    {
      id: "lab",
      name: "Royal Dessert Laboratory",
      icon: "🧪",
      desc: "The pinnacle of cookie science and production.",
      base: 450000,
      rate: 3600,
      workers: 18,
      time: 50
    }
  ];

  const UPGRADES = [
    { id: "strongHands", name: "Strong Baking Hands", desc: "Double cookies earned per click.", cost: 250, effect: "click", value: 2 },
    { id: "betterOvens", name: "Tempered Oven Stones", desc: "Increase all building production by 20%.", cost: 900, effect: "production", value: 1.2 },
    { id: "royalRecipe", name: "The Royal Recipe", desc: "Increase click power by 3×.", cost: 3500, effect: "click", value: 3 },
    { id: "efficientStaff", name: "Efficient Staff Training", desc: "Increase production by 35%.", cost: 12000, effect: "production", value: 1.35 },
    { id: "goldenWhisk", name: "Golden Whisk", desc: "Increase click power by 5×.", cost: 45000, effect: "click", value: 5 },
    { id: "sugarAlchemy", name: "Sugar Alchemy", desc: "Increase production by 60%.", cost: 160000, effect: "production", value: 1.6 },
    { id: "royalMachines", name: "Royal Machinery", desc: "Increase production by 2×.", cost: 650000, effect: "production", value: 2 },
    { id: "emperorTouch", name: "Emperor's Touch", desc: "Increase click power by 10×.", cost: 2500000, effect: "click", value: 10 }
  ];

  const COSMETICS = [
    { id: "classic", name: "Royal Cocoa", icon: "🍫", desc: "The classic royal bakery look.", cost: 0 },
    { id: "gold", name: "Golden Reign", icon: "👑", desc: "A golden look for a growing empire.", cost: 5000 },
    { id: "crystal", name: "Crystal Court", icon: "💎", desc: "A cool, crystalline royal theme.", cost: 50000 },
    { id: "ember", name: "Dragon Ember", icon: "🐉", desc: "A legendary ember-lit court.", cost: 500000 }
  ];

  const QUESTS = [
    { id: "clicks", name: "A Baker's Beginning", desc: "Bake 100 cookies by hand.", goal: 100, metric: "clicks", reward: 100 },
    { id: "buildings", name: "A Growing Estate", desc: "Own 3 buildings.", goal: 3, metric: "buildingCount", reward: 350 },
    { id: "workers", name: "A Helping Hand", desc: "Hire 5 workers.", goal: 5, metric: "workers", reward: 500 }
  ];

  const CONTRACTS = [
    { id: "contract1", name: "The Village Feast", desc: "Deliver 1,000 cookies to the village.", goal: 1000, reward: 500 },
    { id: "contract2", name: "The Duke's Table", desc: "Deliver 10,000 cookies to the duke.", goal: 10000, reward: 5000 },
    { id: "contract3", name: "Royal Celebration", desc: "Deliver 100,000 cookies to the royal court.", goal: 100000, reward: 50000 }
  ];

  const ACHIEVEMENTS = [
    { id: "firstClick", name: "First Batch", desc: "Bake your first cookie.", test: s => s.clicks >= 1, reward: 25 },
    { id: "hundred", name: "Cookie Apprentice", desc: "Bake 100 cookies in total.", test: s => s.total >= 100, reward: 100 },
    { id: "thousand", name: "Sweet Success", desc: "Bake 1,000 cookies in total.", test: s => s.total >= 1000, reward: 300 },
    { id: "firstBuilding", name: "Property Owner", desc: "Build your first estate.", test: s => buildingCount(s) >= 1, reward: 150 },
    { id: "fiveBuildings", name: "Land Baron", desc: "Own 5 buildings.", test: s => buildingCount(s) >= 5, reward: 1000 },
    { id: "tenWorkers", name: "People's Emperor", desc: "Hire 10 workers.", test: s => s.workers >= 10, reward: 750 },
    { id: "upgrade", name: "Royal Engineer", desc: "Purchase an upgrade.", test: s => s.upgrades.length >= 1, reward: 300 },
    { id: "million", name: "Millionaire Baker", desc: "Bake 1 million cookies in total.", test: s => s.total >= 1e6, reward: 5000 },
    { id: "crown", name: "A Lasting Legacy", desc: "Earn a royal crown.", test: s => s.crowns >= 1, reward: 2500 },
    { id: "allBuildings", name: "Empire Architect", desc: "Own every type of building.", test: s => BUILDINGS.every(b => (s.buildings[b.id] || 0) > 0), reward: 10000 }
  ];

  function freshState() {
    return {
      cookies: 0,
      total: 0,
      runTotal: 0,
      clicks: 0,
      workers: 0,
      trained: 0,
      crowns: 0,
      level: 1,
      buildings: {},
      upgrades: [],
      inventory: {},
      cosmetics: ["classic"],
      equipped: "classic",
      notifications: [],
      claimedAchievements: [],
      claimedQuests: [],
      claimedContracts: [],
      dailyClaim: 0,
      playSeconds: 0,
      lastSeen: Date.now(),
      lastTick: Date.now(),
      settings: {
        floating: true,
        reduced: false,
        sound: false
      },
      stats: {
        sessions: 1,
        builds: 0,
        events: 0,
        contracts: 0,
        repairs: 0
      },
      buildingExpiry: {},
      event: {
        name: "The King's Welcome",
        description: "The royal court welcomes its newest baker. Bake cookies to grow your empire!",
        ends: Date.now() + 120000
      },
      questDay: new Date().toDateString(),
      version: 2
    };
  }

  let state = freshState();
  let saveTimer = null;
  let gameLoop = null;
  let activeTab = "buildings";

  function buildingCount(s = state) {
    return BUILDINGS.reduce(
      (sum, b) => sum + (s.buildings[b.id] || 0),
      0
    );
  }

  function productionMultiplier() {
    let mult = 1 + state.crowns * 0.05;

    state.upgrades.forEach(id => {
      const u = UPGRADES.find(x => x.id === id);

      if (u && u.effect === "production") {
        mult *= u.value;
      }
    });

    return mult;
  }

  function clickMultiplier() {
    return state.upgrades.reduce((m, id) => {
      const u = UPGRADES.find(x => x.id === id);
      return u && u.effect === "click" ? m * u.value : m;
    }, 1) * (1 + state.crowns * 0.1);
  }

  function clickPower() {
    return Math.max(1, Math.floor(clickMultiplier()));
  }

  function rate() {
    return BUILDINGS.reduce(
      (sum, b) => sum + (state.buildings[b.id] || 0) * b.rate,
      0
    ) * productionMultiplier();
  }

  function levelFor(total) {
    return Math.max(1, Math.floor(Math.sqrt(Math.max(0, total) / 100)) + 1);
  }

  function rankName() {
    const ranks = [
      [1, "NOVICE BAKER"],
      [3, "APPRENTICE BAKER"],
      [5, "MASTER BAKER"],
      [8, "COOKIE NOBLE"],
      [12, "DUKE OF DESSERTS"],
      [17, "COOKIE MONARCH"],
      [25, "COOKIE EMPEROR"]
    ];

    let rank = ranks[0][1];

    ranks.forEach(([lvl, name]) => {
      if (state.level >= lvl) rank = name;
    });

    return rank;
  }

  function addCookies(amount, source = "production") {
    amount = number(amount);
    if (!amount) return;

    state.cookies += amount;
    state.total += amount;
    state.runTotal += amount;

    if (source === "click") state.clicks++;

    checkProgress();
  }

  function notify(title, message, type = "info", action = null) {
    state.notifications.unshift({
      id: Date.now() + Math.random(),
      title,
      message,
      type,
      action,
      read: false,
      time: Date.now()
    });

    state.notifications = state.notifications.slice(0, 60);
    renderBadges();
  }

  function spend(cost) {
    if (state.cookies < cost) {
      toast(`You need ${fmt(cost - state.cookies)} more cookies.`);
      return false;
    }

    state.cookies -= cost;
    return true;
  }

  function saveGame(silent = false) {
    try {
      state.lastSeen = Date.now();

      localStorage.setItem(SAVE_KEY, JSON.stringify(state));

      const label = $("saveStatus");
      if (label) label.textContent = "● EMPIRE SAVED";

      if (!silent) toast("Empire saved successfully.");
    } catch (error) {
      console.error("Cookie Emperor save failed:", error);
      toast("Save failed. Check your browser storage settings.");
    }
  }

  function loadGame() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return;

      state = {
        ...freshState(),
        ...parsed,
        buildings: { ...(parsed.buildings || {}) },
        settings: { ...freshState().settings, ...(parsed.settings || {}) },
        stats: { ...freshState().stats, ...(parsed.stats || {}) }
      };

      state.cookies = number(state.cookies);
      state.total = number(state.total);
      state.runTotal = number(state.runTotal);

      const away = Math.min(
        8 * 60 * 60,
        Math.max(0, (Date.now() - number(state.lastSeen)) / 1000)
      );

      if (away > 30 && rate() > 0) {
        const earned = rate() * away;

        state.cookies += earned;
        state.total += earned;
        state.runTotal += earned;

        notify(
          "Welcome back, Emperor!",
          `Your kingdom baked ${fmt(earned)} cookies while you were away.`,
          "reward"
        );

        toast(`Welcome back! +${fmt(earned)} offline cookies.`);
      }

      state.stats.sessions = (state.stats.sessions || 0) + 1;
    } catch (error) {
      console.warn("Could not load Cookie Emperor save:", error);
      state = freshState();
    }
  }

  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveGame(true), 700);
  }

  function renderResources() {
    const values = {
      cookieCount: fmt(state.cookies),
      cookieRate: fmt(rate()),
      populationCount: fmt(state.workers),
      workerSummary: `${state.trained} trained · ${Math.max(0, state.workers - state.trained)} untrained`,
      crownCount: fmt(state.crowns),
      empireValue: fmt(state.total),
      totalBaked: fmt(state.total),
      clickPower: fmt(clickPower()),
      buildingCount: buildingCount(),
      playTime: state.playSeconds < 3600
        ? `${Math.floor(state.playSeconds / 60)}m`
        : `${Math.floor(state.playSeconds / 3600)}h ${Math.floor(state.playSeconds % 3600 / 60)}m`,
      kingdomRank: rankName(),
      kingdomLevel: `EMPIRE LEVEL ${state.level}`,
      kingdomLevelBottom: `LEVEL ${state.level}`,
      buildingEstateCount: `${buildingCount()} ESTATES`,
      workerCountLabel: `${state.workers} WORKERS`,
      upgradeCountLabel: `${state.upgrades.length} / ${UPGRADES.length} OWNED`,
      inventoryCountLabel: `${Object.values(state.inventory).reduce((a, b) => a + b, 0)} ITEMS`,
      cosmeticCountLabel: `${state.cosmetics.length} OWNED`,
      achievementCount: `${state.claimedAchievements.length} / ${ACHIEVEMENTS.length}`
    };

    Object.entries(values).forEach(([id, value]) => {
      const el = $(id);
      if (el) el.textContent = value;
    });

    const progressTarget = state.level * state.level * 100;
    const previous = (state.level - 1) * (state.level - 1) * 100;

    const pct = Math.min(
      100,
      Math.max(
        0,
        (state.total - previous) /
        Math.max(1, progressTarget - previous) * 100
      )
    );

    if ($("empireProgressText")) {
      $("empireProgressText").textContent =
        `${fmt(Math.max(0, state.total - previous))} / ${fmt(progressTarget - previous)} cookies`;
    }

    if ($("empireProgressBar")) {
      $("empireProgressBar").style.width = `${pct}%`;
    }

    if ($("dailyRewardStatus")) {
      $("dailyRewardStatus").textContent =
        Date.now() - state.dailyClaim >= DAY ? "READY" : "CLAIMED";
    }

    if ($("prestigeStatus")) {
      $("prestigeStatus").textContent =
        state.runTotal >= 1000000 ? "AVAILABLE" : "LOCKED";
    }

    if ($("prestigeButton")) {
      $("prestigeButton").disabled = state.runTotal < 1000000;
    }

    if ($("hireWorkerButton")) {
      $("hireWorkerButton").textContent =
        `HIRE WORKER · ${fmt(workerCost())} 🍪`;
    }

    if ($("trainWorkerButton")) {
      $("trainWorkerButton").textContent =
        `TRAIN WORKER · ${fmt(trainCost())} 🍪`;
    }

    if ($("gameSoundToggle")) {
      $("gameSoundToggle").textContent =
        `SOUND: ${state.settings.sound ? "ON" : "OFF"}`;

      $("gameSoundToggle").setAttribute(
        "aria-pressed",
        String(state.settings.sound)
      );
    }

    if ($("floatingNumbersToggle")) {
      $("floatingNumbersToggle").checked = !!state.settings.floating;
    }

    if ($("compactEffectsToggle")) {
      $("compactEffectsToggle").checked = !!state.settings.reduced;
    }

    document.body.classList.toggle(
      "ce-reduced-effects",
      !!state.settings.reduced
    );
  }

  function workerCost() {
    return Math.floor(25 * Math.pow(1.32, state.workers));
  }

  function trainCost() {
    return Math.floor(100 * Math.pow(1.55, state.trained));
  }

  function renderBadges() {
    const unread = state.notifications.filter(n => !n.read).length;
    const inv = Object.values(state.inventory).reduce((a, b) => a + b, 0);

    const n = $("notificationBadge");
    const i = $("inventoryBadge");

    if (n) {
      n.textContent = unread;
      n.hidden = !unread;
    }

    if (i) {
      i.textContent = inv;
      i.hidden = !inv;
    }
  }

  function itemCard(
    title,
    desc,
    meta,
    buttonText,
    action,
    disabled = false,
    icon = "✦"
  ) {
    return `
      <article class="ce-list-card">
        <div class="ce-list-icon">${icon}</div>
        <div class="ce-list-info">
          <strong>${escapeHTML(title)}</strong>
          <p>${escapeHTML(desc)}</p>
          <small>${escapeHTML(meta)}</small>
        </div>
        <button class="ce-gold-button" data-action="${action}" ${disabled ? "disabled" : ""}>
          ${buttonText}
        </button>
      </article>
    `;
  }

  function renderBuildings() {
    const root = $("buildingList");
    if (!root) return;

    root.innerHTML = BUILDINGS.map(b => {
      const owned = state.buildings[b.id] || 0;
      const cost = Math.floor(b.base * Math.pow(1.17, owned));

      return itemCard(
        `${b.icon} ${b.name} · ${owned}`,
        b.desc,
        `+${fmt(b.rate)} cookies/sec each · ${b.workers} workers each · Build time ${b.time} min`,
        `BUILD · ${fmt(cost)} 🍪`,
        `build:${b.id}`,
        state.cookies < cost,
        b.icon
      );
    }).join("");
  }

  function renderWorkforce() {
    const root = $("workforceList");
    if (!root) return;

    const assigned = Math.min(state.workers, buildingCount() * 2);

    if ($("workerPanelSummary")) {
      $("workerPanelSummary").innerHTML = `
        <div><span>TOTAL WORKERS</span><strong>${state.workers}</strong></div>
        <div><span>TRAINED</span><strong>${state.trained}</strong></div>
        <div><span>AVAILABLE</span><strong>${Math.max(0, state.workers - assigned)}</strong></div>
      `;
    }

    root.innerHTML = BUILDINGS
      .filter(b => (state.buildings[b.id] || 0) > 0)
      .map(b => itemCard(
        b.name,
        `${(state.buildings[b.id] || 0) * b.workers} workers recommended for this estate.`,
        `${state.buildings[b.id]} owned · ${fmt((state.buildings[b.id] || 0) * b.rate)} base cookies/sec`,
        "VIEW ESTATE",
        `focus:${b.id}`,
        false,
        b.icon
      ))
      .join("") ||
      '<div class="ce-empty-state">Build an estate to give your workers a place to work.</div>';
  }

  function renderUpgrades() {
    const root = $("upgradeList");
    if (!root) return;

    root.innerHTML = UPGRADES.map(u => {
      const owned = state.upgrades.includes(u.id);

      return itemCard(
        u.name,
        u.desc,
        `Royal research · ${fmt(u.cost)} cookies`,
        owned ? "PURCHASED" : `UNLOCK · ${fmt(u.cost)} 🍪`,
        `upgrade:${u.id}`,
        owned || state.cookies < u.cost,
        "⚒"
      );
    }).join("");
  }

  function renderInventory() {
    const root = $("inventoryList");
    if (!root) return;

    const items = [
      { id: "golden", name: "Golden Cookie", icon: "🌟", desc: "A rare golden treat. Consume it for 250 cookies." },
      { id: "crystal", name: "Sugar Crystal", icon: "💎", desc: "A crystallised ingredient. Consume it for 1,000 cookies." },
      { id: "royal", name: "Royal Biscuit", icon: "👑", desc: "A courtly delicacy. Consume it for 5,000 cookies." },
      { id: "dragon", name: "Dragon Cookie", icon: "🐉", desc: "A legendary bake. Consume it for 25,000 cookies." }
    ];

    root.innerHTML = items.map(x => {
      const count = state.inventory[x.id] || 0;

      return `
        <article class="ce-collection-card">
          <span>${x.icon}</span>
          <strong>${x.name}</strong>
          <p>${x.desc}</p>
          <small>QUANTITY: ${count}</small>
          <button class="ce-dark-button" data-action="consume:${x.id}" ${count < 1 ? "disabled" : ""}>
            CONSUME 1
          </button>
        </article>
      `;
    }).join("");

    if ($("inventoryCountLabel")) {
      $("inventoryCountLabel").textContent =
        `${Object.values(state.inventory).reduce((a, b) => a + b, 0)} ITEMS`;
    }
  }

  function renderCosmetics() {
    const root = $("cosmeticList");
    if (!root) return;

    root.innerHTML = COSMETICS.map(c => {
      const owned = state.cosmetics.includes(c.id);
      const equipped = state.equipped === c.id;

      return `
        <article class="ce-collection-card">
          <span>${c.icon}</span>
          <strong>${c.name}</strong>
          <p>${c.desc}</p>
          <small>${owned ? "OWNED" : `${fmt(c.cost)} COOKIES`}</small>
          <button class="ce-dark-button" data-action="cosmetic:${c.id}" ${!owned && state.cookies < c.cost ? "disabled" : ""}>
            ${equipped ? "EQUIPPED" : owned ? "EQUIP" : "UNLOCK"}
          </button>
        </article>
      `;
    }).join("");
  }

  function renderNotifications() {
    const root = $("notificationList");
    if (!root) return;

    root.innerHTML = state.notifications.length
      ? state.notifications.map(n => `
        <article class="ce-list-card ${n.read ? "is-read" : ""}">
          <div class="ce-list-icon">${n.type === "reward" ? "🎁" : "🔔"}</div>
          <div class="ce-list-info">
            <strong>${escapeHTML(n.title)}</strong>
            <p>${escapeHTML(n.message)}</p>
            <small>${new Date(n.time).toLocaleString()}</small>
          </div>
          <button class="ce-dark-button" data-action="read:${n.id}" ${n.read ? "disabled" : ""}>
            ${n.read ? "READ" : "MARK READ"}
          </button>
        </article>
      `).join("")
      : '<div class="ce-empty-state">Your royal messenger has no new notices.</div>';
  }

  function metricFor(q) {
    if (q.metric === "clicks") return state.clicks;
    if (q.metric === "buildingCount") return buildingCount();
    if (q.metric === "workers") return state.workers;
    return 0;
  }

  function renderQuests() {
    const root = $("questList");
    if (!root) return;

    root.innerHTML = QUESTS.map(q => {
      const progress = Math.min(q.goal, metricFor(q));
      const claimed = state.claimedQuests.includes(q.id);
      const done = progress >= q.goal;

      return `
        <article class="ce-list-card">
          <div class="ce-list-icon">📜</div>
          <div class="ce-list-info">
            <strong>${q.name}</strong>
            <p>${q.desc}</p>
            <small>${fmt(progress)} / ${fmt(q.goal)} · REWARD ${fmt(q.reward)} 🍪</small>
            <div class="ce-mini-progress">
              <span style="width:${progress / q.goal * 100}%"></span>
            </div>
          </div>
          <button class="ce-gold-button" data-action="quest:${q.id}" ${!done || claimed ? "disabled" : ""}>
            ${claimed ? "CLAIMED" : "CLAIM"}
          </button>
        </article>
      `;
    }).join("");

    if ($("questCountLabel")) {
      $("questCountLabel").textContent =
        `${state.claimedQuests.length} CLAIMED`;
    }

    const cr = $("contractList");

    if (cr) {
      cr.innerHTML = CONTRACTS.map(c => {
        const progress = Math.min(c.goal, state.total);
        const claimed = state.claimedContracts.includes(c.id);
        const done = progress >= c.goal;

        return `
          <article class="ce-list-card">
            <div class="ce-list-icon">📦</div>
            <div class="ce-list-info">
              <strong>${c.name}</strong>
              <p>${c.desc}</p>
              <small>${fmt(progress)} / ${fmt(c.goal)} · REWARD ${fmt(c.reward)} 🍪</small>
              <div class="ce-mini-progress">
                <span style="width:${progress / c.goal * 100}%"></span>
              </div>
            </div>
            <button class="ce-gold-button" data-action="contract:${c.id}" ${!done || claimed ? "disabled" : ""}>
              ${claimed ? "CLAIMED" : "CLAIM"}
            </button>
          </article>
        `;
      }).join("");
    }
  }

  function renderAchievements() {
    const root = $("achievementList");
    if (!root) return;

    root.innerHTML = ACHIEVEMENTS.map(a => {
      const unlocked = a.test(state);
      const claimed = state.claimedAchievements.includes(a.id);

      return `
        <article class="ce-list-card">
          <div class="ce-list-icon">🏆</div>
          <div class="ce-list-info">
            <strong>${a.name}</strong>
            <p>${a.desc}</p>
            <small>${claimed ? "REWARD CLAIMED" : unlocked ? `UNLOCKED · ${fmt(a.reward)} COOKIE REWARD` : "NOT YET UNLOCKED"}</small>
          </div>
          <button class="ce-gold-button" data-action="achievement:${a.id}" ${!unlocked || claimed ? "disabled" : ""}>
            ${claimed ? "CLAIMED" : unlocked ? "CLAIM" : "LOCKED"}
          </button>
        </article>
      `;
    }).join("");

    if ($("achievementCount")) {
      $("achievementCount").textContent =
        `${state.claimedAchievements.length} / ${ACHIEVEMENTS.length}`;
    }
  }

  function renderStatistics() {
    const root = $("statisticsGrid");
    if (!root) return;

    const stats = [
      ["TOTAL COOKIES BAKED", fmt(state.total)],
      ["COOKIES THIS REIGN", fmt(state.runTotal)],
      ["MANUAL BAKES", fmt(state.clicks)],
      ["COOKIES PER SECOND", fmt(rate())],
      ["BUILDINGS OWNED", buildingCount()],
      ["WORKFORCE", state.workers],
      ["ROYAL CROWNS", state.crowns],
      ["UPGRADES", state.upgrades.length],
      ["PLAY TIME", `${Math.floor(state.playSeconds / 60)} minutes`],
      ["ROYAL CONTRACTS", state.stats.contracts || 0]
    ];

    root.innerHTML = stats.map(([k, v]) => `
      <div class="ce-stat-card">
        <span>${k}</span>
        <strong>${v}</strong>
      </div>
    `).join("");

    const book = $("collectionBook");

    if (book) {
      book.innerHTML = ["golden", "crystal", "royal", "dragon"].map(id => `
        <article class="ce-collection-card">
          <span>${({ golden: "🌟", crystal: "💎", royal: "👑", dragon: "🐉" })[id]}</span>
          <strong>${id.toUpperCase()} COOKIE</strong>
          <small>${state.inventory[id] || 0} COLLECTED</small>
        </article>
      `).join("");
    }
  }

  function renderEvent() {
    const el = $("royalEventPanel");

    if (el) {
      el.innerHTML = `
        <strong>${escapeHTML(state.event.name)}</strong>
        <p>${escapeHTML(state.event.description)}</p>
        <small>ROYAL COURT NOTICE</small>
      `;
    }
  }

  function renderAll() {
    state.level = levelFor(state.total);

    renderResources();
    renderBadges();
    renderBuildings();
    renderWorkforce();
    renderUpgrades();
    renderInventory();
    renderCosmetics();
    renderNotifications();
    renderQuests();
    renderAchievements();
    renderStatistics();
    renderEvent();
  }

/* =========================================================
   GAME PROGRESSION
========================================================= */

function checkProgress() {
  const oldLevel = state.level;
  state.level = levelFor(state.total);

  if (state.level > oldLevel) {
    notify(
      "Empire level increased!",
      `Your empire reached level ${state.level}. The court recognises your progress.`,
      "reward"
    );
  }
}

function build(id) {
  const b = BUILDINGS.find(x => x.id === id);
  if (!b) return;

  const owned = state.buildings[id] || 0;
  const cost = Math.floor(b.base * Math.pow(1.17, owned));

  if (!spend(cost)) return;

  state.buildings[id] = owned + 1;
  state.stats.builds++;

  notify(
    "New estate constructed",
    `${b.name} has joined your cookie empire.`
  );

  renderAll();
  scheduleSave();
}

function hireWorker() {
  const cost = workerCost();
  if (!spend(cost)) return;

  state.workers++;

  notify(
    "Worker hired",
    "A new baker has joined your royal workforce."
  );

  renderAll();
  scheduleSave();
}

function trainWorker() {
  if (state.trained >= state.workers) {
    toast("Hire a worker before training another.");
    return;
  }

  const cost = trainCost();
  if (!spend(cost)) return;

  state.trained++;

  toast("Worker training completed.");
  renderAll();
  scheduleSave();
}

function autoAssign() {
  if (!state.workers) {
    toast("Hire workers first.");
    return;
  }

  state.trained = state.workers;

  toast("Your workforce has been trained and assigned.");
  renderAll();
  scheduleSave();
}

function buyUpgrade(id) {
  const u = UPGRADES.find(x => x.id === id);

  if (!u || state.upgrades.includes(id)) return;
  if (!spend(u.cost)) return;

  state.upgrades.push(id);

  notify(
    "Royal upgrade unlocked",
    `${u.name} is now active.`
  );

  renderAll();
  scheduleSave();
}

function consumeItem(id) {
  const values = {
    golden: 250,
    crystal: 1000,
    royal: 5000,
    dragon: 25000
  };

  if (!(state.inventory[id] > 0)) return;

  state.inventory[id]--;

  addCookies(values[id], "item");

  toast(`Consumed item: +${fmt(values[id])} cookies.`);

  renderAll();
  scheduleSave();
}

/* =========================================================
   GAME ACTION HANDLER
========================================================= */

function handleAction(action) {
  const [type, id] = action.split(":");

  switch (type) {
    case "build":
      build(id);
      break;

    case "upgrade":
      buyUpgrade(id);
      break;

    case "consume":
      consumeItem(id);
      break;

    case "cosmetic": {
      const c = COSMETICS.find(x => x.id === id);
      if (!c) return;

      if (!state.cosmetics.includes(id)) {
        if (!spend(c.cost)) return;
        state.cosmetics.push(id);
      }

      state.equipped = id;
      document.body.dataset.cookieTheme = id;

      renderAll();
      scheduleSave();
      break;
    }

    case "read": {
      const n = state.notifications.find(
        x => String(x.id) === id
      );

      if (n) n.read = true;

      renderNotifications();
      renderBadges();
      scheduleSave();
      break;
    }

    case "quest": {
      const q = QUESTS.find(x => x.id === id);

      if (
        !q ||
        state.claimedQuests.includes(id) ||
        metricFor(q) < q.goal
      ) return;

      state.claimedQuests.push(id);
      addCookies(q.reward, "quest");

      toast(`Quest reward: ${fmt(q.reward)} cookies.`);

      renderAll();
      scheduleSave();
      break;
    }

    case "contract": {
      const c = CONTRACTS.find(x => x.id === id);

      if (
        !c ||
        state.claimedContracts.includes(id) ||
        state.total < c.goal
      ) return;

      state.claimedContracts.push(id);
      state.stats.contracts++;

      addCookies(c.reward, "contract");

      notify(
        "Royal contract completed",
        `${c.name} has been fulfilled.`
      );

      renderAll();
      scheduleSave();
      break;
    }

    case "achievement": {
      const a = ACHIEVEMENTS.find(x => x.id === id);

      if (
        !a ||
        state.claimedAchievements.includes(id) ||
        !a.test(state)
      ) return;

      state.claimedAchievements.push(id);
      addCookies(a.reward, "achievement");

      toast(`Achievement reward: ${fmt(a.reward)} cookies.`);

      renderAll();
      scheduleSave();
      break;
    }

    case "focus":
      setTab("buildings");
      break;
  }
}

/* =========================================================
   GAME TABS
========================================================= */

function setTab(tab) {
  activeTab = tab;

  document.querySelectorAll("[data-game-tab]").forEach(btn => {
    btn.classList.toggle(
      "active",
      btn.dataset.gameTab === tab
    );
  });

  document.querySelectorAll("[data-panel]").forEach(panel => {
    const active = panel.dataset.panel === tab;

    panel.hidden = !active;
    panel.classList.toggle("active", active);
  });
}

/* =========================================================
   COOKIE CLICK EFFECTS
========================================================= */

function floatingNumber(x, y, value) {
  if (!state.settings.floating) return;

  const el = document.createElement("span");
  el.className = "ce-floating-number";
  el.textContent = `+${fmt(value)}`;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  const scene = $("cookieScene");

  if (scene) {
    scene.append(el);
    setTimeout(() => el.remove(), 1000);
  }
}

function playClickSound() {
  if (!state.settings.sound) return;

  try {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = 520;

    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + 0.08
    );

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);

    osc.onended = () => ctx.close();
  } catch (error) {
    // Audio is optional.
  }
}

function bake(event) {
  const amount = clickPower();

  addCookies(amount, "click");
  playClickSound();

  if (event) {
    const rect = $("cookieScene").getBoundingClientRect();

    floatingNumber(
      event.clientX - rect.left,
      event.clientY - rect.top,
      amount
    );
  }

  const cookie = $("giantCookie");

  if (cookie) {
    cookie.classList.remove("is-clicked");
    void cookie.offsetWidth;
    cookie.classList.add("is-clicked");
  }

  renderResources();
  renderQuests();
  renderAchievements();
  scheduleSave();
}

/* =========================================================
   DAILY REWARD
========================================================= */

function dailyReward() {
  if (Date.now() - state.dailyClaim < DAY) {
    toast("Your daily royal gift has already been claimed.");
    return;
  }

  const reward = Math.max(
    100,
    Math.floor(500 + rate() * 120)
  );

  state.dailyClaim = Date.now();

  addCookies(reward, "daily");

  const drops = ["golden", "crystal", "royal", "dragon"];
  const chance = Math.random();

  if (chance > 0.82) {
    const id = drops[
      Math.floor(Math.random() * drops.length)
    ];

    state.inventory[id] = (state.inventory[id] || 0) + 1;

    notify(
      "A rare royal gift!",
      `You discovered a ${id} cookie in your daily gift.`,
      "reward"
    );
  }

  notify(
    "Daily royal gift claimed",
    `The crown granted ${fmt(reward)} cookies.`,
    "reward"
  );

  toast(`Daily gift claimed: +${fmt(reward)} cookies.`);

  renderAll();
  scheduleSave();
}

/* =========================================================
   ROYAL PRESTIGE
========================================================= */

function prestige() {
  if (state.runTotal < 1000000) return;

  if (!confirm(
    "Begin a Royal Prestige? Your current cookies, buildings, workers and upgrades will reset. Your lifetime total and crowns will remain."
  )) return;

  const earned = Math.max(
    1,
    Math.floor(Math.sqrt(state.runTotal / 1000000))
  );

  const crowns = state.crowns + earned;
  const lifetime = state.total;
  const play = state.playSeconds;
  const claims = state.claimedAchievements;
  const cosmetics = state.cosmetics;
  const equipped = state.equipped;
  const notifications = state.notifications;

  state = freshState();

  state.total = lifetime;
  state.playSeconds = play;
  state.claimedAchievements = claims;
  state.cosmetics = cosmetics;
  state.equipped = equipped;
  state.notifications = notifications;
  state.crowns = crowns;

  state.stats.prestiges =
    (state.stats.prestiges || 0) + 1;

  notify(
    "Royal Prestige achieved",
    `You earned ${earned} royal crown${earned === 1 ? "" : "s"}. Your next reign begins now.`,
    "reward"
  );

  renderAll();
  saveGame(true);

  toast(`Prestige complete. +${earned} royal crowns.`);
}

/* =========================================================
   SAVE MANAGEMENT
========================================================= */

function resetGame() {
  if (!confirm(
    "Reset your entire Cookie Emperor save? This cannot be undone."
  )) return;

  localStorage.removeItem(SAVE_KEY);

  state = freshState();

  renderAll();
  toast("Your empire has been reset.");
  saveGame(true);
}

function exportSave() {
  const blob = new Blob(
    [JSON.stringify(state, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "cookie-emperor-save.json";
  a.click();

  URL.revokeObjectURL(url);
}

function importSave(file) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);

      if (
        !data ||
        typeof data !== "object" ||
        !data.buildings
      ) {
        throw new Error("Invalid save");
      }

      if (!confirm(
        "Import this save and replace your current empire?"
      )) return;

      state = {
        ...freshState(),
        ...data,
        buildings: { ...data.buildings },
        settings: {
          ...freshState().settings,
          ...data.settings
        }
      };

      renderAll();
      saveGame(true);

      toast("Save imported successfully.");
    } catch (error) {
      toast("That save file is invalid.");
    }
  };

  reader.readAsText(file);
}

/* =========================================================
   GAME NAVIGATION — VERCEL + NETLIFY
========================================================= */

function enterGame() {
  document.body.classList.add("cookie-emperor-mode");

  siteMain.hidden = true;
  gameView.hidden = false;

  const header = $("siteHeader");
  if (header) header.hidden = true;

  const effects = document.querySelector(".background-effects");
  if (effects) effects.hidden = true;

  const loader = $("pageLoader");
  if (loader) loader.hidden = true;

  window.scrollTo(0, 0);

  if (!gameLoop) {
    loadGame();
    renderAll();

    gameLoop = setInterval(tick, 1000);
  }
}

function exitGame() {
  document.body.classList.remove("cookie-emperor-mode");

  gameView.hidden = true;
  siteMain.hidden = false;

  const header = $("siteHeader");
  if (header) header.hidden = false;

  const effects = document.querySelector(".background-effects");
  if (effects) effects.hidden = false;
}

function route() {
  if (location.hash === "#cookie-emperor") {
    enterGame();
  } else {
    const wasGame =
      document.body.classList.contains("cookie-emperor-mode");

    exitGame();

    if (wasGame && gameLoop) {
      saveGame(true);
    }
  }
}

/* =========================================================
   GAME LOOP
========================================================= */

function tick() {
  const now = Date.now();

  const elapsed = Math.min(
    5,
    Math.max(0, (now - state.lastTick) / 1000)
  );

  state.lastTick = now;

  if (elapsed > 0) {
    const earned = rate() * elapsed;

    if (earned) {
      addCookies(earned, "production");
    }

    state.playSeconds += elapsed;
  }

  if (state.event.ends < Date.now()) {
    const events = [
      {
        name: "Royal Baking Festival",
        description: "The kingdom celebrates! Your bakers work with renewed energy."
      },
      {
        name: "The Sugar Merchant",
        description: "A travelling merchant brings rare ingredients to the royal court."
      },
      {
        name: "The Emperor's Banquet",
        description: "The royal kitchens are busy preparing a magnificent feast."
      }
    ];

    state.event = events[
      Math.floor(Math.random() * events.length)
    ];

    state.event.ends = Date.now() + 180000;
    state.stats.events++;

    notify(
      "A royal event has begun",
      state.event.name + " — " + state.event.description
    );

    renderEvent();
  }

  renderResources();

  if (Math.floor(state.playSeconds) % 10 === 0) {
    renderQuests();
  }

  if (Math.floor(state.playSeconds) % 15 === 0) {
    scheduleSave();
  }
}

/* =========================================================
   EVENT LISTENERS
========================================================= */

// Hash routing works without separate game HTML files.
window.addEventListener("hashchange", route);

// Back to arcade.
document.addEventListener("click", event => {
  const back = event.target.closest(".game-back");

  if (back) {
    event.preventDefault();

    if (location.hash !== "#games") {
      location.hash = "games";
    } else {
      route();
    }

    return;
  }
});

// Game tabs and dynamic actions.
document.addEventListener("click", event => {
  const tab = event.target.closest("[data-game-tab]");

  if (tab) {
    setTab(tab.dataset.gameTab);
    return;
  }

  const action = event.target.closest("[data-action]");

  if (action) {
    handleAction(action.dataset.action);
    return;
  }
});

// Main cookie.
if ($("giantCookie")) {
  $("giantCookie").addEventListener("click", bake);
}

// Workforce.
if ($("hireWorkerButton")) {
  $("hireWorkerButton").addEventListener("click", hireWorker);
}

if ($("trainWorkerButton")) {
  $("trainWorkerButton").addEventListener("click", trainWorker);
}

if ($("autoAssignButton")) {
  $("autoAssignButton").addEventListener("click", autoAssign);
}

// Rewards and prestige.
if ($("dailyRewardButton")) {
  $("dailyRewardButton").addEventListener("click", dailyReward);
}

if ($("prestigeButton")) {
  $("prestigeButton").addEventListener("click", prestige);
}

// Sound.
if ($("gameSoundToggle")) {
  $("gameSoundToggle").addEventListener("click", () => {
    state.settings.sound = !state.settings.sound;

    renderResources();
    scheduleSave();
  });
}

// Save controls.
if ($("saveGameButton")) {
  $("saveGameButton").addEventListener("click", () => {
    saveGame(false);
  });
}

if ($("exportGameButton")) {
  $("exportGameButton").addEventListener("click", exportSave);
}

if ($("importGameButton")) {
  $("importGameButton").addEventListener("click", () => {
    $("importSaveFile")?.click();
  });
}

if ($("importSaveFile")) {
  $("importSaveFile").addEventListener("change", event => {
    importSave(event.target.files[0]);
  });
}

if ($("resetGameButton")) {
  $("resetGameButton").addEventListener("click", resetGame);
}

// Notifications.
if ($("clearNotificationsButton")) {
  $("clearNotificationsButton").addEventListener("click", () => {
    state.notifications = state.notifications.filter(n => !n.read);

    renderNotifications();
    renderBadges();
    scheduleSave();
  });
}

// Settings.
if ($("floatingNumbersToggle")) {
  $("floatingNumbersToggle").addEventListener("change", event => {
    state.settings.floating = event.target.checked;
    scheduleSave();
  });
}

if ($("compactEffectsToggle")) {
  $("compactEffectsToggle").addEventListener("change", event => {
    state.settings.reduced = event.target.checked;

    renderResources();
    scheduleSave();
  });
}

// Save before leaving.
window.addEventListener("beforeunload", () => {
  saveGame(true);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    saveGame(true);
  } else {
    state.lastTick = Date.now();
  }
});

// Modal PLAY NOW uses the same game route.
const modalPlay = $("modalPlay");

if (modalPlay) {
  modalPlay.addEventListener("click", event => {
    event.preventDefault();

    if (location.hash !== "#cookie-emperor") {
      location.hash = "cookie-emperor";
    } else {
      route();
    }

    const modal = $("detailsModal");

    if (modal) {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    }
  });
}

// Available game cards launch Cookie Emperor.
document.querySelectorAll(
  '.game-card[data-status="available"]'
).forEach(card => {
  card.addEventListener("click", event => {
    if (event.target.closest("button")) return;

    const link = card.dataset.link;

    if (link === "#cookie-emperor") {
      event.preventDefault();

      if (location.hash !== "#cookie-emperor") {
        location.hash = "cookie-emperor";
      } else {
        route();
      }
    }
  });
});

// Initialize the correct screen on page load.
route();

})();
