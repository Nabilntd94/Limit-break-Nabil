# LIMIT BREAK 4.0 · POWER-UP EDITION

Una aplicación web progresiva (PWA) para gimnasio, fútbol, nutrición y progreso.
No necesita cuenta, base de datos externa ni API de pago.

## Qué funciona en esta entrega

- Cinco secciones: Hoy, Entrenos, Nutrición, Progreso y Perfil.
- Planificador semanal que respeta los días elegidos, incluido el domingo; sábado reservado para fútbol de manera predeterminada.
- Splits Weider, PPL, Upper/Lower, Full Body, híbrido y automático.
- Biblioteca local de 63 ejercicios con nombre, grupo, modalidad y consejos orientativos.
- Series 4 × 8–10 por defecto, modificables por ejercicio; volumen de un grupo principal preferentemente 4–5 ejercicios y tríceps/bíceps 3 cuando el split lo permite. Las sesiones mixtas reducen volumen para evitar acumulaciones excesivas.
- Abrir/cerrar rutina; tarjetas individuales; editar nombre, músculo, modalidad, series, repeticiones y peso; añadir/eliminar ejercicios.
- Registrar gimnasio, fútbol, duración, notas y estado de cumplimiento.
- Alimentos con referencia aproximada por 100 g, editor de gramos, macros instantáneos, diario de comidas y propuestas de menú.
- Peso corporal, histórico, fotografías opcionales comprimidas y guardadas localmente.
- Cambiar acento visual, exportar/importar datos JSON. Intentar importar registros compatibles de la antigua aplicación si se abre en el mismo origen del navegador.
- Tres ilustraciones efectivamente enlazadas a Hoy, Entrenos y Progreso.
- PWA instalable; recursos cacheados para uso offline después de visitarla mediante HTTPS.

## Limitaciones honestas

- Los dibujos de cada ejercicio son **esquemas de material**, NO fotografías técnicas de ejecución. La próxima mejora será incorporar imágenes o demostraciones precisas con permisos de uso. Los dibujos no reemplazan una demostración profesional.
- Las máquinas sugeridas son habituales en gimnasios comerciales; el inventario concreto de tu Fitness Park no está verificado.
- Las metas, macros, ingesta y esfuerzo tienen carácter orientativo; no son consejo médico.
- Los datos se guardan en `localStorage`, en **ese navegador y ese dominio**. No se sincronizan automáticamente entre el iPhone y Mac, ni necesariamente entre dos repositorios GitHub diferentes.
- Los cambios del plan pueden sobrescribir una semana en curso; los entrenamientos registrados se mantienen.
- La app usa tres imágenes locales procedentes del proyecto anterior; no es una aplicación oficial ni está asociada con Dragon Ball o Fitness Park.

## Antes de publicar

**NO borres el repositorio actual ni la carpeta `.github/workflows/static.yml`.**

Una opción segura es crear un repositorio nuevo para probar LIMIT BREAK 4.0 y dejar intacta la versión anterior. Si prefieres actualizar el repositorio actual, sube el contenido de esta carpeta a su raíz (nunca la carpeta contenedora), mantén el workflow existente y verifica el despliegue en Actions. La versión anterior seguirá en el historial del repositorio, aunque no esté visible.

En GitHub Pages con el flujo `Static HTML` se debe publicar el directorio raíz del repositorio.

## Datos de versiones anteriores

1. Antes de tocar el sitio anterior, abre la app vieja y exporta los datos si existe la opción.
2. LIMIT BREAK 4.0 utiliza una clave de almacenamiento nueva: no sobrescribe automáticamente la versión antigua.
3. En **Perfil > Recuperar registros v3**, la app intenta copiar registros compatibles de la clave `forma_personal_v1` SOLO si están almacenados en el mismo navegador/origen web. Los datos antiguos pueden estar ausentes o tener otros formatos; comprueba las entradas importadas.
4. No subas tus copias JSON ni fotos privadas a un repositorio público.

## Desarrollo y pruebas

- HTML, CSS, JS: sin servicios externos.
- Pruebas automatizadas de lógica: varias combinaciones de splits y días; volumen por músculo; cálculo de macros y generación del HTML de tarjetas.
- Comprobaciones: sintaxis de JS y contenido del ZIP.
- La prueba de interfaz en navegador real quedó limitada por el bloqueo del navegador automatizado en el entorno de creación. **No se ha verificado todavía en Safari iPhone.**

## Seguridad

Solo utiliza imágenes locales y APIs del navegador. No pide credenciales, suscripciones ni cuenta de terceros.
