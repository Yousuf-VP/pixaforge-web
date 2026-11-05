
// ==========================================
// KIWAMI — MAIN JAVASCRIPT
// ==========================================


// STAR BACKGROUND

const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

let stars = [];
let canvasWidth = 0;
let canvasHeight = 0;

function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvas.width = canvasWidth * ratio;
    canvas.height = canvasHeight * ratio;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    createStars();
}

function createStars() {
    const count = Math.min(
        Math.floor((canvasWidth * canvasHeight) / 9500),
        180
    );

    stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        radius: Math.random() * 1.2 + 0.2,
        alpha: Math.random() * 0.6 + 0.15,
        speed: Math.random() * 0.15 + 0.025
    }));
}

function drawStars() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (const star of stars) {
        star.alpha += (Math.random() - 0.5) * 0.025;
        star.alpha = Math.max(0.1, Math.min(star.alpha, 0.8));

        star.y -= star.speed;

        if (star.y < -5) {
            star.y = canvasHeight + 5;
            star.x = Math.random() * canvasWidth;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(211, 190, 255, ${star.alpha})`;
        ctx.fill();
    }

    requestAnimationFrame(drawStars);
}

resizeCanvas();
drawStars();

window.addEventListener("resize", resizeCanvas);


// HEADER SCROLL EFFECT

const siteHeader = document.getElementById("siteHeader");

window.addEventListener("scroll", () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 30);
});


// MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".nav-link");

menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});


// ACTIVE NAVIGATION

const sections = document.querySelectorAll("main section[id]");

const activeSectionObserver = new IntersectionObserver(entries => {
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

sections.forEach(section => activeSectionObserver.observe(section));


// SCROLL REVEAL

const revealElements = document.querySelectorAll(".reveal");

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

revealElements.forEach(element => revealObserver.observe(element));


// CAROUSEL DIRECTION CONTROLS

const gamesTrack = document.getElementById("gamesTrack");
const carouselPrev = document.getElementById("carouselPrev");
const carouselNext = document.getElementById("carouselNext");
const gamesWindow = document.getElementById("gamesWindow");

carouselNext.addEventListener("click", () => {
    gamesTrack.style.animationDirection = "normal";
    gamesTrack.style.animationPlayState = "running";
});

carouselPrev.addEventListener("click", () => {
    gamesTrack.style.animationDirection = "reverse";
    gamesTrack.style.animationPlayState = "running";
});

gamesWindow.addEventListener("mouseenter", () => {
    gamesTrack.style.animationPlayState = "paused";
});

gamesWindow.addEventListener("mouseleave", () => {
    gamesTrack.style.animationPlayState = "running";
});


// FOOTER YEAR

document.getElementById("currentYear").textContent =
    new Date().getFullYear();


// ==========================================
// SHOOT-STREAK GAME
// ==========================================

const shootModal = document.getElementById("shootModal");
const closeShoot = document.getElementById("closeShoot");
const modalBackdrop = document.getElementById("modalBackdrop");

const shootArena = document.getElementById("shootArena");
const shootTarget = document.getElementById("shootTarget");
const arenaMessage = document.getElementById("arenaMessage");
const startShoot = document.getElementById("startShoot");

const scoreValue = document.getElementById("scoreValue");
const streakValue = document.getElementById("streakValue");
const timeValue = document.getElementById("timeValue");
const bestValue = document.getElementById("bestValue");

let score = 0;
let streak = 0;
let timeLeft = 30;
let gameRunning = false;
let gameTimer = null;

let bestScore = Number(localStorage.getItem("kiwamiShootBest")) || 0;

bestValue.textContent = bestScore;


// OPEN GAME

function openShootGame() {
    shootModal.classList.add("open");
    shootModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    resetShootGame();
}

document.querySelectorAll('[data-game="shoot"]').forEach(button => {
    button.addEventListener("click", openShootGame);
});


// CLOSE GAME

function closeShootGame() {
    stopShootGame();

    shootModal.classList.remove("open");
    shootModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");
}

closeShoot.addEventListener("click", closeShootGame);
modalBackdrop.addEventListener("click", closeShootGame);

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && shootModal.classList.contains("open")) {
        closeShootGame();
    }
});


// RESET GAME

function resetShootGame() {
    stopShootGame();

    score = 0;
    streak = 0;
    timeLeft = 30;

    scoreValue.textContent = score;
    streakValue.textContent = streak;
    timeValue.textContent = timeLeft;
    bestValue.textContent = bestScore;

    shootTarget.style.display = "none";

    arenaMessage.classList.remove("hidden");
    arenaMessage.innerHTML = `
        <span class="arena-message-icon">✳</span>
        <h3>READY?</h3>
        <p>Hit the target as many times as you can in 30 seconds.</p>
    `;

    startShoot.textContent = "START GAME →";
    startShoot.disabled = false;
}


// STOP GAME

function stopShootGame() {
    gameRunning = false;

    if (gameTimer !== null) {
        clearInterval(gameTimer);
        gameTimer = null;
    }

    shootTarget.style.display = "none";
}


// MOVE TARGET

function moveTarget() {
    const arenaRect = shootArena.getBoundingClientRect();

    const targetWidth = shootTarget.offsetWidth || 43;
    const targetHeight = shootTarget.offsetHeight || 43;

    const padding = 30;

    const maxX = arenaRect.width - targetWidth - padding;
    const maxY = arenaRect.height - targetHeight - padding;

    const minX = padding;
    const minY = padding;

    const x = minX + Math.random() * Math.max(0, maxX - minX);
    const y = minY + Math.random() * Math.max(0, maxY - minY);

    shootTarget.style.left = `${x + targetWidth / 2}px`;
    shootTarget.style.top = `${y + targetHeight / 2}px`;
}


// START GAME

function startShootGame() {
    resetShootGame();

    gameRunning = true;
    arenaMessage.classList.add("hidden");

    shootTarget.style.display = "flex";
    startShoot.textContent = "GAME RUNNING";
    startShoot.disabled = true;

    moveTarget();

    gameTimer = setInterval(() => {
        timeLeft--;

        timeValue.textContent = timeLeft;

        if (timeLeft <= 0) {
            endShootGame();
        }
    }, 1000);
}

startShoot.addEventListener("click", startShootGame);


// HIT TARGET

shootTarget.addEventListener("click", event => {
    event.stopPropagation();

    if (!gameRunning) return;

    score++;
    streak++;

    scoreValue.textContent = score;
    streakValue.textContent = streak;

    moveTarget();
});


// MISSED TARGET

shootArena.addEventListener("click", event => {
    if (!gameRunning) return;

    if (
        event.target !== shootTarget &&
        !shootTarget.contains(event.target)
    ) {
        streak = 0;
        streakValue.textContent = streak;
    }
});


// END GAME

function endShootGame() {
    stopShootGame();

    if (score > bestScore) {
        bestScore = score;

        localStorage.setItem("kiwamiShootBest", bestScore);
        bestValue.textContent = bestScore;
    }

    arenaMessage.classList.remove("hidden");

    arenaMessage.innerHTML = `
        <span class="arena-message-icon">✳</span>
        <h3>TIME'S UP.</h3>
        <p>
            You scored <strong>${score}</strong> points.
            Your best score is <strong>${bestScore}</strong>.
        </p>
    `;

    startShoot.disabled = false;
    startShoot.textContent = "PLAY AGAIN →";
}


// PREVENT ACCIDENTAL PAGE SCROLL WHILE PLAYING ON MOBILE

shootTarget.addEventListener("touchstart", event => {
    if (gameRunning) event.preventDefault();
}, { passive: false });
