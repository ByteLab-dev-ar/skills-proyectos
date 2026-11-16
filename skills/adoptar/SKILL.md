---
name: adoptar
description: Pasa a estas skills un proyecto que ya tiene código y una bóveda hecha con otras reglas. Primero lee todo sin tocar nada y muestra qué está, qué falta y qué es distinto. Después, con el visto bueno del usuario, rehace los dibujos y la bóveda con la forma de estas skills, anota como regla del proyecto lo que el código hace distinto y deja el CLAUDE.md del proyecto. No toca el código ni deja listas de cambios. Se corre una vez por proyecto.
disable-model-invocation: true
argument-hint: 'vacío, o lo que el usuario ya sabe que quiere cambiar'
allowed-tools: Read, Glob, Grep, Write, Edit, AskUserQuestion, Bash(git status:*), Bash(git branch:*), Bash(git log:*), Bash(git diff:*), Bash(git remote:*), Bash(ls:*), Bash(node:*)
---

# /adoptar

Pasa a estas skills el proyecto de la carpeta actual. Lo que el usuario ya sabe: `$ARGUMENTS`.

**La idea:** adoptar no es empezar de nuevo. Lo que el proyecto ya decidió y funciona queda como regla del proyecto. Lo que les falta a los demás comandos para andar se crea, sacándolo del código y de la bóveda que ya existen. Cuando termina, `/estado`, `/spec`, `/spec-impl` y `/cerrar-spec` funcionan como si el proyecto hubiera nacido con `/iniciar-proyecto` y `/modulos`.

**Lo que no hace:** no toca el código, no cambia de rama y no hace commits en el proyecto: eso lo decide el usuario. No borra notas sin preguntar. No inventa: lo que no sale del código ni de la bóveda se pregunta. No propone cambios al código ni los anota para después: lo que el código hace distinto queda como regla del proyecto.

## Modelo y esfuerzo

Este comando está pensado para **Fable 5.2 con esfuerzo alto**: decide qué queda como regla del proyecto, y eso pesa en cada spec que venga.

Esta sesión corre con esfuerzo `${CLAUDE_EFFORT}`. En la primera línea, decí con qué modelo y qué esfuerzo estás corriendo, y si alguno no es el recomendado, cuál conviene. Después seguí igual: el usuario decide si cambia o sigue así.

## Reglas de toda la skill

- Una decisión por pregunta, con tu recomendación primero y el porqué en una línea.
- La forma a la que se llega es la que dejan `/iniciar-proyecto` y `/modulos`, con `preferencias.md`. Leé esas dos skills antes de proponer nada: no copies la forma de otra bóveda.
- Todo lo de la bóveda se escribe en criollo, para que lo entienda alguien que no programa.
- Lo viejo que sigue sirviendo se mueve, no se reescribe. Una nota de permisos que ya existe pasa al núcleo tal cual, con los retoques justos.
- Cada cosa vive en un solo lugar. Si el orden de las specs pasa al roadmap, se saca de donde estaba: dos copias terminan diciendo cosas distintas.

## Pasos

### 1. Leer, sin tocar nada

Si el proyecto es grande, repartí la lectura en subagentes que solo leen, y quedate con lo que encuentren.

- **El proyecto:** la rama, los cambios sin guardar, el remoto y las ramas sin unir. Todos los `CLAUDE.md`, la carpeta `.claude/` y cualquier archivo de configuración de skills viejas. Los `package.json` y sus scripts. Las carpetas de cada módulo, dónde están los tests, cómo se valida lo que entra, cómo se guardan las contraseñas, en qué idioma están los nombres del código, la base de prueba y el `docker-compose`.
- **La bóveda:** sale de la línea `**Specs:**` del `CLAUDE.md`. Si no está, preguntá dónde está. Leé su reglamento, el núcleo, sus carpetas, cómo están hechos los dibujos y todas las specs: número, nombre, `Estado`, si tienen tareas y criterios, y la línea de cierre.
- **Lo que quedó a medias:** una spec en `Aprobado`, su rama, tareas o criterios sin tildar, y cambios sin guardar en el proyecto o en la bóveda.

### 2. Si hay trabajo a medias, pará

Mostrá qué quedó a medias y qué le falta. Con cambios sin guardar, la adopción se mezcla con ese trabajo en los mismos commits, y el comando que siga va a preguntar por cambios que no son suyos.

- **Cambios del proyecto sin guardar:** el usuario los guarda con un commit en su rama. Si son de una spec, con el formato de sus commits (`SPEC NN: …`). Pasale un solo bloque.
- **Cambios de la bóveda sin guardar:** lo mismo, en la bóveda.
- **Una spec abierta:** no se cierra acá. Se adopta primero y después se termina con estas skills: `/spec-impl NN` si le faltan pasos, `/cerrar-spec NN` si tiene todo hecho. Así su cierre ya usa las reglas del proyecto.

No sigas hasta que no queden cambios sin guardar.

### 3. Mostrar el informe y parar

No escribas nada todavía. Mostrá una tabla por parte (proyecto, bóveda, specs, código). Cada fila es algo que falta o que es distinto de la forma de referencia, con lo que proponés:

| Qué | Cómo está | Qué se propone |
|---|---|---|

Lo que se propone es una de estas cosas:

- **Lo crea `/adoptar`**, sacándolo de lo que ya existe.
- **Queda como regla del proyecto.** Se anota en las convenciones de su `CLAUDE.md`.
- **Lo decide el usuario**, porque no sale de ningún lado.

