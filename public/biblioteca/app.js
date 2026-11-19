const ICONOS = {
  mapa:        '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
  musica:      '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  'musica-off':'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/><path d="M3 3l18 18"/>',
  voz:         '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19.5 5.5a9 9 0 0 1 0 13"/>',
  'voz-off':   '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/>',
  pin:         '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  estante:     '<path d="M4 4h4v16H4zM10 4h4v16h-4z"/><path d="M16 5l3.5-1 3 15.5-3.5 1z"/><path d="M2 21h20"/>',
  libro:       '<path d="M2 5c3-1.5 7-1.5 10 1 3-2.5 7-2.5 10-1v14c-3-1.5-7-1.5-10 1-3-2.5-7-2.5-10-1z"/><path d="M12 6v14"/>',
  carrete:     '<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="6.6" r="2.2"/><circle cx="12" cy="17.4" r="2.2"/><circle cx="6.6" cy="12" r="2.2"/><circle cx="17.4" cy="12" r="2.2"/>',
  red:         '<circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M7.5 6h9M6.3 8.2l4.4 7.6M17.7 8.2l-4.4 7.6"/>',
  pantalla:    '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  candado:     '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'
};

function icono(nombre) {
  return `<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[nombre] || ''}</svg>`;
}

function ponerIcono(el, nombre) {
  const viejo = el.querySelector(':scope > svg.icono');
  if (viejo) viejo.remove();
  el.insertAdjacentHTML('afterbegin', icono(nombre));
}

document.querySelectorAll('[data-icono]').forEach(el => ponerIcono(el, el.dataset.icono));

const Escenas = (() => {
  const EXT_FONDO = ['jpg', 'png'];
  const EXT_CAPA  = ['png'];
  const MAX_CAPAS = 4;
  const ALTO_PAGINA = 1.32;
  const ANCHO_MAX = 96;

  const X_AUTO = { 1: [50], 2: [32, 68], 3: [26, 52, 76], 4: [22, 42, 62, 80] };

  const cache = new Map();

  function buscarImagen(base, exts) {
    return exts.reduce((prev, ext) => prev.then(found => found || new Promise(resolve => {
      const img = new Image();
      img.onload  = () => resolve({ src: `${base}.${ext}`, aspecto: img.naturalWidth / img.naturalHeight });
      img.onerror = () => resolve(null);
      img.src = `${base}.${ext}`;
    })), Promise.resolve(null));
  }

  async function buscarEscena(base) {
    const fondo = await buscarImagen(`${base}-fondo`, EXT_FONDO);
    const capas = [];
    for (let i = 1; i <= MAX_CAPAS; i++) {
      const capa = await buscarImagen(`${base}-capa${i}`, EXT_CAPA);
      if (!capa) break;
      capas.push(capa);
    }
    return { fondo, capas };
  }

  function cargar(carpeta, clave) {
    const k = `${carpeta}/${clave}`;
    if (!cache.has(k)) {
      cache.set(k, (async () => {
        const propia = await buscarEscena(k);
        if (propia.fondo || propia.capas.length) return { ...propia, clave };
        const pagina = clave.split('.')[0];
        return { ...(await buscarEscena(`${carpeta}/${pagina}`)), clave: pagina };
      })());
    }
    return cache.get(k);
  }

  const anchoSegunAlto = (alto, aspecto) => alto * ALTO_PAGINA * aspecto / 2;

  function colocar({ fondo, capas }, ajustes = {}) {
    const items = [];
    if (fondo) {
      const a = { x: 50, prof: 60, alto: 65, ...ajustes.fondo };
      const ancho = a.ancho ?? Math.min(ANCHO_MAX, anchoSegunAlto(a.alto, fondo.aspecto));
      items.push({ ...a, ancho, src: fondo.src, tipo: 'fondo' });
    }
    const n = capas.length;
    capas.forEach((capa, i) => {
      const auto = {
        x: X_AUTO[n][i],
        prof: n === 1 ? 20 : 40 - i * (34 / (n - 1)),
        alto: 40 + i * 3
      };
      const a = { ...auto, ...ajustes[`capa${i + 1}`] };
      const ancho = a.ancho ?? anchoSegunAlto(a.alto, capa.aspecto);
      items.push({ ...a, ancho, src: capa.src, tipo: 'capa' });
    });
    return items;
  }

  function html(items) {
    return items.map((it, i) => `
      <div class="pop ${it.tipo}" style="--x:${it.x}%;--b:${it.prof}%;--w:${it.ancho}%;--h:${it.alto}%;--d:${(i * 0.15).toFixed(2)}s">
        <i class="ground"></i>
        <div class="standee"><div class="sticker"><img src="${it.src}" alt="" draggable="false"></div></div>
      </div>`).join('');
  }

  async function preparar(libro, clave) {
    if (!libro || !libro.carpeta || !clave) return '';
    const escena = await cargar(libro.carpeta, clave);
    const ajustes = libro.escenas || {};
    return html(colocar(escena, ajustes[clave] || ajustes[escena.clave]));
  }

  const precargar = (libro, clave) => { if (libro && libro.carpeta && clave) cargar(libro.carpeta, clave); };

  return { preparar, precargar };
})();

