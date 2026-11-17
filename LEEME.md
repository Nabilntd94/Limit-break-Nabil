# LIMIT BREAK v2 · instalación y uso

## Qué incorpora

- Nombre e iconos LIMIT BREAK (LB), estilo oscuro y 6 colores de acento.
- Generador local de sesiones Full Body, Upper/Lower, PPL, Weider, Fuerza, Funcional e Híbrida. Biblioteca de 60+ ejercicios con filtros, equipamiento, indicaciones y alternativas. Ajusta el índice de sesión usando entrenamientos que se registran esa semana. El fútbol se considera actividad habitual el sábado.
- Generador local de menús con 38 platos de ejemplo, 4 comidas al día, estimaciones de macros y lista de compra; preferencias vegetariana, vegana, pescetariana u omnívora. Modifica las proporciones para acercarse al objetivo energético; **las cifras son orientativas, no una base certificada**.
- Conserva los registros de la v1 porque mantiene expresamente su clave de almacenamiento original `forma_personal_v1`; preferencias de la v2 guardadas en `limitbreak_engine_v2`. Foto y medidas siguen guardándose localmente.
- Sin servicios IA de pago. Sin servidor que reciba fotos ni datos personales.

## Cómo actualizar tu repositorio de GitHub sin borrarlo

**Antes de empezar:** si has apuntado algo en tu app v1, entra en Mi perfil > Exportar copia completa (JSON) y guárdala. Aunque se conserve el almacenamiento del navegador, es mejor tener una copia.

1. Descarga y descomprime `LIMIT_BREAK_v2.zip` en tu Mac.
2. Abre GitHub > tu repositorio `Limit-Brake` > pestaña Code.
3. Haz clic en `Add file` > `Upload files`.
4. En Finder, entra DENTRO de `limit-break-v2`; selecciona TODO SU CONTENIDO (archivos `index.html`, `app.js`, `engine.js`, `styles.css`, `sw.js`, `manifest.webmanifest`, `LEEME.md` y carpeta `icons`), no la carpeta contenedora.
5. Arrástralos al cuadro de subida. GitHub reconocerá archivos existentes y los reemplazará en el commit; también añadirá `engine.js`.
6. Abajo, pulsa `Commit changes` (a rama `main`). **No hace falta borrar el repositorio ni la configuración de Pages**.
7. En Settings > Pages, verifica `Deploy from a branch` / `main` / `/(root)`; no pongas nada en Custom domain.
8. Abre `https://nabilntd94.github.io/Limit-Brake/` en Safari; actualiza la página si sigue mostrando FORMA. Con la app ya instalada, cierra y vuelve a abrir para que el service worker reciba la versión nueva. Si persiste una versión anterior, intenta una recarga en Safari y revisa que el despliegue de GitHub Pages haya concluido.

**IMPORTANTE:** si el repositorio actual usa como nombre `limit-break` en lugar de `Limit-Brake`, la dirección respetará ese nombre; copia siempre la dirección mostrada por GitHub Pages.

## Por qué no hay una IA real

Las propuestas vienen de una biblioteca y de reglas locales y reproducibles. No se emplea modelo de lenguaje ni se interpretan fotos. Las fotos sirven para tu comparación visual privada, no para diagnóstico o estimación exacta de grasa corporal.

## Datos y seguridad

Los datos dependen del navegador/origen web y del almacenamiento local de cada dispositivo. No se sincronizan del Mac al iPhone automáticamente. No borres la app ni sus datos antes de guardar una copia JSON y comprobar la restauración. Las fotos se guardan en IndexedDB.

En el repositorio de GitHub sube solo código y recursos. Nunca subas tus fotos, registros o exportaciones JSON.

La base de alimentos contiene platos con estimaciones indicativas, que debes revisar según cantidades y marcas. No garantiza evitación de alérgenos o trazas. Las recomendaciones físicas y energéticas requieren adaptar dificultad, técnica y recuperación a tu situación.

## Próximos pasos posibles

Ampliar inventario de máquinas verificadas del Fitness Park concreto, mejorar reglas de planificación según descanso percibido y acumular una base nutricional más completa con datos abiertos de origen documentado y licencias compatibles.