Lo que ya está bien va en una sola línea, contado. Terminá preguntando si se sigue.

### 4. Anotar las diferencias del código

Lo que el código hace distinto de `preferencias.md` queda como regla del proyecto, tal como está hoy, y se anota en su `CLAUDE.md`. Por ejemplo, valida con zod en vez de class-validator. El código nuevo sigue esa regla: dos formas de hacer lo mismo en un proyecto es peor que cualquiera de las dos. Si el usuario quiere cambiar algo del código, lo hace cuando quiera: `/adoptar` no lo anota para después.

Dos casos que siempre aparecen:

- **Nombres del negocio en castellano dentro del código** (`afiliado`, `ficha`): quedan. Cambiarlos es renombrar tablas y columnas, y eso es una migración con riesgo. Las palabras del negocio del núcleo anotan el nombre que el código ya usa.
- **Controles con otros nombres, o uno por carpeta:** anotá en el `CLAUDE.md` cómo se corre cada uno de los seis. Si alguno no existe, anotalo así, sin prometer que llega.

### 5. Completar la bóveda

Con las skills `obsidian-markdown` y `dibujar`:

- **El reglamento** (el `CLAUDE.md` de la bóveda): reescribilo con la forma de `/iniciar-proyecto`. Quedan las reglas propias del proyecto que no la contradicen, y se van los nombres de skills viejas.
- **El núcleo:** sumá las secciones que faltan de `/iniciar-proyecto` y `/modulos`, armadas con lo que ya existe. Por ejemplo, una nota de datos sensibles pasa a la tabla de decisiones caras, y una de permisos, a la sección Permisos. Lo que no está se pregunta. Si el núcleo tenía el orden de las specs, se saca de ahí: pasa al roadmap.
- **`Proyecto/Pendientes.md`:** se arma con las listas de pendientes que hubiera en el `CLAUDE.md` del proyecto o en el núcleo. Entra solo lo que admiten los tamaños de trabajo: lo que en esas listas era un arreglo o un cambio chico no pasa.
- **`Cliente/Preguntas al cliente.md`:** si las preguntas estaban en otro lado, se mueven acá, con la forma de tareas de `/iniciar-proyecto`.
- **`Roadmap general.json`:** una fila por función, con su `backend` y su `pantalla`. Si el proyecto hizo el backend y la pantalla de una función en specs separadas, van en la misma fila, cada spec en su cartel. Las specs en `Implementado` llevan `hecha: true`. Las filas que faltan salen del orden viejo y de los roadmaps viejos. Dibujalo, miralo como imagen y corré `--estado`: cada spec `Implementado` tiene que aparecer hecha.
- **Los dibujos:** el modelo de datos sale de las entidades y las migraciones, el mapa de pantallas de las rutas, y la arquitectura del núcleo y del `docker-compose`. Si había dibujos viejos de lo mismo, preguntá si se borran: dos dibujos de una cosa terminan diciendo cosas distintas. La bóveda tiene git, así que se pueden recuperar.
- **`Inicio.md`:** se rehace con la forma de `/iniciar-proyecto`.
- **Las specs viejas no se tocan:** son historia. Solo comprobá que su `Estado` sea uno de los cuatro de la plantilla. Si dice otra cosa, preguntá a cuál corresponde.
- **La spec abierta** recibe las líneas del encabezado que le faltan (`Módulo`, `Sensible`, `Deja funcionando`), porque `/spec-impl` y `/cerrar-spec` las leen. Su plan y sus criterios no se tocan.
- **Las notas que ya nadie va a actualizar**, como un lienzo con el estado de las specs que ahora calcula el roadmap: preguntá si se borran.

Al final, un commit en la bóveda: `Adopción: la bóveda pasa a las skills nuevas`.

### 6. Dejar el CLAUDE.md del proyecto

Con la forma del paso 8 de `/iniciar-proyecto`:

- La línea `**Specs:**` con la raíz de la bóveda. Si ya está, se queda.
- Las convenciones de `preferencias.md`, con las reglas del proyecto del paso 4.
- Los tamaños de trabajo, copiados tal cual.
- Se quedan las reglas propias que siguen valiendo (por ejemplo, cómo se prueba la API a mano).
- Se van las listas de pendientes, que ya están en la bóveda, y las secciones de comandos viejos.
- Los archivos de configuración de skills viejas: decí qué son y preguntá si se borran.

No hagas el commit. Pasale al usuario un solo bloque: `git add` del `CLAUDE.md` (y de lo que se borró) y un commit con el mensaje `Adopción: reglas del proyecto para las skills nuevas`. Va en la rama donde esté. Si es la rama de una spec, viaja con ella: es solo texto.

### 7. Comprobar y resumir

- Corré el roadmap con `--estado` y comparalo con los `Estado` de las specs. Si no coinciden, arreglalo antes de seguir.
- Buscá en el reglamento, el núcleo y el `CLAUDE.md` del proyecto nombres de comandos que ya no existen. Las specs viejas los pueden tener: son historia.

Mostrá:

- Lo que quedó creado o movido, con sus rutas.
- Las reglas propias del proyecto, cada una en una línea.
- Las preguntas al cliente que frenan algo.
- El comando que sigue, en una sesión nueva: `/cerrar-spec NN` o `/spec-impl NN` si hay una spec abierta, y si no, `/estado`.
