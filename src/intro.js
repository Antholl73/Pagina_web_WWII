// ==========================================================================
// INTRODUCCIÓN: TELÓN + VIDEO CINEMATOGRÁFICO (traído de la web de Simon)
//
// 1. Mientras se descarga el video, el telón muestra fotos, brasas y una barra de carga.
// 2. "Comenzar" abre el proyector y reproduce el video con sonido.
// 3. Al terminar (o con "Saltar") se retira todo y se puede hacer scroll.
// ==========================================================================

const INTRO_VIDEO = "/biblioteca/assets/intro.mp4";
const INTRO_MUSIC = "/biblioteca/assets/musica-guitarra.mp3";
const MUSIC_START = 7.1; // La pista de guitarra empieza con 7 s de silencio
const MUSIC_VOLUME = 0.4;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initIntro() {
  const curtain = document.getElementById("curtain");
  if (!curtain) return;

  const startBtn = document.getElementById("curtain-start");
  const skipIntroBtn = document.getElementById("curtain-skip");
  const bar = document.getElementById("curtain-bar");
  const soundHint = document.getElementById("curtain-sound-hint");
  const film = document.getElementById("film");
  const video = document.getElementById("film-video");
  const skipFilmBtn = document.getElementById("film-skip");

  let videoUrl = INTRO_VIDEO;
  let finished = false;
  const stopAmbience = startAmbience(curtain);
  const music = createLoopingMusic(INTRO_MUSIC, MUSIC_START);

  // --- 1. Descarga del video con barra de progreso ---------------------------
  downloadWithProgress(INTRO_VIDEO, (percent) => {
    bar.style.width = `${percent}%`;
    startBtn.textContent = `Cargando… ${percent}%`;
  }).then((url) => {
    videoUrl = url;
    bar.style.width = "100%";
    startBtn.textContent = "▶ Comenzar";
    startBtn.disabled = false;
    curtain.classList.add("is-loaded");
  });

  // --- Música del telón ------------------------------------------------------
  // Los navegadores no dejan sonar audio hasta que la persona interactúa:
  // si falla, se muestra el aviso y se vuelve a intentar con el primer clic o tecla.
  const tryMusic = () => {
    if (curtain.classList.contains("is-started")) return;
    music
      .play(MUSIC_VOLUME)
      .then(() => soundHint.classList.remove("is-visible"))
      .catch(() => soundHint.classList.add("is-visible"));
  };
  tryMusic();
  ["pointerdown", "keydown"].forEach((type) =>
    document.addEventListener(type, tryMusic, { once: true }),
  );

  // --- 2. "Comenzar": abre el proyector -------------------------------------
  startBtn.addEventListener("click", () => {
    curtain.classList.add("is-started");
    soundHint.classList.remove("is-visible");
    music.fadeOut(800);

    film.classList.add("is-open");
    video.src = videoUrl;
    video.play().catch(finishIntro); // Si el video no se puede reproducir, se pasa directo a la página
  });

  // --- 3. Final: fin del video, "Saltar" o "Saltar introducción" ------------
  video.addEventListener("ended", finishIntro);
  video.addEventListener("error", finishIntro);
  skipFilmBtn.addEventListener("click", finishIntro);
  skipIntroBtn.addEventListener("click", finishIntro);

  document.addEventListener("keydown", (event) => {
    if (film.classList.contains("is-open") && ["Escape", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      finishIntro();
    }
  });

  function finishIntro() {
    if (finished) return;
    finished = true;

    video.pause();
    music.fadeOut(600);
    film.classList.add("is-closing");
    curtain.classList.add("is-started", "is-gone");
    document.documentElement.classList.remove("is-intro-open");
    window.scrollTo(0, 0);

    // Retira los elementos cuando terminan los fundidos y libera memoria
    window.setTimeout(() => {
      stopAmbience();
      film.remove();
      curtain.remove();
      if (videoUrl.startsWith("blob:")) URL.revokeObjectURL(videoUrl);
    }, 1500);
  }
}

// Descarga un archivo informando del porcentaje. Devuelve una URL local (blob)
// o, si algo falla, la URL original para que el video se cargue de forma normal.
async function downloadWithProgress(url, onProgress) {
  try {
    const response = await fetch(url);
    if (!response.ok || !response.body) throw new Error("Descarga fallida");

    const total = Number(response.headers.get("content-length")) || 0;
    const reader = response.body.getReader();
    const chunks = [];
    let loaded = 0;

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      if (total) onProgress(Math.min(99, Math.floor((loaded / total) * 100)));
    }

    const type = response.headers.get("content-type") || "video/mp4";
    return URL.createObjectURL(new Blob(chunks, { type }));
  } catch {
    return url;
  }
}

