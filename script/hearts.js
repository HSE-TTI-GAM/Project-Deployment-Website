(function () {
  if (window.__loveHeartsInitialized) return;
  window.__loveHeartsInitialized = true;

  const canvas = document.createElement("canvas");
  canvas.id = "love-hearts-canvas";
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "999",
  });

  function mount() {
    if (!document.body) return;
    document.body.appendChild(canvas);
    resize();
    for (let i = 0; i < 24; i++) {
      ambientHearts.push(createAmbientHeart(true));
    }
    requestAnimationFrame(tick);
  }

  const ctx = canvas.getContext("2d");
  const COLORS = ["#ff4d6d", "#ff758f", "#ff8fa3", "#f472b6", "#fb7185", "#fda4af"];
  const ambientHearts = [];
  const burstHearts = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  function createAmbientHeart(randomY) {
    const size = 8 + Math.random() * 14;
    return {
      x: Math.random() * window.innerWidth,
      y: randomY ? Math.random() * window.innerHeight : window.innerHeight + 30,
      size,
      speedY: 0.45 + Math.random() * 0.9,
      swayAmp: 0.3 + Math.random() * 0.8,
      swayFreq: 0.015 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.25 + Math.random() * 0.45,
      rotation: (Math.random() - 0.5) * 0.5,
      color: randomColor(),
    };
  }

  function spawnBurst(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 1.6 + Math.random() * 3.2;
      burstHearts.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: 7 + Math.random() * 10,
        alpha: 0.95,
        decay: 0.018 + Math.random() * 0.012,
        rotation: (Math.random() - 0.5) * 0.8,
        color: randomColor(),
      });
    }
  }

  function drawHeart(x, y, size, rotation, alpha, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = color;

    const s = size * 0.5;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.35);
    ctx.bezierCurveTo(-s, -s * 0.4, -s * 1.15, s * 0.65, 0, s * 1.25);
    ctx.bezierCurveTo(s * 1.15, s * 0.65, s, -s * 0.4, 0, s * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < ambientHearts.length; i++) {
      const h = ambientHearts[i];
      h.y -= h.speedY;
      h.phase += h.swayFreq;
      h.x += Math.sin(h.phase) * h.swayAmp;

      if (h.y < -40) {
        ambientHearts[i] = createAmbientHeart(false);
        continue;
      }
      drawHeart(h.x, h.y, h.size, h.rotation + Math.sin(h.phase) * 0.12, h.alpha, h.color);
    }

    for (let i = burstHearts.length - 1; i >= 0; i--) {
      const b = burstHearts[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += 0.06;
      b.alpha -= b.decay;
      if (b.alpha <= 0) {
        burstHearts.splice(i, 1);
        continue;
      }
      drawHeart(b.x, b.y, b.size, b.rotation, b.alpha, b.color);
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointerdown", (e) => {
    spawnBurst(e.clientX, e.clientY, 10);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
