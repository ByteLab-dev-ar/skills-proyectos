---
name: spec
description: Escribe la spec de una función antes de programarla. Revisa el núcleo, el roadmap, las specs anteriores y los pendientes, pregunta lo que no está definido y guarda la spec en la bóveda, con sus tareas y sus criterios. Es solo para funciones; los arreglos y los cambios chicos no llevan spec.
disable-model-invocation: true
effort: high
argument-hint: 'la función, en una oración, o el nombre de su fila en el roadmap'
allowed-tools: Read, Glob, Grep, Write, Edit, AskUserQuestion, Bash(ls:*), Bash(cat:*), Bash(date:*), Bash(node:*)
---

# /spec

Escribe la spec de: `$ARGUMENTS`. **Acá no se escribe código**: solo la spec y sus archivos.

## Contexto de la sesión

Fecha de hoy (usá esta, nunca la adivines):
!`date +%F`

Dónde viven las specs:
!`grep -m1 '\*\*Specs:\*\*' CLAUDE.md 2>/dev/null || echo "No hay línea Specs en el CLAUDE.md"`

Si no hay línea `**Specs:**`, pará y decile al usuario que corra `/iniciar-proyecto` primero: sin bóveda no hay dónde guardar la spec.

## Modelo y esfuerzo

Este comando está pensado para **Opus 5.5 con esfuerzo alto**. Antes de nada, fijate con qué modelo estás corriendo. Si no es ese, decilo en la primera línea y seguí: el usuario decide si cambia. El esfuerzo del encabezado vale solo para la primera respuesta, así que recordale que lo deje en alto para toda la sesión.

## Qué es una spec y cuándo hace falta

Una spec es el acuerdo de qué se va a construir, escrito antes de programar. Si la spec es vaga, el código improvisa. Por eso acá se va lento al definir y rápido al escribir.

Solo las **funciones** llevan spec (mirá "Tamaños de trabajo" en el `CLAUDE.md` del proyecto). Si lo que piden es un arreglo o un cambio chico, decilo y pará: no necesita spec.

## De dónde sale "fuera de alcance"

Cada spec tiene dos listas: lo que entra y lo que no entra. "Fuera de alcance" es lo que quedó en la segunda. Sirve para que una spec de dos días no crezca a dos semanas.

No es una excusa para anotar pendientes. Un arreglo que aparece mientras se programa se arregla en el momento, esté o no en la lista: lo dicen los tamaños de trabajo.

## Dónde se guarda

En la bóveda que nombra la línea `**Specs:**`:

- Una carpeta por spec, en `Backend/Specs/`, `Frontend/Specs/` o `Mobile/Specs/`: `Spec NN - <Nombre>/`. El cartel de backend de una fila va en la primera; el de pantalla, en la segunda; las filas del roadmap mobile, en la tercera. Una fila de todo el proyecto, como la base del sistema, va en `Backend/Specs/`.
- Adentro, tres archivos: la spec (`Spec NN - <Nombre>.md`), sus tareas (`Tareas spec NN.md`) y sus criterios (`Criterios spec NN.md`).
- Una sola numeración para todo el proyecto: mirá las tres carpetas antes de elegir `NN`.
- El estado vive solo en la línea `> **Estado:**` del encabezado. Nunca en las propiedades de la nota: dos copias terminan diciendo cosas distintas.

## Fases

Van en orden. Respondé siempre en el idioma del usuario.

### 1. Entender

Leé, en este orden:

1. El `CLAUDE.md` del proyecto, con sus convenciones de código.
2. El núcleo: las decisiones caras de cambiar, los módulos, los permisos y las palabras del negocio.
3. El roadmap donde está la fila de esta spec (`Roadmap general.json` o `Roadmap mobile.json`, en la raíz de la bóveda): la fila, con lo que necesita, lo que deja funcionando y su tamaño.
4. Las dos últimas specs, para copiar su forma y sus palabras. Si todavía no hay ninguna, la forma sale solo de `plantilla.md`.
5. `Proyecto/Pendientes.md` y `Cliente/Preguntas al cliente.md`.

Y comprobá cuatro cosas antes de preguntar nada:

- **El orden.** ¿Están hechas todas las filas que esta necesita? Si no, decí cuál va primero y preguntá si se sigue igual.
- **El roadmap.** Si la función no tiene fila, decilo: es algo que no estaba previsto. Preguntá dónde entra en el orden antes de seguir.
- **Los pendientes.** Los que tocan esta fila se ofrecen para entrar en esta spec. Es el momento de sacarlos de la lista.
- **Las preguntas al cliente.** Si una 🔺 frena esta spec, decilo. No inventes la respuesta.

Si no te pasaron nada, proponé la fila que el roadmap marca como la que sigue. Si la función no entra en una oración, es muy grande: proponé partirla antes de seguir.

### 2. Aclarar con preguntas

Es la fase más importante. Tu trabajo es encontrar lo que no está definido y preguntarlo, no suponerlo.

**Primero, mostrá lo que encontraste:** lo que se contradice entre el pedido, el núcleo y las specs anteriores, y lo que falta. Cada punto con el lugar del que sale. Las preguntas parten de ahí.

**Después, preguntá** en bloques de 3 a 5, y esperá la respuesta antes del bloque siguiente: cada bloque termina el turno. Preguntas concretas, con 2 a 4 opciones y tu recomendación primero, con su porqué. Si preguntás con una ventana de preguntas, lo que escribiste antes puede quedar tapado: lo que hace falta para contestar va dentro de la pregunta.

Se pregunta lo que cambia lo que el sistema acepta, devuelve o guarda. Lo técnico lo decidís vos y lo listás en un bloque aparte, para que el usuario pueda frenar lo que no le cierre. En una spec sensible, lo técnico que cambia la seguridad también se pregunta: cómo se guarda una contraseña, cómo viaja una sesión, quién puede ver un dato.

- Mal: "¿Cómo te imaginás los recibos?"
- Bien: "¿El empleado firma el recibo con un clic, o con su contraseña? Recomiendo la contraseña: deja prueba de que fue él."

Lo que siempre hay que mirar:

- **Alcance:** qué entra y qué no.
- **Datos:** qué tablas o campos aparecen o cambian, cómo se llaman y de qué módulo son. Una tabla que no estaba en el modelo de datos se pregunta acá, con su módulo dueño; a `/modulos` se vuelve solo si aparece un módulo nuevo. Tienen que cumplir las reglas de los módulos, que están al principio de la sección "Módulos" del núcleo: cada tabla con un solo dueño, y ningún campo que solo le sirva a otro módulo.
- **Integración:** qué usa de specs anteriores, y si cambia algo que ya existe.
- **Pantallas y estados:** cómo se ve cuando anda, cuando falla, cuando está vacío y mientras carga.
- **Permisos:** quién puede hacerlo, según la tabla de permisos del núcleo.
- **Decisiones ya tomadas:** lo que el usuario no quiere volver a discutir.
- **Datos sensibles:** si una columna nueva lo es, el núcleo ya dice cómo se protege (tabla de la decisión de datos sensibles). La spec lo cumple y lo nombra; si el núcleo no dice nada de ese dato, se pregunta.
- **Convenciones:** en qué carpeta va cada archivo nuevo y cómo se llama, y cómo se valida lo que entra. Lo dice el `CLAUDE.md` del proyecto.
- **Lo que ya existe:** antes de describir algo a construir a mano, fijate si lo resuelve el framework o una librería del stack. Una dependencia nueva se pregunta.

Si la spec trae pantallas, cargá antes las skills del stack que nombran las convenciones.

Usá las palabras del negocio tal como están en el núcleo. Si una respuesta abre otra función ("y también que mande un mail"), decí que merece su propia spec y preguntá si queda fuera de esta.

**Dejá de preguntar** cuando puedas contestar esto sin suponer nada:

1. ¿Qué archivos aparecen o cambian?
2. ¿Cuál es el primer paso que se puede ejecutar, y cuál el último?
3. ¿Cómo se comprueba que está terminada?

Si el usuario quiere saltear las preguntas, recordale una vez que lo que no se pregunta ahora se paga después en código. Si insiste, respetalo y anotalo en las decisiones de la spec.

### 3. Escribir

Leé `plantilla.md` (en la carpeta de esta skill): es la forma que tiene que respetar la spec.