const $ = id => document.getElementById(id);
const shelf = $('shelf'), book = $('book');
const panel = $('panel');
const prevBtn = $('prev'), nextBtn = $('next'), backBtn = $('back'), voiceBtn = $('voice');
const indicator = $('indicator'), kicker = $('kicker'), pTitle = $('p-title'), pText = $('p-text');
const portada = $('portada'), startBtn = $('start'), film = $('film'), filmVideo = $('filmVideo'), skipBtn = $('skipFilm');
const simon = $('simon'), simonImg = $('simonImg');
const bubble = $('bubble'), bubbleText = $('bubble-text'), bubbleNext = $('bubble-next');
const musicBtn = $('music'), guideEl = $('guide');

if (typeof VISTA_LIBRO !== 'undefined') {
  const r = document.documentElement.style;
  if (VISTA_LIBRO.inclinacion != null) r.setProperty('--tilt', VISTA_LIBRO.inclinacion + 'deg');
  if (VISTA_LIBRO.tamano != null)      r.setProperty('--zoom', VISTA_LIBRO.tamano);
  if (VISTA_LIBRO.perspectiva != null) r.setProperty('--persp', VISTA_LIBRO.perspectiva + 'px');
}

function prepararLibro(libro, n) {
  if (!libro) return { title: `Capítulo ${n}`, ...TITULOS_PROXIMOS[n], locked: true, spreads: [] };
  const carpeta = libro.carpeta || `capitulos/${n}`;
  if (libro.tipo === 'video') return { ...libro, carpeta, video: libro.video || `${carpeta}/video.mp4`, spreads: [] };
  const spreads = libro.paginas.flatMap(p => p.lines.map((line, k) => {
    const clave = `${p.num}.${k + 1}`;
    return {
      clave, num: p.num, l: p.title, year: p.year,
      part: k + 1, parts: p.lines.length,
      lines: [{ ...line, audio: line.audio && `${carpeta}/${line.audio}` }],
      lugares: (libro.lugares || {})[clave] || null
    };
  }));
  return { ...libro, carpeta, spreads };
}
const CAPITULOS = Array.from({ length: NUM_LIBROS }, (_, i) => prepararLibro(LIBROS[i], i + 1));

const DURATION = 1000;
let chapterIdx = -1;
let leaves = [], total = 0;
let current = 0;
let lineIdx = 0;
let busy = false;
let escenaEl = null;

simonImg.src = SIMON.idle;
simonImg.onerror = () => simon.classList.add('no-img');

const audio = new Audio();
const canSpeak = 'speechSynthesis' in window;
let voiceOn = true, voice = null;
let clipId = 0, lastClip = null, frameTimer = null, speakTimer = null, syncRaf = 0;
let audioSrc = '';

function pickVoice() {
  const es = speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith('es'));
  voice = es.find(v => /google|natural|online/i.test(v.name)) || es[0] || null;
}
if (canSpeak) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

function setTalking(on) {
  simon.classList.toggle('talking', on);
  duckMusic(on);
  clearInterval(frameTimer);
  if (!SIMON.talk) return;
  if (on) {
    let open = false;
    frameTimer = setInterval(() => { open = !open; simonImg.src = open ? SIMON.talk : SIMON.idle; }, 160);
  } else simonImg.src = SIMON.idle;
}

function tts(text) {
  if (!VOZ_SINTETICA_SI_FALTA_AUDIO || !canSpeak) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'es-ES';
  if (voice) { u.voice = voice; u.lang = voice.lang; }
  u.rate = 0.95;
  u.onstart = () => setTalking(true);
  u.onend = u.onerror = () => setTalking(false);
  speechSynthesis.speak(u);
}

function stopClip() {
  clipId++;
  cancelAnimationFrame(syncRaf);
  audio.onerror = audio.onended = audio.onplaying = audio.onpause = audio.onloadedmetadata = null;
  audio.pause();
  if (canSpeak) speechSynthesis.cancel();
  setTalking(false);
}

function playClip(src, text) {
  stopClip();
  lastClip = { src, text };
  if (!voiceOn) return;
  const id = clipId;
  let fell = false;
  const fallback = () => { if (id !== clipId || fell) return; fell = true; tts(text); };
  if (!src) return fallback();
  audio.onplaying = () => { if (id === clipId) setTalking(true); };
  audio.onended = audio.onpause = () => setTalking(false);
  audio.onerror = fallback;
  audio.src = audioSrc = src;
  audio.play().catch(fallback);
}

