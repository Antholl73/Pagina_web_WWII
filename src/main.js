import scrollama from "scrollama";

const timelineYearEl = document.getElementById("timeline-year");
const stepElements = document.querySelectorAll(".step");

const scroller = scrollama();
const introEl = document.getElementById("intro");

function initIntro() {
  if (!introEl) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const reveal = () => {
    introEl.classList.add("is-complete");
    window.setTimeout(() => introEl.remove(), reduceMotion ? 20 : 1150);
  };

  window.setTimeout(reveal, reduceMotion ? 80 : 1800);
}

function updateTimeline(year) {
  if (!timelineYearEl || !year) return;

  // Si ya muestra ese año (por ejemplo, al volver a la misma tarjeta), no hacemos nada
  if (timelineYearEl.textContent === year) return;

  // Cada cifra en su propia caja: "1922" → <span>1</span><span>9</span>...
  const digits = [...year].map(
    (digit) => `<span class="timeline__digit">${digit}</span>`,
  );
  timelineYearEl.innerHTML = digits.join("");

  // Reinicia el fundido: quitar la clase, forzar al navegador a notarlo, volver a ponerla
  timelineYearEl.classList.remove("is-changing");
  void timelineYearEl.offsetWidth;
  timelineYearEl.classList.add("is-changing");
}

function handleStepEnter({ element }) {
  stepElements.forEach((step) =>
    step.classList.toggle("is-active", step === element),
  );
  updateTimeline(element.dataset.year);
}

function initScrollytelling() {
      scroller
        .setup({
          step: ".step",
          offset: 0.50,
          debug: false,
        })
        .onStepEnter(handleStepEnter);

      window.addEventListener("resize", scroller.resize);

      // Recalcula automáticamente cuando cambian las dimensiones de las tarjetas
      // (al cargar imágenes lazy, fuentes o estrechar la ventana)
      const stepsContainer = document.querySelector(".scrolly__steps");
      if (stepsContainer && "ResizeObserver" in window) {
        let resizeRaf = null;
        const observer = new ResizeObserver(() => {
          cancelAnimationFrame(resizeRaf);
          resizeRaf = requestAnimationFrame(() => scroller.resize());
        });
        observer.observe(stepsContainer);
      }
    }

const CINEMA_REELS = [
  {
    badge: "Rollo 01 / 04 · Material de prueba",
    period: "Rollo 01 · 1918–1932",
    title: "Posguerra, Versalles y Gran Depresión",
    desc: "Analiza cómo el impacto del Tratado de Versalles en Weimar, el descontento italiano de posguerra y el desempleo masivo tras 1929 crearon el escenario que aprovecharon fascistas y nazis mediante propaganda y violencia política.",
    source: "Fuentes: The Avalon Project, 1919; USHMM, s. f.-a; USHMM, s. f.-b; Williamson, 2023",
    src: "/videos/prueba_video_01.mp4",
  },
  {
    badge: "Rollo 02 / 04 · Material de prueba",
    period: "Rollo 02 · 1922–1935",
    title: "Dos Caminos al Poder: Roma y Berlín",
    desc: "Compara el ascenso de Mussolini tras la Marcha sobre Roma (con subsistencia formal de la monarquía) frente a la llegada de Hitler en 1933, la Ley Habilitante, las SA/SS y las Leyes de Núremberg de 1935.",
    source: "Fuentes: Gerwarth, 2020; USHMM, s. f.-c; USHMM, s. f.-d; USHMM, s. f.-e; USHMM, s. f.-f",
    src: "/videos/prueba_video_01.mp4",
  },
  {
    badge: "Rollo 03 / 04 · Material de prueba",
    period: "Rollo 03 · 1931–1941",
    title: "Escalada, Blitzkrieg y Viraje Global",
    desc: "Recorre la gestación del conflicto desde Manchuria (1931) y España (1936), el apaciguamiento y el Pacto Ribbentrop-Molotov hasta la guerra relámpago en Europa, Barbarroja y Pearl Harbor.",
    source: "Fuentes: Beevor, 2012; García Moreno, s. f.",
    src: "/videos/prueba_video_01.mp4",
  },
  {
    badge: "Rollo 04 / 04 · Material de prueba",
    period: "Rollo 04 · 1938–1945",
    title: "Rassenkrieg, Holocausto y Nuevo Orden",
    desc: "Examina el proyecto de Espacio Vital y guerra racial en el Este, la industrialización del exterminio en la Shoah, las 45–55 millones de víctimas y el mundo bipolar y poscolonial de 1945.",
    source: "Fuentes: USHMM, s. f.-g; Beevor, 2012; García Moreno, s. f.",
    src: "/videos/prueba_video_01.mp4",
  },
];

