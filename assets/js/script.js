// Theme detection and setting
function setTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  updateModeHint();
}

// Function to get the user's theme preference
function getThemePreference() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Initialize theme
const initialTheme = getThemePreference();
setTheme(initialTheme);

// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  const newTheme = document.body.classList.contains("dark-mode")
    ? "light"
    : "dark";
  setTheme(newTheme);
  localStorage.setItem("theme", newTheme);
  updateFunZoneVisibility(); // Call it here instead
});

// Listen for system theme changes
window.matchMedia("(prefers-color-scheme: dark)").addListener((e) => {
  if (!localStorage.getItem("theme")) {
    setTheme(e.matches ? "dark" : "light");
  }
});

// Particle system
const particleContainer = document.getElementById("particle-system");
const particleCount = 100;
const particles = [];

class Particle {
  constructor() {
    this.element = document.createElement("div");
    this.element.classList.add("particle");
    particleContainer.appendChild(this.element);

    this.reset();
  }

  reset() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.size = Math.random() * 5 + 2;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.element.style.width = `${this.size}px`;
    this.element.style.height = `${this.size}px`;
  }

  update(mouseX, mouseY, scroll) {
    // Regular movement
    this.x += this.speedX;
    this.y += this.speedY;

    // Boundary check
    if (this.x < 0 || this.x > window.innerWidth) this.speedX *= -1;
    if (this.y < 0 || this.y > window.innerHeight) this.speedY *= -1;

    // Mouse interaction
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 100) {
      this.x -= dx * 0.05;
      this.y -= dy * 0.05;
    }

    // Scroll interaction
    this.y += scroll * 0.1;

    // Apply position
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }
}

// Create particles
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

let mouseX = 0;
let mouseY = 0;
let lastScrollY = window.scrollY;

// Update function
function updateParticles() {
  const scrollDiff = window.scrollY - lastScrollY;
  lastScrollY = window.scrollY;

  particles.forEach((particle) => {
    particle.update(mouseX, mouseY, scrollDiff);
  });

  requestAnimationFrame(updateParticles);
}

// Event listeners
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

window.addEventListener("resize", () => {
  particles.forEach((particle) => particle.reset());
});

// Start animation
updateParticles();

// Interactive cursor
const cursor = document.querySelector(".cursor");
const cursorTrail = [];
const trailLength = 10;

for (let i = 0; i < trailLength; i++) {
  const trail = document.createElement("div");
  trail.classList.add("cursor-trail");
  document.body.appendChild(trail);
  cursorTrail.push(trail);
}

// Function to update cursor position
function updateCursorPosition(x, y) {
  gsap.to(cursor, {
    left: x,
    top: y,
    duration: 0.1,
  });

  cursorTrail.forEach((trail, index) => {
    setTimeout(() => {
      gsap.to(trail, {
        left: x,
        top: y,
        duration: 0.3,
        opacity: 1 - index / trailLength,
      });
    }, index * 30);
  });
}

// Mouse move event
document.addEventListener("mousemove", (e) => {
  updateCursorPosition(e.clientX, e.clientY);
});

// Touch events for mobile
document.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Prevent default touch behavior
  const touch = e.touches[0];
  updateCursorPosition(touch.clientX, touch.clientY);
});

document.addEventListener("touchmove", (e) => {
  e.preventDefault(); // Prevent default touch behavior
  const touch = e.touches[0];
  updateCursorPosition(touch.clientX, touch.clientY);
});

// Hover effect for links and buttons
const interactiveElements = document.querySelectorAll("a, button");

interactiveElements.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    gsap.to(cursor, {
      width: 40,
      height: 40,
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderWidth: 1,
      duration: 0.3,
    });
  });

  el.addEventListener("mouseleave", () => {
    gsap.to(cursor, {
      width: 20,
      height: 20,
      backgroundColor: "transparent",
      borderWidth: 2,
      duration: 0.3,
    });
  });
});

// Scroll to explore functionality
document.querySelector(".scroll-indicator").addEventListener("click", () => {
  const aboutSection = document.querySelector("#about");
  aboutSection.scrollIntoView({ behavior: "smooth" });
});

// Smooth scrolling for navigation links
document.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Typewriter effect
const typewriterText = document.querySelector(".typewriter");
const text = typewriterText.textContent;
typewriterText.textContent = "";
let i = 0;

function typeWriter() {
  if (i < text.length) {
    typewriterText.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, 50);
  } else {
    // Removing the cursor after typing is complete
    typewriterText.style.borderRight = "none";
    typewriterText.style.animation = "none";
  }
}

