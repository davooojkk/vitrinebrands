const track = document.querySelector(".reel-track");
const inner = document.querySelector(".reel-inner");
const slides = [...document.querySelectorAll(".reel-item")];
const count = document.querySelector(".reel-count");
const progress = document.querySelector(".reel-line span");

let x = 0;
let target = 0;
let startX = 0;
let startTarget = 0;
let velocity = 0;
let lastX = 0;
let lastT = 0;
let dragging = false;

const limit = () =>
  Math.min(0, track.clientWidth - inner.scrollWidth);

const clamp = value =>
  Math.max(limit(), Math.min(0, value));

function render() {
  x += (target - x) * 0.09;

  inner.style.transform = `translate3d(${x}px,0,0)`;

  const center = track.clientWidth / 2;

  let active = 0;
  let distance = Infinity;

  slides.forEach((slide, i) => {
    const d = Math.abs(
      slide.offsetLeft + slide.offsetWidth / 2 + x - center
    );

    if (d < distance) {
      distance = d;
      active = i;
    }

    slide.classList.toggle("active", i === active);
  });

  count.textContent =
    `${String(active + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;

  progress.style.transform =
    `scaleX(${limit() ? x / limit() : 0})`;

  requestAnimationFrame(render);
}

track.addEventListener("pointerdown", e => {
  dragging = true;

  startX = lastX = e.clientX;
  startTarget = target;
  lastT = performance.now();

  track.setPointerCapture(e.pointerId);
  track.classList.add("dragging");
});

track.addEventListener("pointermove", e => {
  if (!dragging) return;

  target = clamp(
    startTarget + (e.clientX - startX) * 0.9
  );

  const now = performance.now();

  velocity =
    (e.clientX - lastX) /
    Math.max(16, now - lastT);

  lastX = e.clientX;
  lastT = now;
});

track.addEventListener("pointerup", e => {
  dragging = false;

  target = clamp(target + velocity * 400);

  track.releasePointerCapture(e.pointerId);
  track.classList.remove("dragging");
});

track.addEventListener("pointercancel", () => {
  dragging = false;
  track.classList.remove("dragging");
});

window.addEventListener("resize", () => {
  target = clamp(target);
});

render();