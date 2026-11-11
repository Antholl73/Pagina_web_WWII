# Registro exacto de cambios

Fecha: 11 de noviembre de 2026

Las líneas indicadas corresponden al estado actual de los archivos. Si se modifica el contenido posteriormente, los números pueden desplazarse.

## `index.html`

| Líneas | Elemento modificado | Cambio realizado |
| --- | --- | --- |
| 20–28 | `#intro` | Se agregó la estructura HTML de la pantalla inicial: contenedor, ruido, líneas de exploración, marco, texto y señal de carga. |

## `src/main.js`

| Líneas | Función o bloque modificado | Cambio realizado |
| --- | --- | --- |
| 16 | `introEl` | Se agregó la referencia al contenedor de la introducción. |
| 18–28 | `initIntro()` | Nueva función que mantiene la introducción 1,8 segundos, activa su salida y elimina el nodo al finalizar. En movimiento reducido, reduce este tiempo. |
| 30–40 | `updateGraphic(year)` | Se añadió la clase temporal `is-changing` para animar el panel fijo cuando cambia el año. |
| 42–45 | `handleStepEnter()` | Cambia las clases con `toggle` para activar únicamente la tarjeta correspondiente. |
| 47–57 | `initScrollytelling()` | El punto de activación cambió a `0.52` y `debug` pasó a `false`, eliminando la guía visual de Scrollama. |
| 64 | `SMOOTHING` | La constante de suavizado del video se ajustó a `12`. |
| 71 | `isVideoVisible` | Se añadió el estado de visibilidad para controlar el ciclo de animación del video. |
| 80–91 | `updateVideoTarget()` | Nueva función que calcula el tiempo objetivo y el porcentaje del video solo al desplazarse o redimensionar. |
| 93–107 | `tick(now)` | El ciclo ahora interpola el tiempo hacia el objetivo y evita saltos de fotograma mientras el video está buscando. |
| 109–121 | `startLoop()` y `stopLoop()` | El ciclo se inicia solo si la sección está visible y se cancela cuando deja de estarlo. |
| 123–141 | `initVideoScrub()` | Se agregaron eventos de metadatos, desplazamiento pasivo y redimensionamiento; el observador usa un margen de 160 px. |
| 143–145 | Inicialización | Se incorporó la ejecución de `initIntro()` antes de inicializar los demás efectos. |

## `src/style.css`

| Líneas | Selector o animación modificada | Cambio realizado |
| --- | --- | --- |
| 57–152 | `.intro` y elementos hijos | Nuevos estilos de la pantalla de encendido: capa negra, grano, líneas de exploración, marco y señal de carga. |
| 154–214 | `@keyframes intro-*` | Nuevas animaciones de entrada del marco, parpadeo, ruido, señal y apertura final de la cinta. |
| 342–357 | `.arrow-down`, `@keyframes float-down` | El rebote anterior se sustituyó por un desplazamiento vertical continuo y más suave. |
| 392–405 | `.graphic__placeholder.is-changing`, `graphic-refresh` | Nueva transición breve para el año y la descripción del panel histórico. |
| 415 | `.graphic__year` | La transición genérica se reemplazó por transiciones específicas de color y opacidad. |
| 462–466 | `.step` | Se modificó la curva y duración de las transiciones de opacidad, desplazamiento, borde y sombra. |
| 476–513 | Hijos de `.step`, `step-content-in` | Se añadió la aparición escalonada del contenido de cada tarjeta activa. |
| 632–641 | `.video-scrub__media` | Se añadió `translateZ(0)` para favorecer una composición estable del video. |
| 658–672 | `.video-scrub__caption` | Se añadió `translateZ(0)` para estabilizar la capa de texto sobre el video. |
| 720–729 | `@media (prefers-reduced-motion: reduce)` | Nuevo tratamiento de accesibilidad que reduce animaciones y transiciones cuando el sistema lo solicita. |

## Verificación

- Se ejecutó `npm run build` correctamente tras cada conjunto de cambios.
