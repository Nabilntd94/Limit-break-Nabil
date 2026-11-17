# LIMIT BREAK 3.0 · actualización sin borrar GitHub

Aplicación web instalable para iPhone. Basada en la versión 2.0; conserva las claves de datos locales anteriores (`forma_personal_v1`, `limitbreak_engine_v2` y `forma_photos_v1`). La actualización del código normalmente no elimina esos datos, pero exporta una copia si ya los has utilizado. Los datos no se sincronizan entre Safari del Mac y el iPhone.

## Cambios v3

- Entrenos: elección de Full Body, PPL, Upper/Lower, Weider, fuerza, funcional, híbrida o recomendación. Objetivo y días de gimnasio; músculos por sesión especialmente en recomendación y Weider.
- Propuesta editable: añadir, cambiar o quitar máquinas; modificar series, repeticiones y pesos; la opción «Otra propuesta» cambia el ejercicio de referencia de forma determinista.
- Al registrar: cumplimiento completo/parcial/adaptado, duración, cardio adicional, historial y estimación de gasto mediante MET. El cálculo es muy aproximado y no ajusta automáticamente las calorías objetivo.
- Fútbol y otras actividades: registro independiente, con el sábado como preferencia informativa.
- Comidas: biblioteca local de más de 50 alimentos con macros orientativos por 100g; crear platos por ingredientes y gramos; editar el plato y recalcular macros; editar manualmente registros anteriores; seguimiento flexible del menú.
- Fitness Park: campo para indicar centro y máquinas, biblioteca de ejercicios propia y enlace a la aplicación oficial; NO incluye sincronización, QR, programas exclusivos ni imágenes propietarias de Fitness Park.
- Imagen anime deportiva original, no personajes ni imágenes oficiales de Dragon Ball. Modo oscuro y los seis colores anteriores.

## Cómo actualizar tu repositorio actual

**NO borres el repositorio.** URL del repositorio: `https://github.com/Nabilntd94/Limit-break-Nabil`.

1. Descomprime `LIMIT_BREAK_v3.zip` en tu Mac.
2. Entra dentro de `limit-break-v3` (no subas la carpeta completa).
3. GitHub -> repositorio `Limit-break-Nabil` -> Code -> Add file -> Upload files.
4. Arrastra **todos los archivos y carpetas contenidos** dentro de `limit-break-v3` a la zona de subida. Los nombres existentes se reemplazarán, y los nuevos (`upgrade.js`, `upgrade.css`, `anime-training.webp`) se añadirán.
5. Comprueba que `index.html`, `app.js`, `engine.js`, `upgrade.js`, `upgrade.css` y `anime-training.webp` queden en la raíz, y `icons/` dentro de la raíz.
6. Pulsa `Commit changes` y selecciona `Commit directly to the main branch`.
7. En Actions, comprueba que el workflow `Deploy static content to Pages` termina en verde. No modifiques ni borres `.github/workflows/static.yml`.
8. Visita `https://nabilntd94.github.io/Limit-break-Nabil/` y recarga. Si una versión anterior sigue apareciendo, cierra/reabre y en Safari borra solo la caché del sitio si ya has exportado los datos; mejor evitar borrar almacenamiento personal.

## Avisos

Los macros y las estimaciones de calorías de las actividades son orientativos y dependen de la preparación, marcas y esfuerzo. No son prescripciones ni mediciones clínicas. Para alergias, comprueba ingredientes y etiquetas reales. La app no deduce el gasto deportivo de tus objetivos de comida y no debe utilizar estimaciones aisladas para fijar pérdidas semanales de peso. Copias de seguridad y fotos permanecen locales. La aplicación está pensada para adultos.

## Verificación

Revisa en Safari del Mac y iPhone: cambiar tipo de rutina, guardar y generar, «Otra propuesta», sustituir ejercicio, añadir cardio y guardar sesión; crear comida por ingredientes, modificar gramos, guardar, volver a editar y confirmar que el total cambia; registrar fútbol; exportar copia JSON. El código ha superado comprobación sintáctica pero necesita prueba manual en Safari de iOS.


## LIMIT BREAK 3.1 · Power-Up Mode
- estética anime gym original
- Entrenos editables con tipo de rutina, músculos por día, objetivo y cardio
- `Otra propuesta` reforzada para que cambie de verdad cuando haya variantes
- Comidas editables por ingredientes con recálculo automático de macros
- seguimiento de cumplimiento de entrenamiento y comida
- bloque `Modo Fitness Park` para anotar club y máquinas disponibles

## Dragon Power-Up visual (3.1.1)
- Cabecera ilustrada con Goku, Vegeta, Vegito y Gogeta, a petición del usuario, para uso personal. La ilustración no es oficial ni está afiliada a Dragon Ball ni a sus titulares de derechos. Si distribuyes públicamente la app, revisa los permisos de propiedad intelectual.
- Se utiliza `dragon-hero.webp` en la cabecera del entrenamiento. No cambian los registros, macros ni la lógica de rutinas.
- Para actualizar: desde el repositorio actual, **Add file → Upload files**, y subir el contenido de esta carpeta a la raíz. No borrar `.github/workflows/static.yml`. Confirmar en Actions el despliegue verde. Si el navegador sigue mostrando la versión anterior, recargar la página.