function initCinemaBooth() {
  const video = document.getElementById("cinema-video");
  const badgeEl = document.getElementById("cinema-reel-badge");
  const periodEl = document.getElementById("cinema-period");
  const titleEl = document.getElementById("cinema-title");
  const descEl = document.getElementById("cinema-desc");
  const sourceEl = document.getElementById("cinema-source");
  const reelButtons = [...document.querySelectorAll(".cinema__reel")];

  if (!video || reelButtons.length === 0) return;

  function selectReel(index, shouldAutoplay = false) {
    const reel = CINEMA_REELS[index];
    if (!reel) return;

    reelButtons.forEach((btn, i) => {
      const isActive = i === index;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });

    if (badgeEl) badgeEl.textContent = reel.badge;
    if (periodEl) periodEl.textContent = reel.period;
    if (titleEl) titleEl.textContent = reel.title;
    if (descEl) descEl.textContent = reel.desc;
    if (sourceEl) sourceEl.textContent = reel.source;

    if (video.getAttribute("src") !== reel.src) {
      video.setAttribute("src", reel.src);
      video.load();
    } else {
      video.currentTime = 0;
    }

    if (shouldAutoplay) {
      video.play().catch(() => {});
    }
  }

  reelButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.reel);
      selectReel(index, true);
    });
  });
}

function initCreditsModal() {
  const openBtn = document.getElementById("open-credits-btn");
  const closeBtn = document.getElementById("close-credits-btn");
  const modal = document.getElementById("modal-creditos");

  if (!openBtn || !modal) return;

  openBtn.addEventListener("click", () => modal.showModal());
  closeBtn?.addEventListener("click", () => modal.close());

  // Cierra la ficha al hacer clic fuera de ella (en el fondo oscuro)
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });
}

// ==========================================================================
// RED INTERACTIVA DE RELACIONES HISTÓRICAS
// ==========================================================================

