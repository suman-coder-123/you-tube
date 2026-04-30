const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const input = document.getElementById('textInput');

let particles = [];
let mouseX = -999;
let mouseY = -999;
const HOVER_RADIUS = 80;
const PARTICLE_COUNT = 1800;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  buildParticles(input.value.trim());
}

function buildParticles(text) {
  let targets = [];

  if (!text) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 - 40;
    const scale = Math.min(canvas.width, canvas.height) * 0.022;
    targets = getHeartPoints(cx, cy, scale, PARTICLE_COUNT);
  } else {
    targets = getTextPoints(text, canvas, PARTICLE_COUNT);
  }

  if (targets.length === 0) return;

  // Recycle or create particles
  const newCount = Math.min(targets.length, PARTICLE_COUNT);

  if (particles.length === 0) {
    for (let i = 0; i < newCount; i++) {
      const t = targets[i % targets.length];
      particles.push(new Particle(t.x, t.y));
    }
  } else {
    // Re-assign origins so particles flow to new positions
    for (let i = 0; i < Math.max(particles.length, newCount); i++) {
      const t = targets[i % targets.length];
      if (i < particles.length) {
        particles[i].originX = t.x;
        particles[i].originY = t.y;
        particles[i].color = randomPink();
      } else {
        particles.push(new Particle(t.x, t.y));
      }
    }
    // Trim excess
    if (particles.length > newCount) {
      particles = particles.slice(0, newCount);
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    p.update(mouseX, mouseY, HOVER_RADIUS);
    p.draw(ctx);
  }

  requestAnimationFrame(animate);
}

// Input handler
let debounceTimer;
input.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    buildParticles(input.value.trim());
  }, 80);
});

// Mouse tracking
canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

canvas.addEventListener('mouseleave', () => {
  mouseX = -999;
  mouseY = -999;
});

// Touch support
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  mouseX = e.touches[0].clientX;
  mouseY = e.touches[0].clientY;
}, { passive: false });

canvas.addEventListener('touchend', () => {
  mouseX = -999;
  mouseY = -999;
});

window.addEventListener('resize', resize);

// Init
resize();
animate();

// Focus input on load
setTimeout(() => input.focus(), 200);