function playLine(L) {
  stopClip();
  lastClip = { line: L };
  if (!voiceOn) { setWordsUntil(Infinity); return; }
  const id = clipId;
  const finish = () => {
    if (id !== clipId) return;
    cancelAnimationFrame(syncRaf);
    audio.pause();
    setTalking(false);
    setWordsUntil(Infinity);
    lineDone();
  };
  const tick = () => {
    if (id !== clipId) return;
    const t = audio.currentTime;
    if (L.end && t >= L.end) return finish();
    setWordsUntil(t);
    syncRaf = requestAnimationFrame(tick);
  };
  const begin = () => {
    if (id !== clipId) return;
    audio.currentTime = L.start || 0;
    audio.play().then(() => { if (id === clipId) tick(); }).catch(() => setWordsUntil(Infinity));
  };
  audio.onplaying = () => { if (id === clipId) setTalking(true); };
  audio.onpause = () => setTalking(false);
  audio.onended = finish;
  audio.onerror = () => { if (id === clipId) { setWordsUntil(Infinity); tts(L.text); } };
  setWordsUntil(-1);
  if (audioSrc === L.audio && audio.readyState >= 1) return begin();
  loadAudio(L.audio).then(url => {
    if (id !== clipId) return;
    audio.onloadedmetadata = begin;
    audio.src = url; audioSrc = L.audio;
    audio.load();
  });
}

const blobCache = new Map();
function loadAudio(src) {
  if (listos.has(src)) return Promise.resolve(listos.get(src));
  if (blobCache.has(src)) return blobCache.get(src);
  const p = fetch(src)
    .then(r => { if (!r.ok) throw 0; return r.blob(); })
    .then(b => URL.createObjectURL(b))
    .catch(() => src);
  blobCache.set(src, p);
  while (blobCache.size > 3) {
    const [k, v] = blobCache.entries().next().value;
    if (k === audioSrc) { blobCache.delete(k); blobCache.set(k, v); break; }
    blobCache.delete(k);
    v.then(u => { if (u.startsWith('blob:')) URL.revokeObjectURL(u); });
  }
  return p;
}

function prefetchNext() {
  const lines = spreadLines(), c = CAPITULOS[chapterIdx];
  let n = lines && lines[lineIdx + 1];
  if (!n && c && c.spreads[current]) n = (c.spreads[current].lines || [])[0];
  if (n && n.audio) loadAudio(n.audio);
}

voiceBtn.addEventListener('click', () => {
  voiceOn = !voiceOn;
  ponerIcono(voiceBtn, voiceOn ? 'voz' : 'voz-off');
  voiceBtn.title = voiceOn ? 'Sonido activado' : 'Sonido silenciado';
  if (!voiceOn) { stopClip(); setWordsUntil(Infinity); }
  else if (lastClip && lastClip.line) playLine(lastClip.line);
  else if (lastClip) playClip(lastClip.src, lastClip.text);
});

// Archivos ya descargados (url original -> url local en memoria)
const listos = new Map();

function descargar(url) {
  if (!url) return Promise.resolve(url);
  return fetch(url)
    .then(r => { if (!r.ok) throw 0; return r.blob(); })
    .then(b => { const local = URL.createObjectURL(b); listos.set(url, local); return local; })
    .catch(() => url);
}

// Precarga la voz de la presentación de Simon y la primera línea del capítulo 1
const primerAudio = CAPITULOS[0] && CAPITULOS[0].spreads[0] && CAPITULOS[0].spreads[0].lines[0].audio;
[...new Set(SIMON_INTRO.map(l => l.audio)), primerAudio, SIMON.idle].filter(Boolean).forEach(descargar);

const tracks = {};
const skip = k => (MUSICA.saltarInicio || {})[k] || 0;
const trackReady = {};
for (const k of ['fondo']) {
  const a = new Audio();
  a.volume = 0;
  a.loop = !skip(k);
  if (skip(k)) {
    a.addEventListener('loadedmetadata', () => { if (a.currentTime < skip(k)) a.currentTime = skip(k); });
    a.addEventListener('ended', () => { a.currentTime = skip(k); a.play().catch(() => {}); });
  }
  tracks[k] = a;
}

function loadTrack(k) {
  return trackReady[k] ||= descargar(MUSICA[k]).then(url => { tracks[k].src = url; return tracks[k]; });
}
loadTrack('fondo');
let musicOn = true, musicTrack = null, ducked = false;
const fades = new Map();
const musicTarget = () => !musicOn ? 0 : ducked ? MUSICA.volumenConVoz : MUSICA.volumen;

