// Theme detection and setting
function setTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
  
  // Function to get the user's theme preference
  function getThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Initialize theme
  const initialTheme = getThemePreference();
  setTheme(initialTheme);
  
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
  
  // Particle system
  const particleContainer = document.getElementById('particle-system');
  const particleCount = 100;
  const particles = [];
  
  class Particle {
    constructor() {
      this.element = document.createElement('div');
      this.element.classList.add('particle');
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
  
    particles.forEach(particle => {
      particle.update(mouseX, mouseY, scrollDiff);
    });
  
    requestAnimationFrame(updateParticles);
  }
  
  // Event listeners
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  window.addEventListener('resize', () => {
    particles.forEach(particle => particle.reset());
  });
  
  // Start animation
  updateParticles();
  
  // Interactive cursor
  const cursor = document.querySelector('.cursor');
  const cursorTrail = [];
  const trailLength = 10;
  
  for (let i = 0; i < trailLength; i++) {
    const trail = document.createElement('div');
    trail.classList.add('cursor-trail');
    document.body.appendChild(trail);
    cursorTrail.push(trail);
  }
  
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      left: e.clientX,
      top: e.clientY,
      duration: 0.1
    });
  
    cursorTrail.forEach((trail, index) => {
      setTimeout(() => {
        gsap.to(trail, {
          left: e.clientX,
          top: e.clientY,
          duration: 0.3,
          opacity: 1 - (index / trailLength)
        });
      }, index * 30);
    });
  });
  
  // Hover effect for links and buttons
  const interactiveElements = document.querySelectorAll('a, button');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        duration: 0.3
      });
    });
  
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, {
        width: 20,
        height: 20,
        backgroundColor: 'transparent',
        borderWidth: 2,
        duration: 0.3
      });
    });
  });
  
  // Scroll to explore functionality
  document.querySelector('.scroll-indicator').addEventListener('click', () => {
    const aboutSection = document.querySelector('#about');
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  });
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  // Typewriter effect
  const typewriterText = document.querySelector('.typewriter');
  const text = typewriterText.textContent;
  typewriterText.textContent = '';
  let i = 0;
  
  function typeWriter() {
    if (i < text.length) {
      typewriterText.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    }
  }
  
  typeWriter();
  
  // Scroll animations with GSAP
  gsap.registerPlugin(ScrollTrigger);
  
  gsap.utils.toArray('section').forEach(section => {
    gsap.from(section.querySelectorAll('h2, p, .project-card, .blog-post'), {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
      }
    });
  });
  
  // Interactive canvas in Fun Zone
  const canvas = document.getElementById('interactive-canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  const canvasParticles = [];
  const canvasParticleCount = 100;
  
  class CanvasParticle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 5 + 1;
      this.speedX = Math.random() * 3 - 1.5;
      this.speedY = Math.random() * 3 - 1.5;
    }
  
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
  
      if (this.size > 0.2) this.size -= 0.1;
    }
  
    draw() {
      ctx.fillStyle = 'var(--accent-color)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  function initCanvasParticles() {
    for (let i = 0; i < canvasParticleCount; i++) {
      canvasParticles.push(new CanvasParticle());
    }
  }
  
  function animateCanvasParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < canvasParticles.length; i++) {
      canvasParticles[i].update();
      canvasParticles[i].draw();
  
      if (canvasParticles[i].size <= 0.2) {
        canvasParticles.splice(i, 1);
        i--;
        canvasParticles.push(new CanvasParticle());
      }
    }
    requestAnimationFrame(animateCanvasParticles);
  }
  
  initCanvasParticles();
  animateCanvasParticles();
  
  // Add interactivity to the canvas
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    for (let i = 0; i < 5; i++) {
      canvasParticles.push(new CanvasParticle());
      canvasParticles[canvasParticles.length - 1].x = x;
      canvasParticles[canvasParticles.length - 1].y = y;
    }
  });
  
  // Resize event listener for responsive canvas
  window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  });
  
  // Intersection Observer for lazy loading and animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    threshold: 0.1
  });
  
  document.querySelectorAll('.project-card, .blog-post').forEach(el => {
    observer.observe(el);
  });
  
  // Optional: Add a preloader
  window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.classList.add('preloader-finish');
    }
  });