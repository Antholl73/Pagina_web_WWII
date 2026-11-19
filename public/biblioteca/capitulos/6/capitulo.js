registrarLibro(6, {
  title: 'Capítulo 6',
  name:  "La caída del Eje",
  intro: "La caída del Eje. De 1943 a 1945: el final de la guerra en Europa. Pulsa la flecha para abrir el libro.",
  end:   "Aquí termina La caída del Eje. Europa por fin estaba en paz, pero el mundo ya no sería el mismo.",
  introAudio: false,
  endAudio:   false,

  paginas: [
{"num":1,"title":"El giro de la marea","year":"1943","lines":[
  {"text":"A partir de 1943, la situación para las potencias del Eje se volvió insostenible.","audio":"1.mp3","t":[0.0,0.12,0.38,0.62,2.92,3.22,3.76,4.1,4.54,4.98,5.38,5.66,6.02,6.54],"start":0,"end":null},
  {"text":"En el norte de África fueron derrotados en Túnez, y los Aliados invadieron Sicilia.","audio":"2.mp3","t":[0.0,0.2,0.38,0.74,0.96,1.5,2.4,3.22,3.63,4.04,4.8,4.96,5.68,6.56],"start":0,"end":null},
  {"text":"Eso provocó la caída de Mussolini y la rendición de Italia.","audio":"3.mp3","t":[0.0,0.26,1.04,1.54,1.94,2.14,2.94,3.5,3.64,4.42,4.85],"start":0,"end":null}]},
{"num":2,"title":"El Día D","year":"1944","lines":[
  {"text":"El 6 de junio de 1944, los Aliados desembarcaron en las playas de Normandía.","audio":"4.mp3","t":[0.0,0.18,0.42,0.66,1.14,1.26,2.86,3.66,4.28,5.36,5.48,5.62,6.32,6.86],"start":0,"end":null},
  {"text":"Fue la operación anfibia más grande de la historia.","audio":"5.mp3","t":[0.0,0.14,0.26,1.02,2.08,2.26,2.68,2.88,3.02],"start":0,"end":null},
  {"text":"Alemania quedó obligada a luchar en dos frentes al mismo tiempo.","audio":"6.mp3","t":[0.0,0.6,1.04,1.54,1.64,2.08,2.46,2.82,3.6,3.76,3.98],"start":0,"end":null}]},
{"num":3,"title":"El avance soviético","year":"1944-1945","lines":[
  {"text":"En el este, el Ejército Rojo avanzó imparable hacia Berlín.","audio":"7.mp3","t":[0.0,0.2,0.38,1.34,1.56,2.2,2.72,3.4,4.14,4.56],"start":0,"end":null},
  {"text":"A inicios de 1945, las tropas soviéticas ya estaban a las puertas de la capital.","audio":"8.mp3","t":[0.0,0.12,0.56,0.78,3.16,3.58,4.14,4.96,5.26,5.67,6.08,6.22,6.74,6.96,7.29],"start":0,"end":null}]},
{"num":4,"title":"La caída del Eje","year":"1945","lines":[
  {"text":"Hitler se suicidó el 30 de abril de 1945 en su búnker subterráneo.","audio":"9.mp3","t":[0.0,0.38,0.66,1.36,1.54,1.94,2.16,2.98,3.24,4.66,5.97,6.62,6.95],"start":0,"end":null},
  {"text":"El 8 de mayo, Alemania firmó su rendición incondicional.","audio":"10.mp3","t":[0.0,0.16,0.42,0.66,1.38,1.9,2.38,2.5,3.14],"start":0,"end":null},
  {"text":"La guerra en Europa había terminado.","audio":"11.mp3","t":[0.0,0.26,0.58,0.82,1.34,1.96],"start":0,"end":null}]}
  ],

  lugares: {
    '1.1': [[52.52, 13.4, "Berlín"], [41.9, 12.5, "Roma"], [35.68, 139.69, "Tokio"]],
    '1.2': [[36.81, 10.18, "Túnez"], [37.6, 14.02, "Sicilia"]],
    '1.3': [[41.9, 12.5, "Roma: cae Mussolini", 6]],
    '2.1': [[49.37, -0.87, "Playas de Normandía", 7]],
    '2.2': [[49.37, -0.87, "Normandía: Día D", 7]],
    '2.3': [[49.37, -0.87, "Frente occidental"], [54.69, 25.28, "Frente oriental"]],
    '3.1': [[55.75, 37.62, "Moscú"], [52.23, 21.01, "Varsovia"], [52.52, 13.4, "Berlín"]],
    '3.2': [[52.52, 13.4, "Berlín", 6]],
    '4.1': [[52.51, 13.38, "Búnker de Hitler, Berlín", 7]],
    '4.2': [[52.48, 13.53, "Berlín-Karlshorst: rendición", 7]],
    '4.3': [[52.52, 13.4, "Berlín"], [48.86, 2.35, "París"], [51.51, -0.13, "Londres"]]
  },

  escenas: {},

  quiz: [
    { pregunta: "¿Qué ocurrió el 6 de junio de 1944?",
      opciones: ["El desembarco aliado en Normandía (Día D)", "El ataque a Pearl Harbor", "La rendición de Italia"], correcta: 0 },
    { pregunta: "¿Qué día firmó Alemania su rendición incondicional?",
      opciones: ["El 1 de septiembre de 1939", "El 8 de mayo de 1945", "El 7 de diciembre de 1941"], correcta: 1 }
  ]
});