function fade(a, to, ms = 1200) {
  cancelAnimationFrame(fades.get(a));
  const from = a.volume, t0 = performance.now();
  const step = now => {
    const k = Math.min(1, (now - t0) / ms);
    a.volume = Math.max(0, Math.min(1, from + (to - from) * k));
    if (k < 1) fades.set(a, requestAnimationFrame(step));
    else if (to === 0) a.pause();
  };
  fades.set(a, requestAnimationFrame(step));
}
function playMusic(name = 'fondo') {
  const a = tracks[name];
  if (musicTrack && musicTrack !== a) fade(musicTrack, 0, 1800);
  musicTrack = a;
  if (!musicOn) return;
  loadTrack(name).then(() => startTrack(a, name));
}
function startTrack(a, k) {
  if (musicTrack !== a || !musicOn) return;
  if (skip(k) && a.currentTime < skip(k) && a.readyState >= 1) a.currentTime = skip(k);
  a.play().then(() => fade(a, musicTarget(), 2200)).catch(() => {});
}
function duckMusic(on) {
  ducked = on;
  if (musicTrack && !musicTrack.paused) fade(musicTrack, musicTarget(), on ? 350 : 1200);
}

// Si la música se pausó (por ejemplo, al salir de la sección), vuelve con la siguiente interacción
const unlock = () => {
  if (enPelicula && !film.classList.contains('cartel')) return;
  if (musicOn && musicTrack && musicTrack.paused) playMusic();
};
['pointerdown', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, unlock, { passive: true }));

musicBtn.addEventListener('click', () => {
  musicOn = !musicOn;
  ponerIcono(musicBtn, musicOn ? 'musica' : 'musica-off');
  musicBtn.title = musicOn ? 'Música activada' : 'Música silenciada';
  if (!musicTrack) return;
  if (musicOn) playMusic();
  else fade(musicTrack, 0, 500);
});


let guideTimer = 0, idleTimer = 0;
function guide(text, ms = 4500) {
  clearTimeout(guideTimer);
  if (!text) { guideEl.classList.remove('show'); return; }
  guideEl.innerHTML = text;
  guideEl.classList.add('show');
  if (ms) guideTimer = setTimeout(() => guideEl.classList.remove('show'), ms);
}

let filmOnEnd = null, enPelicula = false;

function abrirPelicula({ src, kicker, titulo, sub, alTerminar, controles = false }) {
  filmOnEnd = alTerminar;
  $('filmKicker').textContent = kicker || '';
  $('filmTitle').textContent = titulo || '';
  $('filmSub').textContent = sub || '';
  film.classList.remove('closing', 'cartel');
  film.classList.toggle('con-controles', controles);
  filmVideo.controls = controles;
  film.classList.add('open');
  enPelicula = true;
  if (!src) return mostrarCartel();
  filmVideo.src = listos.get(src) || src;
  filmVideo.play()
    .then(() => { if (musicTrack) fade(musicTrack, 0, 800); })
    .catch(err => { if (!(err && err.name === 'NotAllowedError' && filmVideo.controls)) mostrarCartel(); });
}

function mostrarCartel() {
  if (!enPelicula || film.classList.contains('cartel')) return;
  filmVideo.removeAttribute('src'); filmVideo.load();
  film.classList.add('cartel');
}

function cerrarPelicula() {
  if (!enPelicula) return;
  enPelicula = false;
  filmVideo.pause();
  film.classList.add('closing');
  if (musicTrack && musicTrack.paused) playMusic();
  setTimeout(() => {
    film.classList.remove('open', 'closing', 'cartel');
    filmVideo.removeAttribute('src'); filmVideo.load();
  }, 600);
  const fin = filmOnEnd; filmOnEnd = null;
  if (fin) fin();
}

filmVideo.addEventListener('ended', cerrarPelicula);
filmVideo.addEventListener('error', () => { if (filmVideo.getAttribute('src')) mostrarCartel(); });
skipBtn.addEventListener('click', cerrarPelicula);

function cerrarPortada() {
  portada.classList.add('gone');
  playMusic();
}

startBtn.addEventListener('click', () => {
  cerrarPortada();
  setTimeout(startSimonIntro, 700);
});

$('saltarIntro').addEventListener('click', () => {
  cerrarPortada();
  document.body.classList.remove('intro');
  guide('Elige un capítulo del estante', 5000);
});