const NETWORK_DATA = {
  // Columna 1: Causas y Contexto
  versalles: {
    category: "Causa · Alemania (1919)",
    title: "Versalles y Crisis de Weimar",
    text: "Tras 1918, la República de Weimar enfrentó crisis política y económica. El Tratado de Versalles impuso pérdidas territoriales, límites militares y reparaciones que la extrema derecha utilizó para atacar a la democracia y alimentar el revanchismo.",
    sources: "The Avalon Project, 1919; USHMM, s. f.-a; García Moreno, s. f.",
  },
  "italia-posguerra": {
    category: "Causa · Italia (1918–1922)",
    title: "Posguerra y Temor al Socialismo",
    text: "Aunque estuvo en el bando vencedor, Italia sufrió descontento por los resultados de la guerra, inflación y agudos conflictos sociales. El temor de sectores propietarios al auge socialista abrió espacio al fascismo.",
    sources: "Williamson, 2023; Acemoglu et al., 2022",
  },
  "depresion-29": {
    category: "Causa · Crisis Global (1929)",
    title: "Gran Depresión de 1929",
    text: "El colapso económico disparó el desempleo masivo y la inestabilidad parlamentaria en Alemania, facilitando el ascenso de los totalitarismos europeos y el impulso expansionista industrial de Japón en Asia.",
    sources: "USHMM, s. f.-b; USHMM, s. f.-c; García Moreno, s. f.",
  },
  "precursores-apaciguamiento": {
    category: "Causa · Escalada (1931–1938)",
    title: "Precursores y Apaciguamiento",
    text: "El conflicto se gestó antes de 1939 con la invasión japonesa de Manchuria (1931) y la Guerra Civil Española (1936), sumadas a la inoperancia de la Sociedad de Naciones y al apaciguamiento de Gran Bretaña y Francia.",
    sources: "Beevor, 2012; García Moreno, s. f.",
  },
  "tesis-no-inevitable": {
    category: "Enfoque Historiográfico",
    title: "La Crisis ≠ Inevitabilidad",
    text: "Las crisis económicas y de posguerra favorecieron el ascenso autoritario, pero no explican por sí solas las dictaduras: fueron determinantes la violencia política, la propaganda y las decisiones de las élites.",
    sources: "Passmore, 2014; Williamson, 2023; USHMM, s. f.-c",
  },

  // Columna 2: Actores y Bloques
  elites: {
    category: "Actor · Poder Tradicional",
    title: "Élites, Monarquía e Hindenburg",
    text: "Sectores conservadores, industriales, la monarquía de Víctor Manuel III en Italia y el presidente Hindenburg en Alemania toleraron la violencia o integraron a fascistas y nazis en coaliciones de gobierno.",
    sources: "Williamson, 2023; Gerwarth, 2020; USHMM, s. f.-c",
  },
  fascismo: {
    category: "Actor · Italia (PNF)",
    title: "Benito Mussolini y el Fascismo",
    text: "Fundado en 1919, el movimiento fascista canalizó el nacionalismo agraviado, atacó opositores con escuadristas e instauró una dictadura que convivió formalmente con la monarquía e impulsó el militarismo.",
    sources: "Gerwarth, 2020; Williamson, 2023; USHMM, s. f.-d",
  },
  nazismo: {
    category: "Actor · Alemania (NSDAP)",
    title: "Adolf Hitler y el Partido Nazi",
    text: "Movimiento racista, antisemita y antidemocrático. Pasó al 18 % de los votos en 1930 y fue el partido más votado en julio de 1932 (sin mayoría absoluta), combinando promesas de empleo con odio racial.",
    sources: "USHMM, s. f.-b; USHMM, s. f.-c; Beevor, 2012",
  },
  "potencias-urss": {
    category: "Actor · Escenario Mundial",
    title: "Potencias Occidentales, URSS y Japón",
    text: "Gran Bretaña y Francia cedieron ante Hitler antes de 1939; la URSS firmó el Pacto Ribbentrop-Molotov (1939) y luego encabezó el frente oriental tras 1941; Japón atacó China y Pearl Harbor, globalizando la guerra junto a EE. UU.",
    sources: "Beevor, 2012; García Moreno, s. f.",
  },

  // Columna 3: Acontecimientos y Mecanismos
  "marcha-roma": {
    category: "Acontecimiento · Octubre 1922",
    title: "Marcha sobre Roma",
    text: "Demostración armada de los escuadristas fascistas tras la cual el rey Víctor Manuel III nombró a Mussolini jefe de gobierno, abriendo paso al desmantelamiento gradual del sistema parlamentario.",
    sources: "Gerwarth, 2020; Williamson, 2023; USHMM, s. f.-d",
  },
  "violencia-propaganda": {
    category: "Mecanismo de Poder",
    title: "Violencia Paramilitar y Propaganda",
    text: "Escuadristas en Italia y las SA/SS en Alemania intimidaron y reprimieron físicamente a la oposición mientras la censura y la propaganda antisemita y nacionalista moldeaban la opinión pública.",
    sources: "Gerwarth, 2020; USHMM, s. f.-b; USHMM, s. f.-d",
  },
  "ley-habilitante": {
    category: "Acontecimiento · 1933",
    title: "Cancillería y Ley Habilitante",
    text: "Nombrado canciller el 30 de enero de 1933 dentro de una coalición, Hitler eliminó rápidamente las libertades públicas y obtuvo en marzo la Ley Habilitante para gobernar sin el Parlamento.",
    sources: "USHMM, s. f.-c; USHMM, s. f.-e",
  },
  "leyes-raciales": {
    category: "Acontecimiento · 1935 y 1938",
    title: "Núremberg, Cristales Rotos e Italia",
    text: "En Alemania, las Leyes de Núremberg (1935) privaron de ciudadanía a los judíos y la Noche de los Cristales Rotos (1938) escaló la violencia pública. Italia promulgó sus leyes antisemitas en 1938.",
    sources: "USHMM, s. f.-d; USHMM, s. f.-f; Beevor, 2012",
  },
  "estallido-blitzkrieg": {
    category: "Acontecimiento · 1939–1940",
    title: "Pacto, Polonia y Blitzkrieg",
    text: "Tras el Pacto Ribbentrop-Molotov (agosto 1939), Alemania invadió Polonia (1 de septiembre), desatando la guerra. Con la Blitzkrieg derrotó a Francia en 1940 e Italia entró al conflicto; Gran Bretaña resistió con el radar.",
    sources: "USHMM, s. f.-d; García Moreno, s. f.",
  },
  "viraje-global": {
    category: "Acontecimiento · 1941–1945",
    title: "Barbarroja, Pearl Harbor e Inflexión",
    text: "En 1941, la invasión a la URSS y Pearl Harbor globalizaron la guerra. Entre 1942 y 1943, Midway, El Alamein y Stalingrado frenaron al Eje; en 1944–1945, Normandía, la toma de Berlín y las bombas atómicas cerraron el conflicto.",
    sources: "Beevor, 2012; García Moreno, s. f.",
  },

  // Columna 4: Consecuencias
  "dos-dictaduras": {
    category: "Consecuencia · Comparativa Institucional",
    title: "Totalitarismo Nazi vs. Monarquía Formal",
    text: "Ambos eliminaron libertades y oposición, pero con trayectorias distintas: el nazismo destruyó rápidamente la democracia de Weimar en un régimen totalitario; en Italia, la dictadura consolidada mantuvo formalmente la monarquía.",
    sources: "USHMM, s. f.-d; USHMM, s. f.-e; Passmore, 2014",
  },
  "lebensraum-rassenkrieg": {
    category: "Consecuencia · Frente Ideológico",
    title: "Lebensraum y Rassenkrieg",
    text: "El proyecto nazi no buscaba solo revisar Versalles, sino conquistar un «Espacio Vital» en el este mediante una guerra racial (Rassenkrieg) para someter a la población eslava y controlar los recursos soviéticos.",
    sources: "Beevor, 2012; García Moreno, s. f.",
  },
  holocausto: {
    category: "Consecuencia · 1938–1945",
    title: "El Holocausto y Exterminio",
    text: "Culminación industrializada del antisemitismo racial nazi mediante guetos y campos de exterminio con gas, provocando el asesinato sistemático de seis millones de judíos europeos y otras poblaciones perseguidas.",
    sources: "USHMM, s. f.-f; USHMM, s. f.-g; Beevor, 2012",
  },
  "guerra-total": {
    category: "Consecuencia · Balance Humano",
    title: "Guerra Total y Devastación (45–55M)",
    text: "La guerra de materiales convirtió ciudades y civiles en objetivos: entre 45 y 55 millones de muertos (~25M civiles y 20M solo en la URSS), más de 30M de desplazados y una caída del 50 % de la capacidad industrial europea.",
    sources: "García Moreno, s. f.; Beevor, 2012",
  },
  "nuevo-orden": {
    category: "Consecuencia · Posguerra (1945+)",
    title: "Guerra Fría, Descolonización y Ciencia",
    text: "Alemania fue dividida en cuatro zonas y Europa del Este quedó bajo órbita soviética, iniciando la bipolaridad nuclear EE. UU.–URSS. Se aceleró la descolonización en África y Asia y surgieron la era nuclear, el radar, antibióticos e informática.",
    sources: "García Moreno, s. f.",
  },
};

