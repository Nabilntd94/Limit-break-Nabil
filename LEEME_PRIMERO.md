# LIMIT BREAK 4.2 — ZIP COMPLETO

Esta versión contiene todos los archivos de LIMIT BREAK 4.2 para GitHub Pages, **excepto** la configuración de publicación `.github/workflows/static.yml`, que debes conservar si ya existe.

## Mejoras respecto a 4.1
- 32 fotografías de referencia generadas para el proyecto, sin utilizar imágenes oficiales de Fitness Park.
- 34 de los 63 ejercicios tienen una referencia de su movimiento asignada; los restantes muestran claramente «Imagen específica pendiente» sin mostrar fotografías de otros ejercicios.
- Se conservan las tres ilustraciones anime existentes en Hoy, Entrenos y Progreso (`assets/home.webp`, `assets/training.webp`, `assets/progress.webp`).
- Etiqueta de versión 4.2 y caché offline actualizada.
- Mantiene el generador, la edición, nutrición y progreso de 4.1.

## Cómo sustituir archivos SIN borrar repositorio
1. **Conserva** `.github/workflows/static.yml` y el repositorio actual.
2. En Code > Add file > Upload files, sube **el contenido** de esta carpeta, no su carpeta padre, manteniendo la estructura `assets/`, `exercises/`, `icons/`.
3. Sobrescribe los archivos existentes si GitHub te permite hacerlo. Si GitHub bloquea la sobrescritura, evita crear copias renombradas y solicita instrucciones para sustituir los archivos de forma segura.
4. En `exercises/` los 16 nuevos ficheros se añaden a los 16 anteriores; no borres la carpeta antes de subirla.
5. Comprueba que Actions muestra despliegue verde y que la app indica V4.2.
6. El `README.md` antiguo es opcional; no interfiere con la aplicación. No subas a GitHub tus fotos personales ni registros exportados.

**Atención:** las fotos se han generado con IA y son referencias de aspecto del ejercicio, no instrucciones biomecánicas validadas. Consulta a un entrenador para aprender técnica y confirmar la máquina concreta en tu gimnasio.

Los datos se guardan en localStorage bajo la misma clave de la versión 4.0; normalmente se conservan si actualizas en la misma URL y navegador. Se recomienda exportar tus datos antes de actualizar.
