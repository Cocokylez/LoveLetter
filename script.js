/* ═══════════════════════════════════════
   HEART PARTICLE SYSTEM (background)
═══════════════════════════════════════ */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawHeart(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.3);
  ctx.bezierCurveTo( size * 0.9, -size * 1.1,  size * 1.5,  size * 0.4, 0,  size);
  ctx.bezierCurveTo(-size * 1.5,  size * 0.4, -size * 0.9, -size * 1.1, 0, -size * 0.3);
  ctx.closePath();
}

const heartColors = [
  'rgba(220, 100, 120, ',
  'rgba(240, 150, 160, ',
  'rgba(200,  80, 100, ',
  'rgba(255, 180, 190, ',
  'rgba(180,  60,  90, ',
];

class Particle {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x         = Math.random() * W;
    this.y         = initial ? Math.random() * H : H + 20;
    this.size      = Math.random() * 7 + 3;
    this.speedY    = -(Math.random() * 0.5 + 0.25);
    this.speedX    = (Math.random() - 0.5) * 0.35;
    this.wobble    = Math.random() * Math.PI * 2;
    this.wobbleSpd = Math.random() * 0.025 + 0.008;
    this.rotation  = Math.random() * Math.PI * 2;
    this.rotSpeed  = (Math.random() - 0.5) * 0.018;
    this.alpha     = Math.random() * 0.35 + 0.1;
    this.color     = heartColors[Math.floor(Math.random() * heartColors.length)];
  }

  update() {
    this.y       += this.speedY;
    this.wobble  += this.wobbleSpd;
    this.x       += this.speedX + Math.sin(this.wobble) * 0.4;
    this.rotation += this.rotSpeed;
    if (this.y < -20) this.reset();
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color + '1)';
    drawHeart(ctx, this.size);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 55; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();


/* ═══════════════════════════════════════
   DOM REFS
═══════════════════════════════════════ */
const envelopeWrap    = document.getElementById('envelopeWrap');
const envelope        = document.getElementById('envelope');
const envFlap         = document.getElementById('envFlap');
const seal            = document.getElementById('seal');
const hint            = document.getElementById('hint');
const letterContainer = document.getElementById('letterContainer');
const letterHeading   = document.getElementById('letterHeading');
const paragraphIds    = ['p1', 'p2', 'p3', 'p4', 'p5'];

let opened = false;

function after(ms, fn) { return setTimeout(fn, ms); }


/* ═══════════════════════════════════════
   OPEN SEQUENCE
═══════════════════════════════════════ */
envelopeWrap.addEventListener('click', openEnvelope);

function openEnvelope() {
  if (opened) return;
  opened = true;

  envelopeWrap.style.pointerEvents = 'none';
  hint.classList.add('hidden');

  // 0ms — shake
  envelope.classList.add('shaking');

  // 200ms — seal cracks
  after(200, () => seal.classList.add('broken'));

  // 700ms — shake ends, flap opens
  after(700, () => {
    envelope.classList.remove('shaking');
    envFlap.classList.add('open');
  });

  // 1200ms — letter rises
  after(1200, () => letterContainer.classList.add('rising'));

  // 1750ms — envelope sinks away
  after(1750, () => {
    envelope.classList.add('disappear');
    after(750, () => {
      envelopeWrap.style.display = 'none';
      letterContainer.classList.add('settled');
    });
  });

  // Text reveals — staggered
  const textEls   = [letterHeading, ...paragraphIds.map(id => document.getElementById(id))];
  const textTimes = [2100, 2450, 2950, 3450, 3950, 4450];
  textEls.forEach((el, i) => after(textTimes[i], () => el.classList.add('visible')));

  // Heart burst
  after(1500, burstHearts);
}


/* ═══════════════════════════════════════
   HEART BURST
═══════════════════════════════════════ */
function burstHearts() {
  const heartEmojis = ['❤️', '🩷', '💕', '💗', '💓', '💞', '❣️'];

  for (let i = 0; i < 28; i++) {
    after(i * 75, () => {
      const el = document.createElement('div');
      el.className   = 'burst-heart';
      el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

      el.style.left     = (30 + Math.random() * 40) + 'vw';
      el.style.top      = (45 + Math.random() * 35) + 'vh';
      el.style.fontSize = (12 + Math.random() * 22) + 'px';

      const driftX = (Math.random() - 0.5) * 180;
      el.style.setProperty('--drift-x', driftX + 'px');
      el.style.animationDuration = (2.6 + Math.random() * 3.2) + 's';
      el.style.animationDelay    = (Math.random() * 0.25) + 's';

      document.body.appendChild(el);
      after(6500, () => el.remove());
    });
  }
}
