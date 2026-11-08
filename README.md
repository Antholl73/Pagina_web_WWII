# Pagina_web_WWII

Página web interactiva (*scrollytelling*) que cuenta la historia de la Segunda Guerra Mundial, centrada en el ascenso del nazismo en Alemania y del fascismo en Italia. Tiene el estilo de un periódico de los años 30: papel envejecido, tinta de imprenta y titulares de prensa.

Al hacer scroll:

- Las tarjetas de texto avanzan por los años clave (1919, 1922, 1929, 1933, 1939) y el año gigante del fondo se actualiza.
- En la sección final, el scroll controla los fotogramas de un vídeo (*video scrubbing*).

---

## 1. Requisitos

Necesitas tener instalado:

| Programa | Versión | Para qué sirve | Cómo comprobarlo |
|---|---|---|---|
| [Node.js](https://nodejs.org/) | **20.19 o superior** (o 22.12+) | Ejecuta el servidor de desarrollo | `node -v` |
| npm | Viene incluido con Node.js | Instala las dependencias | `npm -v` |
| [Git](https://git-scm.com/) | Cualquiera reciente | Descarga el proyecto | `git --version` |

> Si `node -v` muestra una versión más antigua (por ejemplo `v18.x`), instala la versión LTS desde [nodejs.org](https://nodejs.org/). Vite 8 no funciona con Node 18.

También necesitas **conexión a internet** la primera vez, para instalar las dependencias. Las tipografías (Oswald y Newsreader) se cargan siempre desde Google Fonts.

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
│   ├── style.css       → Estilos: paleta de periódico, textura de papel, tarjetas, vídeo
│   └── main.js         → Lógica: Scrollama (tarjetas y años) y video scrubbing
├── public/
│   └── videos/         → Vídeos; se sirven tal cual en /videos/...
├── package.json        → Dependencias y comandos (dev, build, preview)
└── dist/               → Versión final generada por "npm run build" (no se sube a git)
```

---

## 7. Cambiar el vídeo del scroll (opcional)

Para que el vídeo avance con fluidez al hacer scroll, **cada fotograma debe ser un keyframe**. Un vídeo normal descargado de internet irá a tirones.

1. Instala [FFmpeg](https://ffmpeg.org/download.html).
2. Convierte tu vídeo:

   ```bash
   ffmpeg -i mi_video.mp4 -an -vf "scale=1280:-2,fps=30" -c:v libx264 -preset slow -crf 26 -g 1 -pix_fmt yuv420p -movflags +faststart public/videos/mi_video_scrub.mp4
   ```

   - `-g 1` → un keyframe en cada fotograma (lo más importante).
   - `scale=1280:-2,fps=30` → 720p a 30 fps, para que el archivo pese poco.
   - `-an` → quita el audio (no se usa).

3. En `index.html`, cambia el `src` del `<video id="scrub-video">` por `/videos/mi_video_scrub.mp4`.
4. Si usaste otros fps, cambia `VIDEO_FPS` en `src/main.js` al mismo valor.

---

## 8. Problemas frecuentes

| Problema | Solución |
|---|---|
| `npm: command not found` o `node: command not found` | Node.js no está instalado o la terminal no lo encuentra. Instálalo y abre una terminal nueva. |
| Error al ejecutar `npm run dev` mencionando la versión de Node | Actualiza Node.js a 20.19+ o 22.12+ (sección 1). |
| `Port 5173 is in use` | Vite usará otro puerto automáticamente (5174, 5175…). Abre la dirección que indique la terminal. |
| `vite: not found` | Falta instalar las dependencias: ejecuta `npm install`. |
| El vídeo aparece en negro | Comprueba que el archivo existe en `public/videos/` y que el `src` en `index.html` empieza por `/videos/`. |
| Las letras se ven con una tipografía genérica | No hay conexión a internet: las fuentes vienen de Google Fonts. |
| Aparecen líneas horizontales en la página | Es el modo depuración de Scrollama. Cambia `debug: true` a `debug: false` en `src/main.js`. |

---

## Licencia

Este proyecto se distribuye bajo la licencia incluida en el archivo [LICENSE](LICENSE).