const NETWORK_EDGES = [
  // Eje 1: Ascenso Fascista / Nazi y Comparativa Institucional
  {
    from: "versalles",
    to: "nazismo",
    axes: ["ascenso", "camino-1939"],
    kind: "Bandera nacionalista",
    why: "La extrema derecha y el NSDAP usaron las pérdidas territoriales, los límites militares y las reparaciones de Versalles para deslegitimar a la República de Weimar.",
    source: "USHMM, s. f.-a; The Avalon Project, 1919",
  },
  {
    from: "versalles",
    to: "violencia-propaganda",
    axes: ["ascenso"],
    kind: "Discurso de agravio",
    why: "El mito de una paz injusta alimentó la propaganda revanchista y la movilización callejera radical contra el orden republicano alemán.",
    source: "USHMM, s. f.-a; García Moreno, s. f.",
  },
  {
    from: "versalles",
    to: "precursores-apaciguamiento",
    axes: ["camino-1939"],
    kind: "Fractura diplomática",
    why: "Las tensiones no resueltas de 1919 y las demandas revisionistas sobre fronteras europeas minaron la autoridad de la Sociedad de Naciones.",
    source: "García Moreno, s. f.",
  },
  {
    from: "italia-posguerra",
    to: "fascismo",
    axes: ["ascenso"],
    kind: "Caldo social",
    why: "El descontento por los resultados de la guerra, la inflación y la conflictividad obrera impulsaron el crecimiento inicial del movimiento fundado por Mussolini en 1919.",
    source: "Williamson, 2023; Acemoglu et al., 2022",
  },
  {
    from: "italia-posguerra",
    to: "elites",
    axes: ["ascenso"],
    kind: "Alarma propietaria",
    why: "Las huelgas y el temor al avance socialista llevaron a sectores económicos y conservadores a tolerar e incluso respaldar al fascismo como barrera frente a la izquierda.",
    source: "Williamson, 2023; Acemoglu et al., 2022",
  },
  {
    from: "italia-posguerra",
    to: "marcha-roma",
    axes: ["ascenso"],
    kind: "Crisis política",
    why: "La parálisis institucional de la posguerra italiana permitió que Mussolini presentara la movilización fascista de 1922 como supuesta salida de orden.",
    source: "Gerwarth, 2020; Williamson, 2023",
  },
  {
    from: "depresion-29",
    to: "nazismo",
    axes: ["ascenso"],
    kind: "Salto electoral",
    why: "El desempleo masivo tras 1929 convirtió al NSDAP de fuerza marginal en partido del 18 % en 1930 y primera fuerza en julio de 1932 prometiendo trabajo y orden.",
    source: "USHMM, s. f.-b; USHMM, s. f.-c",
  },
  {
    from: "depresion-29",
    to: "elites",
    axes: ["ascenso"],
    kind: "Giro autoritario",
    why: "La inestabilidad económica llevó a élites conservadoras y al entorno de Hindenburg a buscar una salida autoritaria integrando a Hitler en una coalición en enero de 1933.",
    source: "USHMM, s. f.-c",
  },
  {
    from: "depresion-29",
    to: "precursores-apaciguamiento",
    axes: ["camino-1939"],
    kind: "Expansión asiática",
    why: "La crisis de 1929 aceleró el giro militarista japonés para asegurar mercados y materias primas mediante la invasión de Manchuria en 1931.",
    source: "García Moreno, s. f.",
  },
  {
    from: "tesis-no-inevitable",
    to: "elites",
    axes: ["ascenso"],
    kind: "Criterio causal",
    why: "La historiografía subraya que las dictaduras no fueron automáticas por la crisis: dependieron de decisiones políticas concretas de reyes, presidentes y élites.",
    source: "Williamson, 2023; USHMM, s. f.-c",
  },
  {
    from: "tesis-no-inevitable",
    to: "violencia-propaganda",
    axes: ["ascenso"],
    kind: "Criterio causal",
    why: "La recesión por sí sola no basta: sin terror paramilitar contra opositores ni monopolio propagandístico, fascismo y nazismo no habrían consolidado el poder.",
    source: "Passmore, 2014; Gerwarth, 2020",
  },
  {
    from: "tesis-no-inevitable",
    to: "dos-dictaduras",
    axes: ["ascenso"],
    kind: "Síntesis comparada",
    why: "Explica por qué contextos de crisis parecidos produjeron regímenes distintos en ritmo, violencia racial y relación con las instituciones previas.",
    source: "Passmore, 2014; USHMM, s. f.-d",
  },
  {
    from: "elites",
    to: "marcha-roma",
    axes: ["ascenso"],
    kind: "Cesión del poder",
    why: "Ante la Marcha sobre Roma (octubre de 1922), el rey Víctor Manuel III evitó frenar a los escuadristas y nombró a Mussolini jefe de gobierno.",
    source: "Gerwarth, 2020; Williamson, 2023",
  },
  {
    from: "elites",
    to: "ley-habilitante",
    axes: ["ascenso"],
    kind: "Nombramiento oficial",
    why: "El 30 de enero de 1933, Hindenburg y sus aliados conservadores designaron canciller a Hitler creyendo poder controlarlo dentro de una coalición.",
    source: "USHMM, s. f.-c",
  },
  {
    from: "fascismo",
    to: "marcha-roma",
    axes: ["ascenso"],
    kind: "Demostración armada",
    why: "Mussolini articuló la presión de los escuadristas sobre la capital para exigir legalmente la jefatura del gobierno italiano en 1922.",
    source: "Gerwarth, 2020; Williamson, 2023",
  },
  {
    from: "fascismo",
    to: "violencia-propaganda",
    axes: ["ascenso"],
    kind: "Represión política",
    why: "El fascismo utilizó ataques de escuadristas contra sindicatos y opositores junto con censura progresiva para eliminar la competencia democrática.",
    source: "Gerwarth, 2020; USHMM, s. f.-d",
  },
  {
    from: "fascismo",
    to: "leyes-raciales",
    axes: ["ascenso", "camino-1939"],
    kind: "Giro antisemita (1938)",
    why: "Aunque el antisemitismo no tuvo la misma centralidad inicial que en Alemania, en 1938 el régimen fascista aprobó leyes antisemitas que excluyeron a los judíos.",
    source: "USHMM, s. f.-d",
  },
  {
    from: "fascismo",
    to: "estallido-blitzkrieg",
    axes: ["camino-1939", "guerra-orden"],
    kind: "Militarismo y entrada en 1940",
    why: "La exaltación imperial y militarista llevó a la alianza con Alemania y a la entrada formal de Italia en la Segunda Guerra Mundial en 1940.",
    source: "USHMM, s. f.-d",
  },
  {
    from: "nazismo",
    to: "violencia-propaganda",
    axes: ["ascenso"],
    kind: "Terror SA/SS y antisemitismo",
    why: "Las fuerzas paramilitares (SA y SS) intimidaron a rivales políticos mientras la propaganda difundía el odio antisemita como eje ideológico del partido.",
    source: "USHMM, s. f.-b; USHMM, s. f.-c",
  },
  {
    from: "nazismo",
    to: "ley-habilitante",
    axes: ["ascenso"],
    kind: "Toma del Estado",
    why: "Una vez en la Cancillería sin mayoría absoluta previa, el NSDAP aceleró la supresión de libertades para blindar el poder de Hitler.",
    source: "USHMM, s. f.-c; USHMM, s. f.-e",
  },
  {
    from: "nazismo",
    to: "leyes-raciales",
    axes: ["ascenso", "guerra-orden"],
    kind: "Ideología hecha ley",
    why: "El racismo biológico central en el programa nazi se institucionalizó en las Leyes de Núremberg de 1935 y escaló en 1938.",
    source: "USHMM, s. f.-f",
  },
  {
    from: "nazismo",
    to: "lebensraum-rassenkrieg",
    axes: ["camino-1939", "guerra-orden"],
    kind: "Proyecto de conquista",
    why: "El objetivo estratégico del régimen era expandirse hacia Europa Oriental para someter a los pueblos eslavos y controlar los recursos soviéticos.",
    source: "Beevor, 2012; García Moreno, s. f.",
  },
  {
    from: "marcha-roma",
    to: "dos-dictaduras",
    axes: ["ascenso"],
    kind: "Dictadura gradual",
    why: "Tras 1922 Mussolini consolidó gradualmente una dictadura mediante censura y reformas, manteniendo formalmente la corona italiana.",
    source: "USHMM, s. f.-d; Williamson, 2023",
  },
  {
    from: "violencia-propaganda",
    to: "ley-habilitante",
    axes: ["ascenso"],
    kind: "Coacción parlamentaria",
    why: "La intimidación callejera, la persecución política y la suspensión de garantías allanaron la votación de la Ley Habilitante en marzo de 1933.",
    source: "USHMM, s. f.-c; USHMM, s. f.-e",
  },
  {
    from: "violencia-propaganda",
    to: "dos-dictaduras",
    axes: ["ascenso"],
    kind: "Control social",
    why: "Censura, policía política y violencia organizada erradicaron la oposición y la pluralidad de partidos en ambos regímenes.",
    source: "USHMM, s. f.-d; USHMM, s. f.-e",
  },
  {
    from: "violencia-propaganda",
    to: "leyes-raciales",
    axes: ["ascenso", "guerra-orden"],
    kind: "Persecución pública",
    why: "La propaganda antisemita normalizó la exclusión y desembocó en violencia callejera abierta como la Noche de los Cristales Rotos (1938).",
    source: "USHMM, s. f.-f; Beevor, 2012",
  },
  {
    from: "ley-habilitante",
    to: "dos-dictaduras",
    axes: ["ascenso"],
    kind: "Fin de Weimar",
    why: "Al permitir gobernar por decreto sin el Parlamento, la Ley Habilitante (marzo de 1933) destruyó rápidamente la democracia de Weimar.",
    source: "USHMM, s. f.-e",
  },
  {
    from: "ley-habilitante",
    to: "leyes-raciales",
    axes: ["ascenso", "guerra-orden"],
    kind: "Poder absoluto legislativo",
    why: "Sin frenos parlamentarios ni judiciales, el régimen promulgó con rapidez decretos discriminatorios y las Leyes de Núremberg.",
    source: "USHMM, s. f.-e; USHMM, s. f.-f",
  },
  {
    from: "ley-habilitante",
    to: "precursores-apaciguamiento",
    axes: ["camino-1939"],
    kind: "Rearme sin oposición",
    why: "La concentración total de poder permitió impulsar el rearme y la política exterior agresiva que desembocó en el Anschluss y los Sudetes.",
    source: "USHMM, s. f.-e; García Moreno, s. f.",
  },

  // Eje 2: Camino a 1939 y Guerra de Bloques
  {
    from: "precursores-apaciguamiento",
    to: "potencias-urss",
    axes: ["camino-1939"],
    kind: "Concesiones de 1938",
    why: "Gran Bretaña y Francia toleraron la anexión de Austria (Anschluss) y los Sudetes buscando evitar una guerra, debilitando la disuasión colectiva.",
    source: "García Moreno, s. f.",
  },
  {
    from: "precursores-apaciguamiento",
    to: "estallido-blitzkrieg",
    axes: ["camino-1939"],
    kind: "Amalgama de guerras",
    why: "Manchuria (1931) y la Guerra Civil Española (1936, primer choque fascismo-comunismo) prefiguraron la guerra generalizada de 1939.",
    source: "Beevor, 2012; García Moreno, s. f.",
  },
  {
    from: "potencias-urss",
    to: "estallido-blitzkrieg",
    axes: ["camino-1939"],
    kind: "Pacto Ribbentrop-Molotov",
    why: "En agosto de 1939 el pacto de no agresión germano-soviético despejó el frente oriental para que Alemania invadiera Polonia el 1 de septiembre.",
    source: "García Moreno, s. f.",
  },
  {
    from: "potencias-urss",
    to: "viraje-global",
    axes: ["guerra-orden"],
    kind: "Entrada de URSS y EE. UU.",
    why: "En 1941, la agresión alemana a la URSS y el ataque japonés a Pearl Harbor unieron a la coalición aliada que definió el desenlace bélico.",
    source: "García Moreno, s. f.",
  },
  {
    from: "estallido-blitzkrieg",
    to: "viraje-global",
    axes: ["camino-1939", "guerra-orden"],
    kind: "Escalada de 1940 a 1941",
    why: "Tras rebasar la Línea Maginot y ocupar Francia en 1940 mientras Gran Bretaña resistía con el radar, Alemania giró hacia el este en junio de 1941.",
    source: "García Moreno, s. f.",
  },
  {
    from: "estallido-blitzkrieg",
    to: "guerra-total",
    axes: ["guerra-orden"],
    kind: "Guerra de materiales",
    why: "La Blitzkrieg y la guerra moderna convirtieron infraestructuras industriales, ciudades enteras y población civil en blancos militares directos.",
    source: "García Moreno, s. f.",
  },

  // Eje 3: Rassenkrieg, Holocausto, Devastación y Nuevo Orden
  {
    from: "leyes-raciales",
    to: "holocausto",
    axes: ["guerra-orden"],
    kind: "De exclusión a exterminio",
    why: "La privación legal de derechos (1935) y la violencia de 1938 escalaron durante la guerra hacia la persecución sistemática y el exterminio en la Shoah.",
    source: "USHMM, s. f.-f; USHMM, s. f.-g; Beevor, 2012",
  },
  {
    from: "lebensraum-rassenkrieg",
    to: "viraje-global",
    axes: ["guerra-orden"],
    kind: "Operación Barbarroja",
    why: "La búsqueda de «Espacio Vital» y recursos soviéticos motivó la invasión de la URSS en junio de 1941, abriendo el frente más letal de la guerra.",
    source: "Beevor, 2012; García Moreno, s. f.",
  },
  {
    from: "lebensraum-rassenkrieg",
    to: "holocausto",
    axes: ["guerra-orden"],
    kind: "Guerra racial en el Este",
    why: "El Rassenkrieg en Europa Oriental unió la conquista territorial con la aniquilación industrializada mediante gas en campos de exterminio.",
    source: "Beevor, 2012; USHMM, s. f.-g",
  },
  {
    from: "lebensraum-rassenkrieg",
    to: "guerra-total",
    axes: ["guerra-orden"],
    kind: "Brutalidad hacia civiles",
    why: "La guerra ideológica de aniquilación explica la magnitud extrema de víctimas civiles y la cifra de 20 millones de muertos en la URSS.",
    source: "Beevor, 2012; García Moreno, s. f.",
  },
  {
    from: "viraje-global",
    to: "holocausto",
    axes: ["guerra-orden"],
    kind: "Radicalización y liberación",
    why: "La expansión de 1941 puso bajo control nazi a millones de judíos del Este donde operaron los campos de exterminio, hasta la derrota alemana en 1945.",
    source: "USHMM, s. f.-g; Beevor, 2012",
  },
  {
    from: "viraje-global",
    to: "guerra-total",
    axes: ["guerra-orden"],
    kind: "Frentes globales (1941–1945)",
    why: "Las campañas de Stalingrado, Normandía, Berlín, Iwo Jima y las bombas atómicas concentraron el mayor saldo destructivo de la historia humana.",
    source: "García Moreno, s. f.",
  },
  {
    from: "viraje-global",
    to: "nuevo-orden",
    axes: ["guerra-orden"],
    kind: "Colapso del Eje y era atómica",
    why: "La toma soviética de Berlín, la capitulación alemana (mayo 1945) y Hiroshima y Nagasaki (agosto 1945) inauguraron el mundo bipolar y nuclear.",
    source: "García Moreno, s. f.",
  },
  {
    from: "dos-dictaduras",
    to: "nuevo-orden",
    axes: ["guerra-orden"],
    kind: "Ruina del orden fascista",
    why: "El derrumbe militar de ambos regímenes en 1945 dio paso a la ocupación aliada de Alemania en cuatro zonas y a la reconstrucción institucional europea.",
    source: "García Moreno, s. f.; USHMM, s. f.-d",
  },
  {
    from: "guerra-total",
    to: "nuevo-orden",
    axes: ["guerra-orden"],
    kind: "Debilitamiento imperial",
    why: "Con Europa industrialmente reducida al 50 % y Gran Bretaña, Francia y Holanda agotadas, se aceleraron los procesos de descolonización en África y Asia.",
    source: "García Moreno, s. f.",
  },
  {
    from: "potencias-urss",
    to: "nuevo-orden",
    axes: ["guerra-orden"],
    kind: "Bipolaridad Guerra Fría",
    why: "La victoria conjunta de EE. UU. y la URSS dejó al mundo dividido bajo dos superpotencias nucleares y a Europa Oriental bajo órbita soviética.",
    source: "García Moreno, s. f.",
  },
  {
    from: "estallido-blitzkrieg",
    to: "dos-dictaduras",
    axes: ["ascenso", "guerra-orden"],
    kind: "Radicalización bélica",
    why: "La entrada en guerra cerró cualquier resto de pluralismo interno y subordinó economía, prensa y sociedad al esfuerzo militar totalitario.",
    source: "USHMM, s. f.-d; García Moreno, s. f.",
  },
];

