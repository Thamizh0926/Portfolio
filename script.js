// ===== ANIMATED BACKGROUND =====
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.6 + 0.1;
    this.color = Math.random() > 0.5 ? '0,245,255' : '255,45,120';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

const NUM = 120;
const pts = Array.from({ length: NUM }, () => new Particle());

// Geometric grid lines
let gridOffset = 0;

function drawGrid() {
  const spacing = 80;
  const gAlpha = 0.04;
  ctx.strokeStyle = `rgba(0,245,255,${gAlpha})`;
  ctx.lineWidth = 0.5;
  const offset = (gridOffset % spacing);

  for (let x = -spacing + offset; x < W + spacing; x += spacing) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = -spacing + offset; y < H + spacing; y += spacing) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
}

// Floating hexagons
let hexTime = 0;
const hexes = Array.from({ length: 6 }, (_, i) => ({
  x: Math.random() * W, y: Math.random() * H,
  size: 30 + Math.random() * 60,
  speed: 0.003 + Math.random() * 0.005,
  phase: Math.random() * Math.PI * 2,
  color: i % 2 === 0 ? '0,245,255' : '124,58,237'
}));

function drawHex(x, y, size, alpha, color) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    const px = x + size * Math.cos(a);
    const py = y + size * Math.sin(a);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = `rgba(${color},${alpha})`;
  ctx.lineWidth = 0.8;
  ctx.stroke();
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, W, H);

  gridOffset += 0.15;
  hexTime += 0.003;

  drawGrid();

  hexes.forEach(h => {
    h.y -= h.speed * 0.5;
    if (h.y + h.size < 0) { h.y = H + h.size; h.x = Math.random() * W; }
    const pulse = 0.05 + 0.04 * Math.sin(hexTime + h.phase);
    drawHex(h.x, h.y, h.size, pulse, h.color);
  });

  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(0,245,255,${0.08 * (1 - d / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  pts.forEach(p => { p.update(); p.draw(); });
}

animate();

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// ===== FORM =====
function handleSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('sender-name').value;
  const email = document.getElementById('sender-email').value;
  const msg = document.getElementById('sender-msg').value;

  const subject = encodeURIComponent(`Portfolio Message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
  window.location.href = `mailto:thamizh0926@gmail.com?subject=${subject}&body=${body}`;

  const btn = e.target.querySelector('button');
  btn.textContent = 'Opening Mail ✓';
  btn.style.background = 'linear-gradient(135deg,#00f5ff,#7c3aed)';
  setTimeout(() => { btn.textContent = 'Send Message →'; btn.style.background = ''; e.target.reset(); }, 3000);
}
