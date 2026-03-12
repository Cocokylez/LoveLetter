/* ═══════════════════════════════════════
   PARTICLE SYSTEM ── falling petals + sparkles
═══════════════════════════════════════ */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * W;
    this.y = initial ? Math.random() * H : -40;
    this.size = Math.random() * 7 + 3;
    this.baseSpeedY = Math.random() * 0.7 + 0.25;
    this.speedY = this.baseSpeedY;
    this.drift = (Math.random() - 0.5) * 1.2;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.035;
    this.alpha = Math.random() * 0.35 + 0.08;
    this.hue = Math.random() > 0.5 ? 330 : 40; // pinkish vs golden
    this.saturation = 35 + Math.random() * 25;
    this.lightness = 75 + Math.random() * 15;
    this.type = Math.random() > 0.6 ? "petal" : "sparkle";
  }

  update() {
    this.y += this.speedY;
    this.x += this.drift + Math.sin(this.y * 0.008) * 1.1;
    this.rotation += this.rotSpeed;
    this.speedY = this.baseSpeedY * (1 + Math.sin(this.y * 0.003) * 0.25);

    if (this.y > H + 50) this.reset();
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.type === "petal") {
      ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.6, this.size * 1.9, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = `hsla(${this.hue}, 80%, 85%, ${this.alpha * 1.4})`;
      ctx.font = `${this.size + 6}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✧", 0, 0);
    }
    ctx.restore();
  }
}

// Pre-warm particles
for (let i = 0; i < 70; i++) particles.push(new Particle());

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
animate();

/* ═══════════════════════════════════════
   ENVELOPE + LETTER SEQUENCE
═══════════════════════════════════════ */
const envelopeWrap = document.getElementById("envelopeWrap");
const envelope    = document.getElementById("envelope");
const envFlap     = document.getElementById("envFlap");
const seal        = document.getElementById("seal");
const hint        = document.getElementById("hint");
const letter      = document.getElementById("letterContainer");
const heading     = document.getElementById("letterHeading");
const paras       = ["p1","p2","p3","p4","p5"].map(id => document.getElementById(id));

let isOpening = false;

envelopeWrap.addEventListener("click", openEnvelope);

function openEnvelope() {
  if (isOpening) return;
  isOpening = true;
  envelopeWrap.style.pointerEvents = "none";
  hint?.classList.add("hidden");

  // 1. Shake + break seal
  envelope.classList.add("shaking");
  setTimeout(() => seal.classList.add("broken"), 180);

  // 2. Open flap
  setTimeout(() => {
    envelope.classList.remove("shaking");
    envFlap.classList.add("open");
  }, 680);

  // 3. Letter rises
  setTimeout(() => letter.classList.add("rising"), 1100);

  // 4. Envelope disappears → letter settles
  setTimeout(() => {
    envelope.classList.add("fade-out");
    setTimeout(() => {
      envelopeWrap.style.display = "none";
      letter.classList.add("settled");
    }, 800);
  }, 1650);

  // 5. Text appears sequentially (cubic-bezier easing recommended in CSS)
  const delays = [1950, 2350, 2850, 3350, 3850, 4350];
  [heading, ...paras].forEach((el, i) => {
    if (el) setTimeout(() => el.classList.add("visible"), delays[i]);
  });

  // 6. Hearts burst a bit later
  setTimeout(burstHearts, 1400);
}

/* ═══════════════════════════════════════
   FLOATING HEARTS / EMOJIS BURST
═══════════════════════════════════════ */
function burstHearts() {
  const emojis = ["❤️","💗","🩷","🌸","🌷","✨","💕","🫶"];
  const count = 28;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.className = "floating-heart";

      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      heart.style.left   = (5 + Math.random() * 90) + "vw";
      heart.style.top    = (30 + Math.random() * 50) + "vh";

      const size = 16 + Math.random() * 28;
      heart.style.fontSize = size + "px";
      heart.style.animation = `floatUp ${3.2 + Math.random() * 4.8}s cubic-bezier(0.22, 0.61, 0.36, 1) forwards`;

      // slight random rotation & scale variation
      const rot = (Math.random() - 0.5) * 40;
      const scale = 0.7 + Math.random() * 0.9;
      heart.style.transform = `rotate(${rot}deg) scale(${scale})`;

      document.body.appendChild(heart);

      setTimeout(() => heart.remove(), 9000);
    }, i * 70);
  }
}