- **Si ya tenés todo**, escribí la spec entera y guardala. No pidas confirmación sección por sección: el usuario ya contestó, y volver a preguntar es fricción. La revisa en el archivo.
- **Si falta información**, escribí de a una sección, mostrala y esperá el visto bueno antes de la siguiente.

**Antes de guardar, repasala como si fuera de otro.** La mayoría de los errores de una spec son partes que no dicen lo mismo:

- Cada criterio tiene un paso del plan que lo cumple y una prueba que lo comprueba. Un criterio que no se puede comprobar ("no escribe nada en…") se cambia por uno que sí, o el plan suma la forma de verlo.
- Si un criterio nombra dos casos, hay un test para cada uno.
- Ninguna tarea contradice un criterio ni otra tarea.
- Un test no depende de lo que dejó otro test.
- Los comandos que nombra un criterio existen en algún paso.
- Cada archivo que nombra el plan está en la carpeta y con el nombre que mandan las convenciones.
- Ninguna validación ni utilidad se escribe a mano si el stack ya la trae.

### 4. Guardar

1. **Número:** el más alto de las tres carpetas de specs, más uno, con dos dígitos. Si no hay ninguna, `01`.
2. **La spec**, en su carpeta, con estado `Borrador` y la fecha del contexto. Nunca la pases a `Aprobado`: eso lo hace el usuario después de releerla.
3. **Las tareas** (`Tareas spec NN.md`), a partir del plan:
   - Un título por paso: `## Paso N — <título>`.
   - Debajo, sus tareas en orden, en el formato de Tasks: `- [ ] <acción concreta> ⏫ ➕ <fecha>` (⏫ para lo central del paso, 🔼 para el resto).
   - Debajo de cada tarea, con sangría: `Archivos:` y `Cómo comprobarlo:`. No hay tarea sin forma de comprobarla.
   - Escritas para que una persona pueda programar siguiéndolas.
4. **Los criterios** (`Criterios spec NN.md`): una nota con el enlace a la spec y el embed `![[Spec NN - <Nombre>#Criterios de aceptación]]`. Nunca una copia: los criterios se cambian y se tildan solo en la spec.
5. **El roadmap:** en el archivo donde está la fila, poné `"spec": NN` en el cartel de esta spec. Si la función no tenía fila, agregala donde el usuario dijo, con su módulo, su tamaño, lo que necesita y lo que deja funcionando. Después generá el dibujo de nuevo con la skill `dibujar`.
6. **El núcleo:** si la spec decide algo que el núcleo dejaba abierto, o suma una tabla, corregí el núcleo ahora. El dibujo del modelo de datos lo actualiza `/cerrar-spec`, a partir del código.
7. **Los pendientes:** borrá de `Proyecto/Pendientes.md` los que entraron en esta spec. Si un pendiente o una pregunta al cliente nombra algo que esta spec cambió, corregí su texto.
8. **Las dependencias:** comprobá que cada spec de `Depende de:` existe. Si falta una, decilo.
9. **Un commit en la bóveda** con la spec, sus tareas, sus criterios y el roadmap.
10. **Avisá y pará:** la ruta de la spec, que está en `Borrador` y que el usuario la pasa a `Aprobado` cuando la relea, y el paso que sigue: `/spec-impl NN`, en una sesión nueva o después de `/clear`. Si la spec es sensible, decí que esa sesión va con esfuerzo extra alto.

## Reglas

- **Nunca escribas código acá**, ni propongas implementar después de guardar. Tu trabajo termina cuando la spec está escrita.
- **Nunca supongas una decisión** que el usuario no tomó. Si falta, se pregunta en la fase 2.
- **No vuelvas a preguntar** en la fase 3 lo que ya se contestó en la fase 2.
- **Si el usuario pide correcciones a una spec en "Borrador",** aplicalas en la spec y en las tareas, repasá lo que cambió como en la fase 3 y guardá con un commit nuevo en la bóveda. Si una corrección choca con otra parte de la spec, decilo y proponé cómo queda: no la apliques a ciegas.
- **Si la función es muy grande** (no entra en una oración, o su plan pasa de ocho pasos), proponé partirla en dos specs.
- **Preguntá directo.** Sin pedir disculpas ni dar vueltas: el usuario llamó a esta skill para que le pregunten.