let introIdx = 0;
function startSimonIntro() {
  simon.classList.add('in');
  setTimeout(() => { introIdx = 0; showIntroLine(); }, 900);
}
function showIntroLine() {
  const l = SIMON_INTRO[introIdx];
  bubbleText.textContent = l.text;
  wordEls = [];
  bubbleNext.textContent = introIdx === SIMON_INTRO.length - 1 ? 'Empezar ▸' : 'Continuar ▸';
  bubble.classList.add('show');
  if (introIdx === 0) setTimeout(() => { if (bubble.classList.contains('show') && introIdx === 0) guide('Pulsa <b>Continuar</b> (o →) cuando Simon termine de hablar', 6000); }, 4000);
  if (l.start != null) playLine(l);
  else playClip(l.audio, l.text);
}
bubbleNext.addEventListener('click', () => {
  if (introIdx < SIMON_INTRO.length - 1) { introIdx++; showIntroLine(); }
  else endIntro();
});
function endIntro() {
  stopClip(); lastClip = null;
  guide('');
  bubble.classList.remove('show');
  document.body.classList.remove('intro');

  setTimeout(() => {
    openChapter(0);
    setTimeout(() => {
      if (chapterIdx === 0 && current === 0) go(1);
      guide('Pulsa <b>→</b> o la <b>barra espaciadora</b> para pasar de página', 7000);
    }, 2000);
  }, 700);
}

CAPITULOS.forEach((c, i) => {
  const b = document.createElement('button');
  b.className = 'shelf-book';
  b.style.setProperty('--c1', COLORES[i][0]);
  b.style.setProperty('--c2', COLORES[i][1]);
  b.innerHTML = `<small>CAPÍTULO</small><strong>${i + 1}</strong>` +
    (c.name ? `<em>${c.name}</em>` : `<em>Próximamente</em>`);
  b.setAttribute('aria-label', `${c.title}${c.name ? ': ' + c.name : ''}${c.locked ? ' (próximamente)' : ''}`);
  if (c.locked) b.classList.add('locked');
  if (c.tipo === 'video') {
    b.classList.add('cinta');
    b.innerHTML = `<i class="bobina"></i><span class="etiqueta"><small>CAPÍTULO ${i + 1}</small><em>${c.name}</em></span><i class="bobina"></i>`;
  }
  b.addEventListener('click', () => {
    if (c.tipo === 'video') return verVideo(i);
    if (!c.locked) return openChapter(i);
    b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope');
    guide(`El capítulo ${i + 1}${c.name ? ', <b>' + c.name + '</b>,' : ''} llegará pronto. Empieza por <b>Las Cenizas</b>`);
  });
  shelf.appendChild(b);
});
const shelfBooks = [...shelf.children];

const page = (cls, s, side) => {
  const head = side === 'l'
    ? `<div class="page-head"><small>PÁGINA ${s.num}</small><h2>${s.l}</h2>${s.year ? `<p class="year">${s.year}</p>` : ''}</div>`
    : '';
  const part = side === 'r' && s.parts > 1 ? `<span class="part">${s.part} / ${s.parts}</span>` : '';
  return `<div class="face ${cls}">${head}${part}</div>`;
};

function buildBook(i) {
  const c = CAPITULOS[i], [c1, c2] = COLORES[i];
  book.style.setProperty('--c1', c1);
  book.style.setProperty('--c2', c2);
  book.querySelectorAll('.leaf, .escena').forEach(el => el.remove());

  const S = c.spreads;
  const cover = `<div class="face front cover"><small>CAPÍTULO</small><h1>${i + 1}</h1>${c.name ? `<p class="cover-name">${c.name}</p>` : ''}</div>`;
  const endCover = `<div class="face back cover"><h2>Fin</h2></div>`;

  const faces = [];
  for (let k = 0; k <= S.length; k++) {
    const front = k === 0 ? cover : page('front', S[k - 1], 'r');
    const back  = k === S.length ? endCover : page('back', S[k], 'l');
    faces.push([front, back]);
  }
  faces.forEach(([f, b]) => {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.innerHTML = f + b;
    book.appendChild(leaf);
  });
  leaves = [...book.querySelectorAll('.leaf')];
  total = leaves.length;
  escenaEl = document.createElement('div');
  escenaEl.className = 'escena';
  book.appendChild(escenaEl);
  current = 0;
  lineIdx = 0;
}

function narrationFor(i, state) {
  const c = CAPITULOS[i], n = i + 1;
  if (state === 0)     return { title: c.title, text: c.intro, audio: c.introAudio === false ? false : (c.introAudio || `${c.carpeta}/intro.mp3`) };
  if (state === total) return { title: c.title, text: c.end,   audio: c.endAudio   === false ? false : (c.endAudio   || `${c.carpeta}/fin.mp3`) };
  const s = c.spreads[state - 1];
  return { title: s.l, text: '', audio: false };
}

