let lastSpawn = 0;
let fallingStars = [];
let lastStarSpawn = 0;

//animated background 1-32
const canvas = document.getElementById("trail");
const ctx = canvas.getContext("2d");

let width, height;
let points = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();
initFallingStars();


function drawStar(x, y, radius, alpha, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();

  for (let i = 0; i < 5; i++) {
    ctx.lineTo(0, radius);
    ctx.translate(0, radius);
    ctx.rotate((Math.PI * 2) / 10);
    ctx.lineTo(0, -radius);
    ctx.translate(0, -radius);
    ctx.rotate(-(Math.PI * 6) / 10);
  }

  ctx.closePath();
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.fill();
  ctx.restore();
}
function spawnFallingStar() {
  fallingStars.push({
     x: Math.random() * width,
  y: -20,
  speed: Math.random() * 0.4 + 0.2,
  size: Math.random() * 2 + 1,
  rotation: Math.random() * Math.PI,
  rotationSpeed: (Math.random() - 0.5) * 0.01,
  alpha: Math.random() * 0.15 + 0.15,
  flash: 0,
  flashSpeed: Math.random() * 0.08 + 0.05
  });
}
function initFallingStars(count = 120) {
  fallingStars = [];

  for (let i = 0; i < count; i++) {
    fallingStars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 0.4 + 0.2,
      size: Math.random() * 2 + 1,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
      alpha: Math.random() * 0.15 + 0.15,
      flash: 0,
      flashSpeed: Math.random() * 0.08 + 0.05
    });
  }
}

function animate() {
  const now = performance.now();

  // spawn falling stars
  if (now - lastStarSpawn > 120) {
    spawnFallingStar();
    lastStarSpawn = now;
  }

  ctx.clearRect(0, 0, width, height);

  // draw falling stars
  for (let i = 0; i < fallingStars.length; i++) {
  const s = fallingStars[i];

  // rare flash trigger
  if (Math.random() < 0.0003 && s.flash <= 0) {
    s.flash = 1;
  }

  if (s.flash > 0) {
    s.flash -= s.flashSpeed;
  }

  s.y += s.speed;
  s.rotation += s.rotationSpeed;

  const flashBoost = Math.max(s.flash, 0);
  const finalAlpha = s.alpha + flashBoost * 0.8;
  const finalSize = s.size + flashBoost * 2;

  drawStar(s.x, s.y, finalSize, finalAlpha, s.rotation);

  if (s.y > height + 30) {
    fallingStars.splice(i, 1);
    i--;
  }
}

  // draw cursor trail
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    p.life -= 0.015;
    p.rotation += 0.02;

    drawStar(p.x, p.y, p.size, p.life * 0.8, p.rotation);

    if (p.life <= 0) {
      points.splice(i, 1);
      i--;
    }
  }

  // connecting line
  if (points.length > 1) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  requestAnimationFrame(animate);
}

animate();
//mouse follow 
const cursor = document.querySelector(".cursor");

document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.querySelector(".cursor");
  if (!cursor) return;

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });
});

document.addEventListener("mousemove", (e) => {
  const now = performance.now();
  if (now - lastSpawn < 20) return;
  lastSpawn = now;

  points.push({
    x: e.clientX,
    y: e.clientY,
    life: 1,
    size: Math.random() * 2 + 1,
    rotation: Math.random() * Math.PI
  });
});