// Pista en bucle que vuelve a empezar en `startAt` (para saltar el silencio inicial)
function createLoopingMusic(src, startAt) {
  const audio = new Audio(src);
  audio.volume = 0;
  audio.addEventListener("loadedmetadata", () => {
    if (audio.currentTime < startAt) audio.currentTime = startAt;
  });
  audio.addEventListener("ended", () => {
    audio.currentTime = startAt;
    audio.play().catch(() => {});
  });

  let fadeRaf = 0;
  function fadeTo(target, ms) {
    cancelAnimationFrame(fadeRaf);
    const from = audio.volume;
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms);
      audio.volume = from + (target - from) * k;
      if (k < 1) fadeRaf = requestAnimationFrame(step);
      else if (target === 0) audio.pause();
    };
    fadeRaf = requestAnimationFrame(step);
  }

  return {
    play(volume) {
      if (!audio.paused) return Promise.resolve();
      return audio.play().then(() => fadeTo(volume, 1200));
    },
    fadeOut(ms) {
      if (!audio.paused) fadeTo(0, ms);
    },
  };
}

// Ambiente del telón: brasas que suben, explosiones lejanas y parallax con el ratón.
// Devuelve una función que lo detiene todo.
function startAmbience(curtain) {
  const canvas = document.getElementById("curtain-embers");
  const flash = document.getElementById("curtain-flash");
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let rafId = 0;
  let boomTimer = 0;

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  const spawn = (y = height + 10) => ({
    x: Math.random() * width,
    y,
    r: Math.random() * 2.2 + 0.6,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(Math.random() * 0.6 + 0.25),
    alpha: Math.random() * 0.6 + 0.3,
    phase: Math.random() * 6.3,
    hot: Math.random() < 0.55, // Brasa naranja o ceniza gris
  });
  const embers = reduceMotion ? [] : Array.from({ length: 70 }, () => spawn(Math.random() * height));

  const draw = (t) => {
    ctx.clearRect(0, 0, width, height);
    for (const e of embers) {
      e.x += e.vx + Math.sin(t / 900 + e.phase) * 0.25;
      e.y += e.vy;
      if (e.y < -10) Object.assign(e, spawn());

      const flicker = 0.65 + 0.35 * Math.sin(t / 180 + e.phase * 3);
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fillStyle = e.hot
        ? `rgba(255, ${140 + ((e.r * 30) | 0)}, 60, ${e.alpha * flicker})`
        : `rgba(200, 190, 170, ${e.alpha * 0.5})`;
      ctx.shadowColor = "rgba(255, 120, 30, 0.9)";
      ctx.shadowBlur = e.hot ? 8 : 0;
      ctx.fill();
    }
    rafId = requestAnimationFrame(draw);
  };
  if (embers.length) rafId = requestAnimationFrame(draw);

  // Explosión lejana: destello en un punto al azar + temblor de las fotos
  const boom = () => {
    if (curtain.classList.contains("is-started")) return;
    flash.style.setProperty("--fx", `${10 + Math.random() * 80}%`);
    flash.style.setProperty("--fy", `${35 + Math.random() * 40}%`);
    restartClass(flash, "is-on");
    restartClass(curtain, "is-shaking");
    boomTimer = window.setTimeout(boom, 5000 + Math.random() * 6000);
  };
  if (!reduceMotion) boomTimer = window.setTimeout(boom, 3500);

  const onPointerMove = (event) => {
    curtain.style.setProperty("--px", (event.clientX / window.innerWidth - 0.5).toFixed(3));
    curtain.style.setProperty("--py", (event.clientY / window.innerHeight - 0.5).toFixed(3));
  };
  curtain.addEventListener("pointermove", onPointerMove);

  return () => {
    cancelAnimationFrame(rafId);
    window.clearTimeout(boomTimer);
    window.removeEventListener("resize", resize);
    curtain.removeEventListener("pointermove", onPointerMove);
  };
}

// Quita y vuelve a poner una clase para que su animación empiece de nuevo
function restartClass(el, className) {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}