function openChapter(i) {
  if (busy || chapterIdx !== -1 || document.body.classList.contains('intro')) return;
  busy = true;
  chapterIdx = i;
  buildBook(i);
  render(false);

  book.classList.add('arriving');
  void book.offsetWidth;
  book.classList.remove('arriving');
  book.classList.add('falling');
  document.body.classList.add('reading');
  shelfBooks[i].classList.add('taken');

  setTimeout(() => { book.classList.remove('falling'); busy = false; }, 1300);
  setTimeout(() => {
    const n = narrationFor(chapterIdx, 0);
    if (n.audio !== false) playClip(n.audio, n.text);
  }, 1300);
}

function verVideo(i) {
  if (busy || chapterIdx !== -1 || document.body.classList.contains('intro')) return;
  const c = CAPITULOS[i];
  guide('');
  stopClip();
  abrirPelicula({
    src: c.video, controles: true, kicker: `Capítulo ${i + 1}`, titulo: c.name, sub: 'Video próximamente',
    alTerminar: () => guide('Elige otro capítulo del estante')
  });
}

function closeChapter() {
  if (busy || chapterIdx === -1) return;
  cerrarQuiz();
  busy = true;
  guide(''); clearTimeout(idleTimer); showPlaces(null);
  clearTimeout(speakTimer);
  stopClip(); lastClip = null;
  current = 0;
  render(false);
  setTimeout(() => {
    book.classList.add('leaving');
    document.body.classList.remove('reading');
  }, 1100);
  setTimeout(() => {
    shelfBooks[chapterIdx].classList.remove('taken');
    book.classList.remove('leaving');
    chapterIdx = -1;
    busy = false;
  }, 2100);
}

function updateVisibleFaces() {
  book.querySelectorAll('.face').forEach(f => f.classList.remove('visible'));
  if (current < total) leaves[current].querySelector('.front').classList.add('visible');
  if (current > 0)     leaves[current - 1].querySelector('.back').classList.add('visible');
}

let typer = null;
function typeText(text) {
  clearInterval(typer);
  pText.classList.remove('karaoke');
  pText.textContent = '';
  let i = 0;
  typer = setInterval(() => {
    pText.textContent = text.slice(0, ++i);
    if (i >= text.length) clearInterval(typer);
  }, 18);
}

let wordEls = [], wordTimes = [], lastLit = -2;
function showLine(L) {
  clearInterval(typer);
  pText.classList.add('karaoke');
  const words = L.text.split(' ');
  pText.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' ');
  wordEls = [...pText.children];
  wordTimes = L.t || [];
  lastLit = -2;
  pText.scrollTop = 0;
}
function setWordsUntil(t) {
  if (!wordEls.length) return;
  let k = -1;
  if (t === Infinity) k = wordEls.length - 1;
  else while (k + 1 < wordTimes.length && wordTimes[k + 1] <= t) k++;
  if (k === lastLit) return;
  wordEls.forEach((el, i) => { el.classList.toggle('lit', i < k || (i === k && t === Infinity)); el.classList.toggle('now', i === k && t !== Infinity); });
  lastLit = k;
  const el = wordEls[Math.max(k, 0)];
  if (k >= 0 && t !== Infinity && el.offsetTop + el.offsetHeight > pText.scrollTop + pText.clientHeight - 8)
    pText.scrollTo({ top: el.offsetTop - pText.clientHeight / 3, behavior: 'smooth' });
}
function lineDone() {
  nextBtn.classList.add('ready');
  clearTimeout(idleTimer);
  if (chapterIdx !== -1 && current > 0 && current < total)
    idleTimer = setTimeout(() => guide('Pulsa <b>→</b> para seguir con la historia'), 6000);
}

const spreadLines = () => {
  if (chapterIdx === -1 || current === 0 || current === total) return null;
  return CAPITULOS[chapterIdx].spreads[current - 1].lines || null;
};

function updateIndicator() {
  const lines = spreadLines();
  if (current === 0) indicator.textContent = 'Portada';
  else if (current === total) indicator.textContent = 'Fin';
  else {
    const s = CAPITULOS[chapterIdx].spreads[current - 1];
    indicator.textContent = s.parts ? `Pág. ${s.num} · ${s.part}/${s.parts}` : `Hoja ${current} / ${total - 1}`;
  }
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === total;
}

