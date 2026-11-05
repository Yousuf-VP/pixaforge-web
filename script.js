
/* =========================================
   KIWAMI — MAIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    // PAGE LOADER
    const pageLoader = $("#pageLoader");

    window.addEventListener("load", () => {
        setTimeout(() => {
            pageLoader?.classList.add("loaded");
        }, 450);
    });

    // FALLBACK IF LOAD EVENT ALREADY FIRED
    if (document.readyState === "complete") {
        setTimeout(() => pageLoader?.classList.add("loaded"), 450);
    }

    // FOOTER YEAR
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();

    // STAR BACKGROUND
    const stars = $("#stars");

    if (stars) {
        for (let i = 0; i < 85; i++) {
            const star = document.createElement("span");
            star.className = "star";
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 4}s`;
            star.style.animationDuration = `${2 + Math.random() * 4}s`;
            stars.appendChild(star);
        }
    }

    // FLOATING HEADER
    const siteHeader = $("#siteHeader");

    function updateHeader() {
        siteHeader?.classList.toggle("scrolled", window.scrollY > 35);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    // MOBILE NAVIGATION
    const menuToggle = $("#menuToggle");
    const mainNav = $("#mainNav");

    menuToggle?.addEventListener("click", () => {
        const isOpen = mainNav?.classList.toggle("open") ?? false;
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    $$(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            mainNav?.classList.remove("open");
            menuToggle?.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", event => {
        if (
            mainNav &&
            menuToggle &&
            !mainNav.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            mainNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });

    // SCROLL REVEAL
    const revealElements = $$(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach(element => revealObserver.observe(element));
    } else {
        revealElements.forEach(element => element.classList.add("visible"));
    }

    // ACTIVE NAVIGATION
    const sections = $$("main section[id]");
    const navLinks = $$(".nav-link");

    if ("IntersectionObserver" in window) {
        const navObserver = new IntersectionObserver(entries => {
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

        sections.forEach(section => navObserver.observe(section));
    }

    // CAROUSEL CONTROLS
    const gamesTrack = $("#gamesTrack");
    const carouselWindow = $("#carouselWindow");
    const carouselPrev = $("#carouselPrev");
    const carouselNext = $("#carouselNext");

    let carouselPaused = false;

    function pauseCarousel() {
        if (!gamesTrack) return;
        carouselPaused = true;
        gamesTrack.style.animationPlayState = "paused";
    }

    function resumeCarousel() {
        if (!gamesTrack) return;
        carouselPaused = false;
        gamesTrack.style.animationPlayState = "running";
    }

    carouselPrev?.addEventListener("click", () => {
        pauseCarousel();
        if (gamesTrack) {
            const current = getComputedStyle(gamesTrack).transform;
            const matrix = new DOMMatrixReadOnly(current);
            gamesTrack.style.transform = `translateX(${matrix.m41 + 300}px)`;
        }
    });

    carouselNext?.addEventListener("click", () => {
        pauseCarousel();
        if (gamesTrack) {
            const current = getComputedStyle(gamesTrack).transform;
            const matrix = new DOMMatrixReadOnly(current);
            gamesTrack.style.transform = `translateX(${matrix.m41 - 300}px)`;
        }
    });

    carouselWindow?.addEventListener("mouseenter", pauseCarousel);
    carouselWindow?.addEventListener("mouseleave", () => {
        if (!carouselPaused) resumeCarousel();
    });

    // SHOOT-STREAK GAME
    const shootModal = $("#shootModal");
    const closeShoot = $("#closeShoot");
    const shootArena = $("#shootArena");
    const shootTarget = $("#shootTarget");
    const arenaMessage = $("#arenaMessage");
    const startShoot = $("#startShoot");

    const scoreDisplay = $("#shootScore");
    const timeDisplay = $("#shootTime");
    const streakDisplay = $("#shootStreak");
    const bestDisplay = $("#shootBest");

    let score = 0;
    let streak = 0;
    let timeLeft = 30;
    let gameRunning = false;
    let gameTimer = null;

    let bestScore = Number(localStorage.getItem("kiwamiShootBest")) || 0;

    if (bestDisplay) bestDisplay.textContent = bestScore;

    function openShootGame() {
        if (!shootModal) return;

        shootModal.classList.add("open");
        shootModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        resetShootGame();
    }

    function closeShootGame() {
        if (!shootModal) return;

        stopShootGame();
        shootModal.classList.remove("open");
        shootModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    }

    function resetShootGame() {
        stopShootGame();

        score = 0;
        streak = 0;
        timeLeft = 30;

        updateShootHUD();

        if (shootTarget) shootTarget.hidden = true;

        if (arenaMessage) {
            arenaMessage.style.display = "flex";
            arenaMessage.innerHTML = `
                <h3>READY?</h3>
                <p>Hit as many targets as you can in 30 seconds.</p>
                <button class="button button-primary" id="startShoot">START GAME</button>
            `;

            $("#startShoot", arenaMessage)?.addEventListener("click", startShootGame);
        }
    }

    function updateShootHUD() {
        if (scoreDisplay) scoreDisplay.textContent = score;
        if (timeDisplay) timeDisplay.textContent = timeLeft;
        if (streakDisplay) streakDisplay.textContent = streak;
        if (bestDisplay) bestDisplay.textContent = bestScore;
    }

    function moveShootTarget() {
        if (!shootArena || !shootTarget) return;

        const maxX = Math.max(0, shootArena.clientWidth - shootTarget.offsetWidth);
        const maxY = Math.max(0, shootArena.clientHeight - shootTarget.offsetHeight);

        shootTarget.style.left = `${Math.random() * maxX}px`;
        shootTarget.style.top = `${Math.random() * maxY}px`;
    }

    function startShootGame() {
        if (gameRunning) return;

        score = 0;
        streak = 0;
        timeLeft = 30;
        gameRunning = true;

        if (arenaMessage) arenaMessage.style.display = "none";
        if (shootTarget) shootTarget.hidden = false;

        updateShootHUD();
        moveShootTarget();

        gameTimer = setInterval(() => {
            timeLeft--;
            updateShootHUD();

            if (timeLeft <= 0) {
                endShootGame();
            }
        }, 1000);
    }

    function stopShootGame() {
        gameRunning = false;

        if (gameTimer) {
            clearInterval(gameTimer);
            gameTimer = null;
        }
    }

    function endShootGame() {
        stopShootGame();

        if (shootTarget) shootTarget.hidden = true;

        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem("kiwamiShootBest", bestScore);
        }

        updateShootHUD();

        if (arenaMessage) {
            arenaMessage.style.display = "flex";
            arenaMessage.innerHTML = `
                <h3>TIME'S UP.</h3>
                <p>You scored <strong>${score}</strong> points. Best score: <strong>${bestScore}</strong>.</p>
                <button class="button button-primary" id="startShoot">PLAY AGAIN</button>
            `;

            $("#startShoot", arenaMessage)?.addEventListener("click", startShootGame);
        }
    }

    shootTarget?.addEventListener("click", () => {
        if (!gameRunning) return;

        score += 10;
        streak++;

        updateShootHUD();
        moveShootTarget();
    });

    startShoot?.addEventListener("click", startShootGame);
    closeShoot?.addEventListener("click", closeShootGame);

    shootModal?.addEventListener("click", event => {
        if (event.target === shootModal) closeShootGame();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && shootModal?.classList.contains("open")) {
            closeShootGame();
        }
    });

    $$(".play-game").forEach(button => {
        button.addEventListener("click", openShootGame);
    });
});