typeWriter();

// Scroll animations with GSAP
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray("section").forEach((section) => {
  gsap.from(section.querySelectorAll("h2, p, .project-card, .blog-post"), {
    y: 50,
    opacity: 0,
    duration: 0.7,
    stagger: 0.2,
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
    },
  });
});

// Fun Zone:
const lightCanvas = document.getElementById("lightCanvas");
const canvas = document.getElementById("cosmicCanvas");
const lightCtx = lightCanvas.getContext("2d");
const ctx = canvas.getContext("2d");
const addStarBtn = document.getElementById("addStar");
const connectStarsBtn = document.getElementById("connectStars");
const clearCanvasBtn = document.getElementById("clearCanvas");
const colorPicker = document.getElementById("colorPicker");
const colorPickerLabel = document.querySelector(".color-picker-label");

let stars = [];
let isConnecting = false;
let currentColor = "#ffffff";

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  lightCanvas.width = lightCanvas.offsetWidth;
  lightCanvas.height = lightCanvas.offsetHeight;
  drawStars();
}

// Light mode fun
let bubbles = [];
let butterflies = [];
let isBubblesActive = false;
let isButterfliesActive = false;
let bubbleSpeed = 1;
let score = 0;
let highestScore = 0;
let bubbleInterval;
let isGameOver = false;

function getRandomPastelColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 100%, 80%)`;
}

function createBubble() {
  bubbles.push({
    x: Math.random() * lightCanvas.width,
    y: lightCanvas.height + 20,
    size: Math.random() * 30 + 10, // Slightly larger size range
    speed: bubbleSpeed,
    color: getRandomPastelColor(),
  });
}
function getRandomButterFlyColor() {
  const hues = [0, 30, 60, 180, 240, 280]; // Red, Orange, Yellow, Cyan, Blue, Purple
  const hue = hues[Math.floor(Math.random() * hues.length)];
  return `hsl(${hue}, 100%, 70%)`;
}

function createButterfly() {
  butterflies.push({
    x: Math.random() * lightCanvas.width,
    y: Math.random() * lightCanvas.height,
    size: Math.random() * 15 + 10,
    speedX: Math.random() * 4 - 2,
    speedY: Math.random() * 4 - 2,
    wingAngle: 0,
    color: getRandomButterFlyColor(),
    flapSpeed: Math.random() * 0.2 + 0.1,
  });
}

function drawButterfly(butterfly) {
  lightCtx.save();
  lightCtx.translate(butterfly.x, butterfly.y);

  // Draw body
  lightCtx.beginPath();
  lightCtx.ellipse(
    0,
    0,
    butterfly.size / 8,
    butterfly.size / 2,
    0,
    0,
    Math.PI * 2
  );
  lightCtx.fillStyle = "black";
  lightCtx.fill();

  // Draw wings
  lightCtx.rotate((Math.sin(butterfly.wingAngle) * Math.PI) / 6);

  // Upper wings
  lightCtx.beginPath();
  lightCtx.moveTo(0, -butterfly.size / 4);
  lightCtx.quadraticCurveTo(
    butterfly.size,
    -butterfly.size,
    0,
    -butterfly.size
  );
  lightCtx.quadraticCurveTo(
    -butterfly.size,
    -butterfly.size,
    0,
    -butterfly.size / 4
  );
  lightCtx.fillStyle = butterfly.color;
  lightCtx.fill();

  // Lower wings
  lightCtx.beginPath();
  lightCtx.moveTo(0, butterfly.size / 4);
  lightCtx.quadraticCurveTo(
    butterfly.size * 0.8,
    butterfly.size * 0.8,
    0,
    butterfly.size * 0.75
  );
  lightCtx.quadraticCurveTo(
    -butterfly.size * 0.8,
    butterfly.size * 0.8,
    0,
    butterfly.size / 4
  );
  lightCtx.fillStyle = butterfly.color;
  lightCtx.fill();

  // Wing patterns
  lightCtx.strokeStyle = "rgba(0, 0, 0, 0.5)";
  lightCtx.lineWidth = 1;
  for (let i = 1; i <= 3; i++) {
    lightCtx.beginPath();
    lightCtx.arc(0, 0, (butterfly.size * i) / 4, 0, Math.PI, true);
    lightCtx.stroke();
  }

  lightCtx.restore();
}

function updateLightCanvas() {
  lightCtx.clearRect(0, 0, lightCanvas.width, lightCanvas.height);

  // Update and draw bubbles
  bubbles.forEach((bubble, index) => {
    bubble.y -= bubble.speed;

    lightCtx.beginPath();
    lightCtx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
    lightCtx.fillStyle = bubble.color;
    lightCtx.globalAlpha = 0.7; // Set a constant transparency
    lightCtx.fill();
    lightCtx.globalAlpha = 1;

    // Add a simple white highlight
    lightCtx.beginPath();
    lightCtx.arc(
      bubble.x - bubble.size / 3,
      bubble.y - bubble.size / 3,
      bubble.size / 4,
      0,
      Math.PI * 2
    );
    lightCtx.fillStyle = "rgba(255,255,255,0.5)";
    lightCtx.fill();

    if (bubble.y + bubble.size < 0) {
      bubbles.splice(index, 1);
      if (!isGameOver) {
        gameOver();
      }
    }
  });
  // Update and draw butterflies
  butterflies.forEach((butterfly) => {
    butterfly.x += butterfly.speedX;
    butterfly.y += butterfly.speedY;
    butterfly.wingAngle += butterfly.flapSpeed;

    if (butterfly.x < 0 || butterfly.x > lightCanvas.width)
      butterfly.speedX *= -1;
    if (butterfly.y < 0 || butterfly.y > lightCanvas.height)
      butterfly.speedY *= -1;

    drawButterfly(butterfly);
  });

  //drawScore(); // Add this line to draw the score

  if (isGameOver) {
    drawGlitchyGameOver();
  }

  requestAnimationFrame(updateLightCanvas);
}

function drawGlitchyGameOver() {
  const text = "Game Over!";
  const x = lightCanvas.width / 2;
  const y = lightCanvas.height / 2;

  lightCtx.font = "40px Arial";
  lightCtx.textAlign = "center";
  lightCtx.textBaseline = "middle";

  // Draw glitchy shadow
  lightCtx.fillStyle = "rgba(255, 0, 0, 0.7)";
  lightCtx.fillText(text, x + 4, y + 4);

  // Draw main text
  lightCtx.fillStyle = "white";
  lightCtx.fillText(text, x, y);

  // Random glitch effect
  if (Math.random() < 0.1) {
    const glitchX = Math.random() * lightCanvas.width;
    const glitchY = Math.random() * lightCanvas.height;
    const glitchWidth = Math.random() * 100 + 50;
    const glitchHeight = Math.random() * 30 + 15;
    const imageData = lightCtx.getImageData(
      glitchX,
      glitchY,
      glitchWidth,
      glitchHeight
    );
    lightCtx.putImageData(imageData, glitchX + Math.random() * 10 - 5, glitchY);
  }
}

function toggleBubbles() {
  if (isGameOver) {
    resetGame();
  } else if (isBubblesActive) {
    stopBubbleGame();
  } else {
    startBubbleGame();
  }
  updateScoreDisplay();
}

function toggleButterflies() {
  isButterfliesActive = !isButterfliesActive;
  const chaseButterfiesBtn = document.getElementById("chaseButterflies");
  chaseButterfiesBtn.textContent = isButterfliesActive
    ? "Stop Butterflies"
    : "Chase Butterflies";

  if (isButterfliesActive) {
    for (let i = 0; i < 5; i++) {
      createButterfly();
    }
    lightCanvas.addEventListener("mousemove", chaseButterflies);
  } else {
    butterflies = [];
    lightCanvas.removeEventListener("mousemove", chaseButterflies);
  }
}

function startBubbleGame() {
  isBubblesActive = true;
  score = 0; // Reset score when starting a new game
  bubbleSpeed = 1; // Reset bubble speed
  updateScoreDisplay();
  const popBubblesBtn = document.getElementById("popBubbles");
  popBubblesBtn.textContent = "Stop Bubbles";
  bubbleInterval = setInterval(createBubble, 1000);
  lightCanvas.addEventListener("click", popBubble);
}

function stopBubbleGame() {
  isBubblesActive = false;
  clearInterval(bubbleInterval);
  lightCanvas.removeEventListener("click", popBubble);
  const popBubblesBtn = document.getElementById("popBubbles");
  popBubblesBtn.textContent = "Pop Bubbles";
  bubbles = []; // Clear all bubbles
}

function updateScoreDisplay() {
  const scoreDisplay = document.querySelector(".score-display");
  const scoreElement = document.getElementById("currentScore");
  const highScoreElement = document.getElementById("highestScore");

  if (document.body.classList.contains("dark-mode")) {
    scoreDisplay.style.display = "none";
  } else {
    scoreDisplay.style.display = "block";
    if (scoreElement) scoreElement.textContent = score;
    if (highScoreElement) highScoreElement.textContent = highestScore;
  }
}

function popBubble(e) {
  if (isGameOver) return;

  const rect = lightCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  bubbles = bubbles.filter((bubble) => {
    const distance = Math.sqrt((bubble.x - x) ** 2 + (bubble.y - y) ** 2);
    if (distance <= bubble.size) {
      score++;
      bubbleSpeed += 0.01; // Increase speed
      updateScoreDisplay();
      return false; // Remove the bubble
    }
    return true;
  });

  // Update highest score
  if (score > highestScore) {
    highestScore = score;
    localStorage.setItem("highestBubbleScore", highestScore);
    updateScoreDisplay();
  }
}

function gameOver() {
  isGameOver = true;
  isBubblesActive = false;
  clearInterval(bubbleInterval);
  lightCanvas.removeEventListener("click", popBubble);
  document.getElementById("popBubbles").textContent = "Restart Game";

  // Start glitch effect
  glitchInterval = setInterval(() => {
    drawGlitchyGameOver();
  }, 100);
}

function resetGame() {
  isGameOver = false;
  score = 0;
  bubbleSpeed = 1;
  bubbles = [];
  clearInterval(glitchInterval);
  updateScoreDisplay();
  startBubbleGame();
}

function chaseButterflies(e) {
  const rect = lightCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  butterflies.forEach((butterfly) => {
    const dx = butterfly.x - x;
    const dy = butterfly.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100) {
      butterfly.speedX += dx / distance;
      butterfly.speedY += dy / distance;
    }
  });
}

// Add event listeners
document.getElementById("popBubbles").addEventListener("click", toggleBubbles);
document
  .getElementById("chaseButterflies")
  .addEventListener("click", toggleButterflies);

// Initialize the light canvas
function initLightCanvas() {
  lightCanvas.width = lightCanvas.offsetWidth;
  lightCanvas.height = lightCanvas.offsetHeight;

  // Load scores from cache
  score = parseInt(localStorage.getItem("currentBubbleScore")) || 0;
  highestScore = parseInt(localStorage.getItem("highestBubbleScore")) || 0;

  updateScoreDisplay();
  updateLightCanvas();
}

// Modify the window load event listener
window.addEventListener("load", () => {
  initLightCanvas();
  resizeCanvas();
  updateDarkCanvas();
  updateFunZoneVisibility();
});

window.addEventListener("resize", initLightCanvas);

function updateFunZoneVisibility() {
  const lightModeFun = document.getElementById("lightModeFun");
  const darkModeFun = document.getElementById("darkModeFun");
  const isDarkMode = document.body.classList.contains("dark-mode");

  if (isDarkMode) {
    lightModeFun.style.display = "none";
    darkModeFun.style.display = "block";
  } else {
    lightModeFun.style.display = "block";
    darkModeFun.style.display = "none";
  }

  updateScoreDisplay();
  updateModeHint();
}

//dark canvas
function addStar(x, y) {
  stars.push({
    x,
    y,
    color: currentColor,
    connections: [],
    size: Math.random() * 2 + 1,
    twinkle: Math.random(),
  });
  drawStars();
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw connections
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 0.5;
  stars.forEach((star) => {
    star.connections.forEach((connectedStar) => {
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(connectedStar.x, connectedStar.y);
      ctx.stroke();
    });
  });

  // Draw stars
  stars.forEach((star) => {
    const twinkle = Math.sin(Date.now() * 0.01 + star.twinkle * 10) * 0.2 + 0.8;

    ctx.fillStyle = star.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = star.color;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size * twinkle, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size * 2 * twinkle, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  });
}

function connectNearestStars() {
  stars.forEach((star) => {
    let nearest = null;
    let minDistance = Infinity;

    stars.forEach((otherStar) => {
      if (star !== otherStar && !star.connections.includes(otherStar)) {
        const distance = Math.hypot(star.x - otherStar.x, star.y - otherStar.y);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = otherStar;
        }
      }
    });

    if (nearest && minDistance < 100) {
      star.connections.push(nearest);
      nearest.connections.push(star);
    }
  });

  drawStars();
}

function clearCanvas() {
  stars = [];
  drawStars();
}

function animateCanvas() {
  drawStars();
  requestAnimationFrame(animateCanvas);
}

addStarBtn.addEventListener("click", () =>
  addStar(Math.random() * canvas.width, Math.random() * canvas.height)
);
connectStarsBtn.addEventListener("click", connectNearestStars);
clearCanvasBtn.addEventListener("click", clearCanvas);
colorPicker.addEventListener("input", (e) => {
  currentColor = e.target.value;
  colorPickerLabel.textContent = `Color: ${currentColor}`;
});

colorPicker.addEventListener("change", () => {
  colorPickerLabel.textContent = "Pick a color";
});

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  addStar(x, y);
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    addStar(Math.random() * canvas.width, Math.random() * canvas.height);
  }
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Start the animation
animateCanvas();

// Add some initial stars
for (let i = 0; i < 50; i++) {
  addStar(Math.random() * canvas.width, Math.random() * canvas.height);
}

// Intersection Observer for lazy loading and animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  {
    threshold: 0.1,
  }
);

document.querySelectorAll(".project-card, .blog-post").forEach((el) => {
  observer.observe(el);
});

// Optional: Add a preloader
window.addEventListener("load", () => {
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    preloader.classList.add("preloader-finish");
  }
});

// Mobile navigation toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("is-active");
  navMenu.classList.toggle("active");
  document.body.classList.toggle("nav-open");
});

// Close mobile menu when a link is clicked
navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("is-active");
    navMenu.classList.remove("active");
    document.body.classList.remove("nav-open");
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
    hamburger.classList.remove("is-active");
    navMenu.classList.remove("active");
    document.body.classList.remove("nav-open");
  }
});

function updateModeHint() {
  const modeHint = document.getElementById("modeHint");
  const isDarkMode = document.body.classList.contains("dark-mode");

  if (isDarkMode) {
    modeHint.textContent =
      "Enjoy the Cosmic Canvas! Switch to light mode for bubbles and butterflies.";
  } else {
    modeHint.textContent =
      "Switch to dark mode for the Cosmic Canvas experience!";
  }
}

// Contact button functionality
document
  .getElementById("contactButton")
  .addEventListener("click", function (e) {
    e.preventDefault();
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // If there's no contact section, you can open an email client
      window.location.href = "mailto:debojit16mitra@gmail.com";
    }
  });

// Resume download functionality
document
  .getElementById("downloadResume")
  .addEventListener("click", function (e) {
    e.preventDefault();

    // URL to your resume file
    const resumeUrl =
      "https://drive.google.com/file/d/1ffm4c7M4-Umwg2u_nJoTFLD43txQrvJC/view?usp=sharing";

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = "Debojit_Mitra_Resume.pdf"; // Suggested filename for download

    // Append to the body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

// Fun Zone Animations
function animateFunZone() {
  gsap.from("#fun .fun-zone-container", {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
      trigger: "#fun",
      start: "top 80%",
    },
  });

  gsap.from("#fun .controls button, #fun .color-picker-wrapper", {
    opacity: 0,
    y: 20,
    stagger: 0.2,
    duration: 0.5,
    scrollTrigger: {
      trigger: "#fun",
      start: "top 80%",
    },
  });
}

// Button and Social Link Animations
function animateButtons() {
  gsap.from(".cta-buttons .cta-button", {
    opacity: 0,
    y: 20,
    stagger: 0.2,
    duration: 0.5,
    scrollTrigger: {
      trigger: ".cta-buttons",
      start: "top 80%",
    },
  });

  gsap.from(".social-links a", {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.5,
    scrollTrigger: {
      trigger: ".social-links",
      start: "top 90%",
    },
  });
}

// Skills Container and Image Container Animations
function animateSkillsAndImage() {
  gsap.from(".skills-container", {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
      trigger: ".skills-container",
      start: "top 80%",
    },
  });

  gsap.from(".skills-list li", {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.5,
    scrollTrigger: {
      trigger: ".skills-container",
      start: "top 80%",
    },
  });

  gsap.from(".image-container", {
    opacity: 0,
    scale: 0.8,
    duration: 1,
    scrollTrigger: {
      trigger: ".about-image",
      start: "top 80%",
    },
  });

  gsap.from(".fun", {
    opacity: 0,
    scale: 0.8,
    duration: 1,
    scrollTrigger: {
      trigger: ".fun-zone-container",
      start: "top 80%",
    },
  });
}

// Call these functions when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  animateFunZone();
  animateButtons();
  animateSkillsAndImage();
});