const mapbox = $('mapbox'), mapTitle = $('mapTitle'), mapBtn = $('mapBtn');
let map = null, pins = null, mapOn = true, lastPlaces = null;
function initMap() {
  if (map || !window.L) return;
  map = L.map('minimap', { zoomControl: false, scrollWheelZoom: false, worldCopyJump: true, attributionControl: true })
         .setView([50, 12], 4);
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 10, minZoom: 2,
    attribution: 'Mapa © Esri, National Geographic'
  }).addTo(map);
  map.attributionControl.setPrefix(false);
  pins = L.layerGroup().addTo(map);
}
function showPlaces(list) {
  lastPlaces = list;
  if (!list || !list.length || !window.L || !mapOn) { mapbox.classList.remove('show'); return; }
  mapbox.classList.add('show');
  initMap();
  map.invalidateSize();
  pins.clearLayers();
  list.forEach(([lat, lon, name], i) => {
    L.marker([lat, lon], {
      icon: L.divIcon({ className: 'pin', html: `<span style="animation-delay:${.4 + i * .15}s"></span>`, iconSize: [20, 26], iconAnchor: [10, 26] })
    }).bindTooltip(name, { permanent: list.length <= 2, direction: 'top', offset: [0, -24], className: 'pin-tip' }).addTo(pins);
  });
  mapTitle.textContent = list.map(p => p[2].split(':')[0]).join(' · ');
  ponerIcono(mapTitle, 'pin');
  if (list.length === 1) map.flyTo([list[0][0], list[0][1]], list[0][3] || 6, { duration: 1.6 });
  else map.flyToBounds(L.latLngBounds(list.map(p => [p[0], p[1]])), { padding: [34, 34], maxZoom: 6, duration: 1.6 });
}
mapBtn.addEventListener('click', () => {
  mapOn = !mapOn;
  mapBtn.classList.toggle('off', !mapOn);
  mapBtn.title = mapOn ? 'Ocultar mapa' : 'Mostrar mapa';
  showPlaces(lastPlaces);
});

function narrate(speak) {
  nextBtn.classList.remove('ready');
  clearTimeout(idleTimer);
  updateIndicator();
  const c = CAPITULOS[chapterIdx], lines = spreadLines();
  kicker.textContent = `CAPÍTULO ${chapterIdx + 1}${c.name ? ' · ' + c.name.toUpperCase() : ''}`;
  clearTimeout(speakTimer);
  if (lines) {
    const s = c.spreads[current - 1], L = lines[lineIdx];
    pTitle.textContent = s.year ? `${s.l} (${s.year})` : s.l;
    setTimeout(() => showPlaces(s.lugares), 300);
    showLine(L);
    setWordsUntil(voiceOn && speak ? -1 : Infinity);
    if (speak) speakTimer = setTimeout(() => { playLine(L); prefetchNext(); }, 350);
    else stopClip();
    return;
  }
  wordEls = [];
  showPlaces(null);
  const n = narrationFor(chapterIdx, current);
  pTitle.textContent = n.title;
  typeText(n.text);
  if (current === total) {
    const c = CAPITULOS[chapterIdx];
    if (c.quiz && c.quiz.length) quizTimer = setTimeout(() => abrirQuiz(c.quiz), 1500);
    else guide('Fin del capítulo. Pulsa <b>Estante</b> para volver, o <b>←</b> para repasar', 9000);
  } else cerrarQuiz();
  if (speak) {
    if (n.audio === false) { stopClip(); lastClip = null; lineDone(); }
    else speakTimer = setTimeout(() => playClip(n.audio, n.text), 350);
  }
}

let escenaGen = 0;
function actualizarEscena() {
  if (!escenaEl) return;
  const gen = ++escenaGen;
  escenaEl.classList.remove('show');
  const libro = CAPITULOS[chapterIdx];
  const s = current > 0 && current < total ? libro.spreads[current - 1] : null;
  if (!s) return;

  const k = total > 12 ? 0.8 : 2;
  escenaEl.style.setProperty('--escena-z', (Math.max((current - 1) * k, (total - current) * k) + 1.5) + 'px');
  const listo = Escenas.preparar(libro, s.clave);
  const siguiente = libro.spreads[current];
  if (siguiente) Escenas.precargar(libro, siguiente.clave);
  setTimeout(() => listo.then(htmlEscena => {
    if (gen !== escenaGen || !htmlEscena) return;
    escenaEl.innerHTML = htmlEscena;
    void escenaEl.offsetWidth;
    escenaEl.classList.add('show');
  }), DURATION * 0.8);
}

function render(speak = true) {
  leaves.forEach((leaf, i) => {
    const flipped = i < current;
    leaf.classList.toggle('flipped', flipped);
    leaf.style.setProperty('--z', ((flipped ? i : total - i) * (total > 12 ? 0.8 : 2)) + 'px');
  });
  book.classList.toggle('open',  current > 0);
  book.classList.toggle('ended', current === total);
  updateVisibleFaces();
  actualizarEscena();
  narrate(speak);
}

let steps = 0;
function go(step) {
  if (busy || chapterIdx === -1) return;
  if (++steps > 1 && guideEl.classList.contains('show') && current !== total) guide('');
  const lines = spreadLines();
  if (lines && lineIdx + step >= 0 && lineIdx + step < lines.length) {
    lineIdx += step;
    narrate(true);
    return;
  }
  const target = current + step;
  if (target < 0 || target > total) return;
  busy = true;
  const moving = leaves[step > 0 ? current : target];
  moving.classList.add('turning');
  setTimeout(() => moving.classList.remove('turning'), DURATION);
  current = target;
  const nl = spreadLines();
  lineIdx = step < 0 && nl ? nl.length - 1 : 0;
  render();
  setTimeout(() => (busy = false), DURATION);
}

