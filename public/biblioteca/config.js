const VISTA_LIBRO = {
  inclinacion: 75,
  tamano: 1,
  perspectiva: 2600
};

const COLORES = [
  ['#343e72', '#1a2040'],
  ['#2a7a84', '#134048'],
  ['#8a3550', '#4a1428'],
  ['#3a7a50', '#17402a'],
  ['#6a427f', '#33194a'],
  ['#b8832e', '#6e4510'],
  ['#475669', '#222c3a']
];
const NUM_LIBROS = 7;

const TITULOS_PROXIMOS = {
  3: { name: 'El mundo en llamas',          years: '1941' },
  4: { name: 'El punto de inflexión',       years: '1942-1943' },
  5: { name: 'La guerra total y el horror', years: '' },
  6: { name: 'La caída del Eje',            years: '1944-1945' },
  7: { name: 'El nuevo orden mundial',      years: '' }
};

const LIBROS = [];
function registrarLibro(numero, datos) { LIBROS[numero - 1] = datos; }

const SIMON = {
  idle: 'assets/simon.png',
  talk: null
};

const SIMON_INTRO = [
  { audio: 'assets/audiogato.mp3', start: 0, end: 7.3,
    text: '¡Hola! ¿Cómo estás? Hoy te guiaré por esta aventura donde aprenderás todo sobre la Segunda Guerra Mundial.' },
  { audio: 'assets/audiogato.mp3', start: 7.3, end: 18.45,
    text: 'Yo soy Simon, el único gato en la historia en recibir la Medalla Dickin, una medalla de guerra. Serví en un buque británico cazando ratas y evitando que la tripulación enfermara.' },
  { audio: 'assets/audiogato.mp3', start: 18.45, end: 23.2,
    text: 'Navegaremos toda la historia de la Segunda Guerra Mundial, dividida en siete capítulos.' },
  { audio: 'assets/audiogato.mp3', start: 23.2, end: null,
    text: 'Recuerda: esta es información académica y no pretende hacer propaganda para ningún lado. Es netamente informativa y cultural. ¡Vamos a ello!' }
];

// La música de carga (musica-guitarra.mp3) y el video de introducción
// (assets/intro.mp4) los usa el telón de la página principal.
const MUSICA = {
  fondo: 'assets/musica-relax.mp3',
  volumen: 0.4,
  volumenConVoz: 0.035
};

const VOZ_SINTETICA_SI_FALTA_AUDIO = true;