function initHistoricalNetwork() {
  const board = document.getElementById("network-board");
  const svg = document.getElementById("network-svg");
  const resetBtn = document.getElementById("network-reset-btn");

  const detailPanel = document.getElementById("network-detail");
  const detailCategory = document.getElementById("detail-category");
  const detailTitle = document.getElementById("detail-title");
  const detailSource = document.getElementById("detail-source");
  const detailText = document.getElementById("detail-text");

  const edgeCard = document.getElementById("detail-edge-card");
  const edgeKind = document.getElementById("detail-edge-kind");
  const edgeRoute = document.getElementById("detail-edge-route");
  const edgeWhy = document.getElementById("detail-edge-why");
  const edgeSource = document.getElementById("detail-edge-source");
  const edgeJumpBtn = document.getElementById("detail-edge-jump");

  if (!board || !svg) return;

  const nodeButtons = [...board.querySelectorAll(".net-node")];
  const nodeMap = Object.fromEntries(
    nodeButtons.map((btn) => [btn.dataset.node, btn]),
  );

  let activeNodeId = null;
  let activeEdgeIndex = null;
  let jumpTargetId = null;

function computeEdgePath(r1, r2, boardRect, sameColIndex) {
  const horizontalGap = r2.left - r1.right;
  const sameColumn = Math.abs(r1.left - r2.left) < 12;

    if (sameColumn) {
      // Arco lateral derecho para enlaces dentro de la misma columna
      const sideX = Math.max(r1.right, r2.right) - boardRect.left;
      const y1 = r1.top + r1.height / 2 - boardRect.top;
      const y2 = r2.top + r2.height / 2 - boardRect.top;
      const bulge = 18 + (sameColIndex % 3) * 10;
      return `M ${sideX} ${y1} C ${sideX + bulge} ${y1}, ${sideX + bulge} ${y2}, ${sideX} ${y2}`;
    }

    if (horizontalGap > 8) {
      // Entre columnas de izquierda a derecha: curva Bézier suave
      const x1 = r1.right - boardRect.left;
      const y1 = r1.top + r1.height / 2 - boardRect.top;
      const x2 = r2.left - boardRect.left;
      const y2 = r2.top + r2.height / 2 - boardRect.top;
      const cx = (x1 + x2) / 2;
      return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
    }

    if (r1.left - r2.right > 8) {
      // Enlace de derecha a izquierda (en tableros 2x2)
      const x1 = r1.left - boardRect.left;
      const y1 = r1.top + r1.height / 2 - boardRect.top;
      const x2 = r2.right - boardRect.left;
      const y2 = r2.top + r2.height / 2 - boardRect.top;
      const cx = (x1 + x2) / 2;
      return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
    }

    // Pantallas estrechas (1 sola columna apilada): línea directa vertical
    const x1 = r1.left + r1.width / 2 - boardRect.left;
    const y1 = r1.top + r1.height / 2 - boardRect.top;
    const x2 = r2.left + r2.width / 2 - boardRect.left;
    const y2 = r2.top + r2.height / 2 - boardRect.top;
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  function drawEdges() {
    const boardRect = board.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${boardRect.width} ${boardRect.height}`);
    svg.innerHTML = "";

    let sameColCounter = 0;

    NETWORK_EDGES.forEach((edge, index) => {
      const fromEl = nodeMap[edge.from];
      const toEl = nodeMap[edge.to];
      if (!fromEl || !toEl) return;

      const r1 = fromEl.getBoundingClientRect();
      const r2 = toEl.getBoundingClientRect();
      const isSameCol = Math.abs(r1.left - r2.left) < 12;
      const d = computeEdgePath(r1, r2, boardRect, isSameCol ? sameColCounter++ : 0);

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      path.classList.add("net-edge");
      path.dataset.index = String(index);
      path.dataset.from = edge.from;
      path.dataset.to = edge.to;

      path.addEventListener("click", (event) => {
        event.stopPropagation();
        inspectEdge(index);
      });

      svg.appendChild(path);
    });

    updateHighlights();
  }

  function updateHighlights() {
    const paths = [...svg.querySelectorAll(".net-edge")];
    const focusedEdge = activeEdgeIndex !== null ? NETWORK_EDGES[activeEdgeIndex] : null;
    const connectedIds = new Set();

    if (focusedEdge) {
      connectedIds.add(focusedEdge.from);
      connectedIds.add(focusedEdge.to);
    } else if (activeNodeId) {
      connectedIds.add(activeNodeId);
      NETWORK_EDGES.forEach((edge) => {
        if (edge.from === activeNodeId) connectedIds.add(edge.to);
        if (edge.to === activeNodeId) connectedIds.add(edge.from);
      });
    }

    const hasSelection = Boolean(activeNodeId) || Boolean(focusedEdge);
    if (resetBtn) resetBtn.hidden = !hasSelection;

    nodeButtons.forEach((btn) => {
      const id = btn.dataset.node;
      const isSelected = id === activeNodeId;
      const isFocusEnd = focusedEdge && (id === focusedEdge.from || id === focusedEdge.to);
      const isConnected =
        (!focusedEdge && Boolean(activeNodeId) && !isSelected && connectedIds.has(id)) ||
        (Boolean(focusedEdge) && isFocusEnd && !isSelected);

      btn.classList.toggle("is-selected", isSelected);
      btn.classList.toggle("is-connected", isConnected);
      btn.classList.toggle("is-dimmed", hasSelection && !connectedIds.has(id));
    });

    paths.forEach((path) => {
      const index = Number(path.dataset.index);
      const edge = NETWORK_EDGES[index];

      const isFocused = index === activeEdgeIndex;
      const isOutgoing = !focusedEdge && Boolean(activeNodeId) && edge.from === activeNodeId;
      const isIncoming = !focusedEdge && Boolean(activeNodeId) && edge.to === activeNodeId;
      const isDimmed = hasSelection && !isFocused && !isOutgoing && !isIncoming;

      path.classList.toggle("is-focused", isFocused);
      path.classList.toggle("is-outgoing", isOutgoing);
      path.classList.toggle("is-incoming", isIncoming);
      path.classList.toggle("is-dimmed", isDimmed);

      // Mueve las líneas activas al final del SVG para dibujarlas encima de las atenuadas
      if (isFocused || isOutgoing || isIncoming) {
        svg.appendChild(path);
      }
    });
  }

  function renderEdgeCard(edgeIndex, anchorId) {
    if (edgeIndex === null || !NETWORK_EDGES[edgeIndex]) {
      edgeCard.hidden = true;
      return;
    }

    const edge = NETWORK_EDGES[edgeIndex];
    const fromTitle = NETWORK_DATA[edge.from].title;
    const toTitle = NETWORK_DATA[edge.to].title;
    jumpTargetId = anchorId === edge.from ? edge.to : edge.from;

    edgeKind.textContent = edge.kind;
    edgeRoute.textContent = `${fromTitle} → ${toTitle}`;
    edgeWhy.textContent = edge.why;
    edgeSource.textContent = `Sustento: ${edge.source}`;
    edgeJumpBtn.textContent = `Explorar «${NETWORK_DATA[jumpTargetId].title}» →`;
    edgeCard.hidden = false;
  }

  function renderDetails(nodeId) {
    if (!nodeId || !NETWORK_DATA[nodeId]) {
      detailPanel.hidden = true;
      edgeCard.hidden = true;
      return;
    }

    const info = NETWORK_DATA[nodeId];
    detailCategory.textContent = info.category;
    detailTitle.textContent = info.title;
    detailSource.textContent = `Fuentes: ${info.sources}`;
    detailText.textContent = info.text;

    renderEdgeCard(activeEdgeIndex, nodeId);
    detailPanel.hidden = false;
  }

  function selectNode(nodeId) {
    activeEdgeIndex = null;
    activeNodeId = activeNodeId === nodeId ? null : nodeId;
    updateHighlights();
    renderDetails(activeNodeId);
  }

  function inspectEdge(edgeIndex) {
    const edge = NETWORK_EDGES[edgeIndex];
    if (!edge) return;

    activeNodeId = edge.from;
    activeEdgeIndex = edgeIndex;
    updateHighlights();
    renderDetails(edge.from);
  }

  nodeButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectNode(btn.dataset.node));
  });

  edgeJumpBtn?.addEventListener("click", () => {
    if (jumpTargetId) {
      activeNodeId = jumpTargetId;
      activeEdgeIndex = null;
      updateHighlights();
      renderDetails(jumpTargetId);
    }
  });

  resetBtn?.addEventListener("click", () => {
    activeNodeId = null;
    activeEdgeIndex = null;
    updateHighlights();
    renderDetails(null);
  });

  // Dibuja las líneas al cargar fuentes y al redimensionar la ventana
  drawEdges();
  document.fonts?.ready.then(drawEdges);

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(drawEdges);
    observer.observe(board);
  } else {
    window.addEventListener("resize", drawEdges);
  }
}

initHistoricalNetwork();
initCreditsModal();
initIntro();
initScrollytelling();
initCinemaBooth();
