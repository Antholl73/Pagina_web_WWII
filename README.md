# Pagina_web_WWII

Página web interactiva (*scrollytelling*) que cuenta la historia de la Segunda Guerra Mundial, centrada en el ascenso del nazismo en Alemania y del fascismo en Italia. Tiene el estilo de un periódico de los años 30: papel envejecido, tinta de imprenta y titulares de prensa.

El recorrido de la página:

1. **Introducción**: un telón con fotos de época y un botón *Comenzar* que reproduce el vídeo cinematográfico de introducción.
2. **Portada y contexto histórico**: las tarjetas avanzan por los años clave (1919, 1922, 1929, 1933, 1939) y una línea del tiempo a la derecha muestra el año de cada suceso.
3. **Sección II · Biblioteca de Simon**: un estante con siete capítulos. Los libros se abren y Simon, el gato condecorado con la Medalla Dickin, los narra página a página con mapa y preguntas; algunos capítulos son vídeos.
4. **Sección III · Red de relaciones**: un mapa causal interactivo entre causas, actores, acontecimientos y consecuencias.

---

## 1. Requisitos

Necesitas tener instalado:

| Programa | Versión | Para qué sirve | Cómo comprobarlo |
|---|---|---|---|
| [Node.js](https://nodejs.org/) | **20.19 o superior** (o 22.12+) | Ejecuta el servidor de desarrollo | `node -v` |
| npm | Viene incluido con Node.js | Instala las dependencias | `npm -v` |
| [Git](https://git-scm.com/) | Cualquiera reciente | Descarga el proyecto | `git --version` |

> Si `node -v` muestra una versión más antigua (por ejemplo `v18.x`), instala la versión LTS desde [nodejs.org](https://nodejs.org/). Vite 8 no funciona con Node 18.

También necesitas **conexión a internet** la primera vez, para instalar las dependencias. Las tipografías se cargan siempre desde Google Fonts, y el mapa de la biblioteca (Leaflet) necesita internet para mostrar las teselas.

---

## 2. Descargar el proyecto

Abre una terminal y ejecuta:

```bash
git clone https://github.com/Antholl73/Pagina_web_WWII.git
```

```bash
cd Pagina_web_WWII
```

> ¿No usas Git? En la página de GitHub pulsa **Code → Download ZIP**, descomprímelo y abre una terminal dentro de la carpeta.

---

## 3. Instalar las dependencias

```bash
npm install
```

Esto crea la carpeta `node_modules/` con:

- **[Vite](https://vite.dev/)**: el servidor de desarrollo (recarga la página automáticamente al guardar cambios).
- **[Scrollama](https://github.com/russellsamora/scrollama)**: detecta qué tarjeta está en el centro de la pantalla.

Solo hace falta hacerlo una vez, o de nuevo si cambia `package.json`.

---

## 4. Lanzar la página

```bash
npm run dev
```

La terminal mostrará algo como:

```
  VITE v8.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
```

Abre **http://localhost:5173/** en el navegador. Mientras la terminal siga abierta, cada cambio que guardes en `index.html`, `src/style.css` o `src/main.js` se verá al instante.

Para **detener** el servidor, vuelve a la terminal y pulsa `Ctrl + C`.

---

## 5. Generar la versión final (opcional)

Para publicar la página en un hosting (GitHub Pages, Netlify, Vercel…):

```bash
npm run build
```

Se crea la carpeta `dist/` con los archivos listos para subir. Para comprobar esa versión en local antes de publicarla:

```bash
npm run preview
```

Y abre la dirección que indique la terminal (por defecto **http://localhost:4173/**).

> No abras `index.html` con doble clic: el navegador lo carga como `file://` y ni el JavaScript (módulos ES) ni el vídeo funcionan bien. Usa siempre `npm run dev` o `npm run preview`.

---

## 6. Estructura del proyecto

```
Pagina_web_WWII/
├── index.html          → Contenido de la página y filtro SVG de tinta (#ink-rough)
├── src/
│   ├── style.css       → Estilos: telón, periódico, tarjetas, biblioteca, red y créditos
│   ├── intro.js        → Telón de introducción y vídeo cinematográfico
│   └── main.js         → Scrollama (tarjetas y años), biblioteca, red de relaciones y créditos
├── public/
│   ├── images/         → Fotografías de prensa de las tarjetas
│   └── biblioteca/     → Sección II: página aparte que se muestra con un iframe
│       ├── index.html, app.js, estilos.css, config.js
│       ├── assets/     → Simon, música, fotos del telón y vídeo de introducción (intro.mp4)
│       └── capitulos/  → Un capítulo por carpeta: capitulo.js + audios e imágenes
├── package.json        → Dependencias y comandos (dev, build, preview)
└── dist/               → Versión final generada por "npm run build" (no se sube a git)
```

---

## 7. Editar la biblioteca de Simon (opcional)

La Sección II es una página independiente en `public/biblioteca/`. Se puede abrir sola en **http://localhost:5173/biblioteca/** para probarla sin recorrer toda la web.

- **Textos, audios y mapas de un capítulo**: `public/biblioteca/capitulos/<número>/capitulo.js`.
- **Añadir un capítulo**: crea su carpeta con `capitulo.js` y añade su `<script>` en `public/biblioteca/index.html`.
- **Música y presentación de Simon**: `public/biblioteca/config.js`.
- **Vídeo de introducción**: `public/biblioteca/assets/intro.mp4` (lo usa el telón; la ruta está en `src/intro.js`).

---

## 8. Problemas frecuentes

| Problema | Solución |
|---|---|
| `npm: command not found` o `node: command not found` | Node.js no está instalado o la terminal no lo encuentra. Instálalo y abre una terminal nueva. |
| Error al ejecutar `npm run dev` mencionando la versión de Node | Actualiza Node.js a 20.19+ o 22.12+ (sección 1). |
| `Port 5173 is in use` | Vite usará otro puerto automáticamente (5174, 5175…). Abre la dirección que indique la terminal. |
| `vite: not found` | Falta instalar las dependencias: ejecuta `npm install`. |
| El vídeo de introducción no arranca | Pulsa **Saltar introducción**. Comprueba que existe `public/biblioteca/assets/intro.mp4`. |
| Simon no habla | El sonido necesita un clic dentro de la biblioteca: pulsa **Conocer a Simon** y revisa que la voz no esté silenciada (botón del altavoz). |
| Las letras se ven con una tipografía genérica | No hay conexión a internet: las fuentes vienen de Google Fonts. |
| Aparecen líneas horizontales en la página | Es el modo depuración de Scrollama. Cambia `debug: true` a `debug: false` en `src/main.js`. |

---

## Licencia

Este proyecto se distribuye bajo la licencia incluida en el archivo [LICENSE](LICENSE).
