import scrollama from "scrollama";

const currentYearEl = document.getElementById("current-year");
const graphicDescEl = document.getElementById("graphic-desc");
const graphicEl = document.querySelector(".graphic__placeholder");
const stepElements = document.querySelectorAll(".step");
const historicalData = {
  1919: "Tratado de Versalles y la República de Weimar",
  1922: "La Marcha sobre Roma y el Fascismo en Italia",
  1929: "La Gran Depresión y la radicalización de masas",
  1933: "Nombramiento de Hitler: Violencia, propaganda y élites",
  1939: "El código ideológico expansionista y la Guerra Total",
};

const scroller = scrollama();
const introEl = document.getElementById("intro");

function initIntro() {
  if (!introEl) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveal = () => {
    introEl.classList.add("is-complete");
    window.setTimeout(() => introEl.remove(), reduceMotion ? 20 : 1150);
  };

  window.setTimeout(reveal, reduceMotion ? 80 : 1800);
}

function updateGraphic(year) {
  if (!year || !historicalData[year]) return;

  currentYearEl.textContent = year;
  graphicDescEl.textContent = historicalData[year];

  if (graphicEl) {
    graphicEl.classList.remove("is-changing");
    requestAnimationFrame(() => graphicEl.classList.add("is-changing"));
  }
}

function handleStepEnter({ element }) {
  stepElements.forEach((step) => step.classList.toggle("is-active", step === element));
  updateGraphic(element.dataset.year);
}

function initScrollytelling() {
  scroller
    .setup({
      step: ".step",
      offset: 0.52,
      debug: false,
    })
    .onStepEnter(handleStepEnter);

  window.addEventListener("resize", scroller.resize);
}

const videoSection = document.getElementById("video-scrub-section");
const scrubVideo = document.getElementById("scrub-video");
const progressText = document.getElementById("video-progress-text");
const VIDEO_FPS = 30;
const FRAME = 1 / VIDEO_FPS;
const SMOOTHING = 12;

let targetTime = 0;
let smoothTime = 0;
let lastFrameStamp = 0;
let rafId = null;
let lastPercent = -1;
let isVideoVisible = false;

function getScrollProgress() {
  const rect = videoSection.getBoundingClientRect();
  const scrollable = rect.height - window.innerHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, -rect.top / scrollable));
}

function updateVideoTarget() {
  if (!scrubVideo.duration) return;

  const progress = getScrollProgress();
  targetTime = progress * Math.max(0, scrubVideo.duration - FRAME);

  const percent = Math.round(progress * 100);
  if (progressText && percent !== lastPercent) {
    progressText.textContent = `${percent}%`;
    lastPercent = percent;
  }
}

function tick(now) {
  rafId = requestAnimationFrame(tick);

  if (!scrubVideo.duration) return;

  const dt = Math.min(0.1, (now - (lastFrameStamp || now)) / 1000);
  lastFrameStamp = now;
  const ease = 1 - Math.exp(-SMOOTHING * dt);
  smoothTime += (targetTime - smoothTime) * ease;

  const frameTime = Math.round(smoothTime * VIDEO_FPS) / VIDEO_FPS;
  if (!scrubVideo.seeking && Math.abs(scrubVideo.currentTime - frameTime) >= FRAME) {
    scrubVideo.currentTime = frameTime;
  }
}

function startLoop() {
  if (rafId !== null || !isVideoVisible) return;
  updateVideoTarget();
  smoothTime = targetTime;
  lastFrameStamp = 0;
  rafId = requestAnimationFrame(tick);
}

function stopLoop() {
  if (rafId === null) return;
  cancelAnimationFrame(rafId);
  rafId = null;
}

function initVideoScrub() {
  if (!videoSection || !scrubVideo) return;

  scrubVideo.pause();
  scrubVideo.addEventListener("loadedmetadata", updateVideoTarget);
  window.addEventListener("scroll", updateVideoTarget, { passive: true });
  window.addEventListener("resize", updateVideoTarget);

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVideoVisible = entry.isIntersecting;
      if (isVideoVisible) startLoop();
      else stopLoop();
    },
    { rootMargin: "160px 0px" }
  );

  observer.observe(videoSection);
}

initIntro();
initScrollytelling();
initVideoScrub();
