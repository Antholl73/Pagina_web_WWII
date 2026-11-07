// src/main.js

// 1. librería Scrollama
import scrollama from "scrollama";

// 2. Seleccionamos los elementos del DOM que vamos a actualizar
const currentYearEl = document.getElementById("current-year");
const graphicDescEl = document.getElementById("graphic-desc");
const stepElements = document.querySelectorAll(".step");

// 3. Diccionario con subtítulos históricos según el año
const historicalData = {
  1939: "Invasión de Polonia y estallido de la guerra",
  1940: "Caída de Francia y Batalla de Inglaterra",
  1941: "Operación Barbarroja y frente soviético",
  1944: "Día D y el desembarco en Normandía",
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

// Ejecutamos la inicialización al cargar el script
init();