const quizEl = $('quiz'), quizOpciones = $('quizOpciones'), quizNota = $('quizNota'), quizBtn = $('quizBtn');
let quiz = null, quizIdx = 0, quizAciertos = 0, quizTimer = 0;

function abrirQuiz(preguntas) {
  quiz = preguntas; quizIdx = 0; quizAciertos = 0;
  guide('');
  mostrarPregunta();
  quizEl.classList.add('show');
}
function cerrarQuiz() {
  clearTimeout(quizTimer);
  quizEl.classList.remove('show');
}
function mostrarPregunta() {
  const q = quiz[quizIdx];
  $('quizPaso').textContent = `Pregunta ${quizIdx + 1} de ${quiz.length}`;
  $('quizPregunta').textContent = q.pregunta;
  quizOpciones.innerHTML = '';
  q.opciones.forEach((texto, i) => {
    const b = document.createElement('button');
    b.className = 'quiz-opcion';
    b.textContent = texto;
    b.addEventListener('click', () => responder(i));
    quizOpciones.appendChild(b);
  });
  quizNota.textContent = '';
  quizBtn.hidden = true;
}
function responder(i) {
  const q = quiz[quizIdx], botones = [...quizOpciones.children];
  botones.forEach((b, k) => {
    b.disabled = true;
    if (k === q.correcta) b.classList.add('bien');
    else if (k === i) b.classList.add('mal');
  });
  if (i === q.correcta) { quizAciertos++; quizNota.textContent = '¡Correcto!'; }
  else quizNota.textContent = `La respuesta era: ${q.opciones[q.correcta]}`;
  quizBtn.textContent = quizIdx < quiz.length - 1 ? 'Siguiente ›' : 'Ver resultado';
  quizBtn.hidden = false;
  quizBtn.focus();
}
quizBtn.addEventListener('click', () => {
  if (quizIdx < quiz.length - 1) { quizIdx++; return mostrarPregunta(); }
  if (quizIdx === quiz.length) return cerrarQuiz();
  quizIdx = quiz.length;
  const total = quiz.length;
  $('quizPaso').textContent = 'Resultado';
  $('quizPregunta').textContent = `Acertaste ${quizAciertos} de ${total}`;
  quizOpciones.innerHTML = '';
  quizNota.textContent = quizAciertos === total ? '¡Excelente! Dominas este capítulo.'
    : quizAciertos ? '¡Bien! Puedes repasar con ← si quieres.' : 'Repasa el capítulo con ← y vuelve a intentarlo.';
  quizBtn.textContent = 'Cerrar';
  guide('Pulsa <b>Estante</b> para elegir otro capítulo', 9000);
});

// Pantalla completa (la biblioteca está dentro de un iframe de la página principal)
const fullBtn = $('fullBtn');
fullBtn.addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => {});
});
if (!document.fullscreenEnabled) fullBtn.hidden = true;

// La página principal llama a esta función cuando la sección deja de verse
window.pausarBiblioteca = () => {
  stopClip();
  setWordsUntil(Infinity);
  if (enPelicula) filmVideo.pause();
  if (musicTrack && !musicTrack.paused) fade(musicTrack, 0, 600);
};

nextBtn.addEventListener('click', () => go(1));
prevBtn.addEventListener('click', () => go(-1));
backBtn.addEventListener('click', closeChapter);
document.addEventListener('keydown', e => {
  if (quizEl.classList.contains('show')) {
    if (e.key === 'Escape') cerrarQuiz();
    return;
  }
  if (enPelicula) {
    if (filmVideo.controls && e.key === ' ') { e.preventDefault(); filmVideo.paused ? filmVideo.play() : filmVideo.pause(); }
    else if (filmVideo.controls && e.key === 'ArrowRight') filmVideo.currentTime += 5;
    else if (filmVideo.controls && e.key === 'ArrowLeft') filmVideo.currentTime -= 5;
    else if (['Escape', 'Enter', ' '].includes(e.key)) { e.preventDefault(); cerrarPelicula(); }
    return;
  }
  if (bubble.classList.contains('show') && ['ArrowRight', ' ', 'Enter'].includes(e.key)) {
    e.preventDefault(); bubbleNext.click(); return;
  }
  if (e.key === 'ArrowRight' || (e.key === ' ' && chapterIdx !== -1)) { e.preventDefault(); go(1); }
  if (e.key === 'ArrowLeft')  go(-1);
  if (e.key === 'Escape')     closeChapter();
});
