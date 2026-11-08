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
// 7. MOTOR DE VIDEO SCRUBBING CON SUAVIZADO (LERP/INERCIA)
// =======================================================

const videoSection = document.getElementById("video-scrub-section");
const scrubVideo = document.getElementById("scrub-video");
const progressText = document.getElementById("video-progress-text");

let targetTime = 0; // El segundo exacto al que el scroll quiere ir
let isVideoReady = false; // Bandera para saber si el video ya cargó su duración

if (scrubVideo) {
  scrubVideo.pause();

  // Confirmamos que el video cargó sus metadatos
  scrubVideo.addEventListener("loadedmetadata", () => {
    isVideoReady = true;
    console.log(
      `Video listo para scrubbing. Duración: ${scrubVideo.duration.toFixed(2)}s`,
    );
  });
}

// 1. Calculamos el objetivo de tiempo según el scroll (función ultra ligera)
function calculateScrollProgress() {
  if (!videoSection || !scrubVideo || !isVideoReady) return;

  const rect = videoSection.getBoundingClientRect();
  const totalScrollDistance = rect.height - window.innerHeight;
  const pixelsScrolled = -rect.top;

  let progress = pixelsScrolled / totalScrollDistance;
  progress = Math.max(0, Math.min(1, progress));

  // Actualizamos el tiempo meta al que queremos que llegue el video
  targetTime = progress * scrubVideo.duration;

  if (progressText) {
    progressText.textContent = `${Math.round(progress * 100)}%`;
  }
}

// Escuchamos el scroll con passive: true para que el navegador no bloquee el hilo visual
window.addEventListener("scroll", calculateScrollProgress, { passive: true });

// 2. Bucle de renderizado continuo: aproxima suavemente el video hacia targetTime
function renderSmoothVideo() {
  if (isVideoReady && scrubVideo.duration) {
    // Calculamos la distancia entre dónde está el video y a dónde debe ir
    const delta = targetTime - scrubVideo.currentTime;

    // Solo actualizamos si hay diferencia y el decodificador NO está saturado buscando
    if (Math.abs(delta) > 0.03 && !scrubVideo.seeking) {
      // Avanzamos un 15% de la distancia restante en cada cuadro (efecto inercia/amortiguador)
      const nextTime = scrubVideo.currentTime + delta * 0.15;

      // Usamos fastSeek si el navegador lo soporta, o currentTime estándar
      if ("fastSeek" in scrubVideo) {
        scrubVideo.fastSeek(nextTime);
      } else {
        scrubVideo.currentTime = nextTime;
      }
    }
  }

  // Solicitamos el siguiente cuadro
  requestAnimationFrame(renderSmoothVideo);
}

// Arrancamos el bucle de suavizado
requestAnimationFrame(renderSmoothVideo);

// Ejecutamos la inicialización al cargar el script
init();
