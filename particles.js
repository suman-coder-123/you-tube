class Particle {
  constructor(x, y, color) {
    this.originX = x;
    this.originY = y;
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.color = color || randomPink();
    this.size = Math.random() * 2.2 + 0.8;
    this.vx = 0;
    this.vy = 0;
    this.ease = 0.08 + Math.random() * 0.07;
    this.friction = 0.82;
    this.exploded = false;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(mouseX, mouseY, hoverRadius) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < hoverRadius) {
      const force = (hoverRadius - dist) / hoverRadius;
      const angle = Math.atan2(dy, dx);
      this.vx -= Math.cos(angle) * force * 20;
      this.vy -= Math.sin(angle) * force * 20;
      this.exploded = true;
    } else {
      this.exploded = false;
    }

    const toX = this.originX - this.x;
    const toY = this.originY - this.y;
    this.vx += toX * this.ease;
    this.vy += toY * this.ease;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.x += this.vx;
    this.y += this.vy;
  }
}

function randomPink() {
  const pinks = [
    `hsl(${300 + Math.random() * 40}, ${70 + Math.random() * 30}%, ${45 + Math.random() * 25}%)`,
    `hsl(${320 + Math.random() * 30}, 80%, ${50 + Math.random() * 20}%)`,
    `hsl(${280 + Math.random() * 30}, 60%, ${40 + Math.random() * 30}%)`,
  ];
  return pinks[Math.floor(Math.random() * pinks.length)];
}

function getHeartPoints(cx, cy, scale, count) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    points.push({ x: cx + x * scale, y: cy + y * scale });
  }
  // Fill heart interior with noise
  const filled = [];
  for (let i = 0; i < count * 6; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.random();
    const x = 16 * Math.pow(Math.sin(t), 3) * r;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * r;
    if (isInsideHeart(x, y)) {
      filled.push({ x: cx + x * scale, y: cy + y * scale });
    }
  }
  return [...points, ...filled];
}

function isInsideHeart(x, y) {
  const nx = x / 16;
  const ny = -y / 13;
  return Math.pow(nx * nx + ny * ny - 1, 3) - nx * nx * ny * ny * ny <= 0;
}

function getTextPoints(text, canvas, count) {
  const offscreen = document.createElement('canvas');
  offscreen.width = canvas.width;
  offscreen.height = canvas.height;
  const ctx = offscreen.getContext('2d');

  const fontSize = Math.min(canvas.width / (text.length * 0.65 + 0.5), canvas.height * 0.45);
  ctx.fillStyle = '#fff';
  ctx.font = `900 ${fontSize}px Arial Black, Impact, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const points = [];
  const gap = Math.max(3, Math.floor(Math.sqrt((canvas.width * canvas.height) / count)));

  for (let y = 0; y < canvas.height; y += gap) {
    for (let x = 0; x < canvas.width; x += gap) {
      const i = (y * canvas.width + x) * 4;
      if (data[i + 3] > 128) {
        points.push({ x, y });
      }
    }
  }
  return points;
}
