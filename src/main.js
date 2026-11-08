// src/main.js

// 1. librería Scrollama
import scrollama from "scrollama";

// 2. Seleccionamos los elementos del DOM que vamos a actualizar
const currentYearEl = document.getElementById("current-year");
const graphicDescEl = document.getElementById("graphic-desc");
const stepElements = document.querySelectorAll(".step");

// 3. Diccionario con subtítulos históricos según el año
const historicalData = {
  1919: "Tratado de Versalles y la República de Weimar",
  1922: "La Marcha sobre Roma y el Fascismo en Italia",
  1929: "La Gran Depresión y la radicalización de masas",
  1933: "Nombramiento de Hitler: Violencia, propaganda y élites",
  1939: "El código ideológico expansionista y la Guerra Total",
};

// 4. Instanciamos Scrollama
const scroller = scrollama();

// 5. Función que se ejecuta cuando un paso entra en la línea de activación
function handleStepEnter(response) {
  // response contiene:
  // - response.element: El elemento HTML de la tarjeta actual
  // - response.index: El índice (0, 1, 2, ...)
  // - response.direction: 'down' (hacia abajo) o 'up' (hacia arriba)

  const currentStep = response.element;
  const year = currentStep.dataset.year; // Lee el atributo data-year del HTML

  // A. Quitamos la clase 'is-active' de todos los pasos y se la ponemos solo al actual
  stepElements.forEach((step) => step.classList.remove("is-active"));
  currentStep.classList.add("is-active");

  // B. Actualizamos el año gigante del fondo
  if (currentYearEl && year) {
    currentYearEl.textContent = year;
  }

  // C. Actualizamos la descripción del evento histórico
  if (graphicDescEl && historicalData[year]) {
    graphicDescEl.textContent = historicalData[year];
  }
}

// 6. Inicializamos y configuramos el scroller
function init() {
  scroller
    .setup({
      step: ".step", // Elementos que Scrollama debe vigilar
      offset: 0.5, // Línea de disparo al 50% de la pantalla (exactamente en el centro)
      debug: true, // Muestra una línea visual para que entiendas dónde se dispara (luego la quitaremos)
    })
    .onStepEnter(handleStepEnter);

  // Reajustar cálculos automáticamente si el usuario cambia el tamaño de la ventana
  window.addEventListener("resize", scroller.resize);
}

// =======================================================
// 7. VIDEO SCRUBBING: EL SCROLL CONTROLA EL FOTOGRAMA
// =======================================================
//
// Idea general:
//   scroll  ──►  progreso (0 a 1)  ──►  tiempo objetivo  ──►  suavizado  ──►  video.currentTime

const videoSection = document.getElementById("video-scrub-section");
const scrubVideo = document.getElementById("scrub-video");
const progressText = document.getElementById("video-progress-text");

const VIDEO_FPS = 30; // Fotogramas por segundo del archivo recodificado
const FRAME = 1 / VIDEO_FPS; // Duración de un fotograma en segundos
const SMOOTHING = 10; // Velocidad del suavizado: más alto = sigue al scroll más rápido

let targetTime = 0; // Tiempo que "pide" el scroll
let smoothTime = 0; // Tiempo suavizado que se va acercando al objetivo
let lastFrameStamp = 0; // Marca de tiempo del fotograma anterior del bucle
let rafId = null; // Identificador del bucle (null = apagado)
let lastPercent = -1; // Último porcentaje escrito, para no tocar el DOM si no cambia

// A. Progreso del scroll dentro de la sección (0 al entrar, 1 al salir)
function getScrollProgress() {
  const rect = videoSection.getBoundingClientRect();
  const scrollable = rect.height - window.innerHeight; // Recorrido mientras el video está fijo
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, -rect.top / scrollable));
}

// B. Bucle de animación: se ejecuta una vez por cada refresco de pantalla
function tick(now) {
  rafId = requestAnimationFrame(tick);

  const duration = scrubVideo.duration;
  if (!duration) return; // Aún no se conocen los metadatos del video

  // dt: segundos desde el último fotograma (limitado por si la pestaña estuvo en segundo plano)
  const dt = Math.min(0.1, (now - (lastFrameStamp || now)) / 1000);
  lastFrameStamp = now;

  // 1. Del scroll al tiempo objetivo. El último fotograma está un poco antes de "duration".
  const progress = getScrollProgress();
  targetTime = progress * (duration - FRAME);

  // 2. Suavizado exponencial independiente de los FPS del monitor (60 Hz, 144 Hz...):
  //    en cada fotograma recorre una fracción de la distancia que falta.
  const ease = 1 - Math.exp(-SMOOTHING * dt);
  smoothTime += (targetTime - smoothTime) * ease;

  // 3. Redondeamos al fotograma exacto más cercano del video
  const frameTime = Math.round(smoothTime * VIDEO_FPS) / VIDEO_FPS;

  // 4. Sólo pedimos un fotograma nuevo si el anterior ya se dibujó y si de verdad cambia
  if (!scrubVideo.seeking && Math.abs(scrubVideo.currentTime - frameTime) >= FRAME / 2) {
    scrubVideo.currentTime = frameTime;
  }

  // 5. Texto de progreso: sólo se actualiza cuando cambia el número
  const percent = Math.round(progress * 100);
  if (progressText && percent !== lastPercent) {
    progressText.textContent = `${percent}%`;
    lastPercent = percent;
  }
}

function startLoop() {
  if (rafId !== null) return;
  // Al volver a la sección colocamos el video directamente donde toca, sin "rebobinar" animado
  if (scrubVideo.duration) {
    smoothTime = getScrollProgress() * (scrubVideo.duration - FRAME);
  }
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

  scrubVideo.pause(); // El video nunca se reproduce solo: lo mueve el scroll

  // C. Encendemos el bucle sólo cuando la sección está en pantalla (ahorra CPU y batería)
  const observer = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? startLoop() : stopLoop()),
    { rootMargin: "100px 0px" } // Arranca un poco antes de que la sección aparezca
  );
  observer.observe(videoSection);
}

initVideoScrub();

// Ejecutamos la inicialización al cargar el script
init();
