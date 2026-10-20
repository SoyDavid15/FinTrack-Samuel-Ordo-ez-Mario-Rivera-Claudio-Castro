# ADR-001: Diseño del almacenamiento del proyecto en Amazon S3- Fecha:20/10/2026 Autor:Samuel Ordoñez, Claudio Castro, Mario Rivera Estado: Aceptada
## Contexto
(Donde estaba el proyecto antes y que problema concreto hay que resolver.
 Minimo cinco lineas.)
El proyecto consiste en una aplicación web estática para gestionar ingresos y gastos, la cual inicialmente se alojó en un bucket público de S3. El problema principal era que la infraestructura no contaba con tolerancia a fallos ni protección contra borrados accidentales de archivos críticos (como el `index.html` o los estilos), lo que podía provocar la caída total del sitio sin forma de recuperarlo. Además, el equipo de desarrollo no tenía un entorno seguro y aislado para almacenar documentación interna, diseños y respaldos de código sin exponerlos al público de internet. Se necesitaba diseñar una arquitectura que garantizara durabilidad, recuperación rápida y separación estricta de entornos.

## Decisión
Se decidió implementar una estructura de almacenamiento basada en dos buckets separados:
1. **Bucket del sitio web (`cuc-bp-eq-01-ordonez-sitio-2026`)**: Configuramos este bucket con acceso público de lectura para alojar los archivos estáticos. **Se activó el versionado** para permitir la restauración de archivos eliminados. Para controlar los costos de estas versiones acumuladas, se configuró una regla de ciclo de vida que mueve las versiones no vigentes a la clase *Standard-IA* a los 30 días, a *Glacier Flexible Retrieval* a los 60 días, y las elimina permanentemente a los 90 días.
2. **Bucket privado (`cuc-bp-eq-01-ordonez-privado-2026`)**: Se bloqueó completamente el acceso público. Aquí se crearon los prefijos `diseno/`, `documentacion/`, `activos_graficos/` y `respaldos_codigo/` para organizar el material interno. El versionado se dejó apagado en este bucket para evitar sobrecostos por duplicidad de archivos pesados que ya están respaldados localmente.

## Alternativas consideradas
* **Usar un solo bucket para todo (archivos del sitio y recursos internos):** Se descartó esta opción porque requeriría políticas de bucket (Bucket Policies) extremadamente complejas para mantener los archivos web públicos mientras se bloqueaba el acceso a las carpetas de diseño y documentación. Un error en la configuración podría exponer fácilmente nuestros activos gráficos originales y documentos a cualquier visitante.
* **Activar el versionado sin implementar una regla de ciclo de vida:** Se descartó porque, aunque protegía contra caídas del sitio, permitía que las versiones antiguas se acumularan indefinidamente cada vez que se subiera una actualización del código. A largo plazo, esto generaría un crecimiento innecesario en los costos de almacenamiento.

## Consecuencias

### Positivas
* El sitio web es resiliente; cualquier borrado o modificación errónea puede revertirse en segundos retirando el "Delete marker".
* Los activos internos de desarrollo están completamente protegidos contra accesos públicos no autorizados gracias a la separación física en un bucket privado.
* El gasto de almacenamiento está optimizado y automatizado gracias a la regla de ciclo de vida.

### Costos o desventajas que aceptamos
* Guardar múltiples versiones de los archivos web, aunque optimizado, incurrirá en un ligero aumento en los costos de S3 frente a no tener versionado.
* Mantener dos buckets separados exige mayor atención operativa por parte del equipo al momento de subir archivos, para no mezclar recursos internos con los públicos.

### Qué habría que revisar más adelante
* Si el alcance del proyecto cambia en el futuro para incluir un backend real que permita a los usuarios subir sus propios recibos o generar historiales transaccionales en bases de datos, habrá que crear nuevos prefijos estructurados en el bucket privado e implementar políticas de acceso IAM específicas para esos datos confidenciales de terceros.