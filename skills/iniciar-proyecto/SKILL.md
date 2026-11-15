---
name: iniciar-proyecto
description: Arranca un proyecto nuevo a partir de la idea de la app. Analiza la idea, pregunta lo que falta, cierra las decisiones caras de cambiar, define la versión 1 y dónde se publica, recomienda las tecnologías, crea la bóveda de Obsidian con su núcleo y el dibujo de la arquitectura, y deja el CLAUDE.md del proyecto. Va antes de /modulos.
disable-model-invocation: true
effort: high
argument-hint: 'la idea de la app: qué hace, para quién y cómo se vende o se usa'
---

# /iniciar-proyecto

Arranca el proyecto de la carpeta actual a partir de esta idea: `$ARGUMENTS`. Si no te pasaron una idea, pedila antes de seguir.

Contesta una pregunta: **qué es la app y con qué se hace.** Qué partes tiene lo contesta `/modulos`.

```text
/iniciar-proyecto → /modulos → /spec → /spec-impl → /cerrar-spec      (/estado, en cualquier momento)
/iniciar-mobile, cuando el roadmap general está completo y la app tiene mobile
```

**Lo que no hace:** no crea la carpeta del proyecto, no escribe código (la base del sistema es la primera spec) y no hace commits ni push en el proyecto: eso lo decide el usuario. En la bóveda hace solo el primer commit, y no la sube a ningún lado.

## Modelo y esfuerzo

Este comando está pensado para **Fable 5.2 con esfuerzo alto**: se corre una vez y decide lo más caro de cambiar.

Antes de nada, fijate con qué modelo estás corriendo. Si no es ese, decilo en la primera línea ("Este comando rinde mejor con Fable 5.2 en esfuerzo alto; ahora estás en …") y seguí: el usuario decide si cambia. El esfuerzo del encabezado vale solo para la primera respuesta, así que recordale también que lo deje en alto para toda la sesión.

## Reglas de toda la skill

- Una decisión por pregunta, con tu recomendación primero y el porqué en una línea.
- Nunca supongas cómo funciona el negocio del cliente. Lo que el usuario no sabe se anota como pregunta al cliente; no se inventa.
- Todo lo de la bóveda se escribe en criollo, para que lo entienda alguien que no programa. El código no: sigue las convenciones de `preferencias.md`.
- Si preguntás con una ventana de preguntas, lo que escribas antes puede quedar tapado. Lo que el usuario tiene que saber para contestar va dentro de la pregunta.
- No mires otras bóvedas para copiar su forma: todo lo que hace falta está en esta skill, y las otras siguen reglas viejas.

## Pasos

### 1. Mirar dónde estamos

- Leé `preferencias.md` (en la carpeta de esta skill): dice dónde se guardan las bóvedas, qué tecnologías usa siempre el usuario, cómo escribe el código y dónde publica.
- La carpeta actual es el proyecto. Si ya tiene un `CLAUDE.md` o un núcleo, avisá y preguntá si se sigue. No pises nada.
- Si ya existe una bóveda con el nombre del proyecto, preguntá antes de tocarla.
- Comprobá que hay Node (`node --version`): los dibujos lo necesitan.

### 2. Analizar la idea

Antes de la primera pregunta, leé la idea y armá cuatro listas. Son para vos: no las muestres. De ahí salen las preguntas del paso 3. Lo que se contradice y lo que no está claro se pregunta en el primer bloque, nombrando la parte de la idea de la que sale.

- **Lo que falta:** quién usa la app, qué puede hacer cada uno, qué datos guarda, si es web, mobile o las dos.
- **Lo que se contradice:** dos partes que no pueden ser ciertas a la vez.
- **Lo que no está claro:** palabras del negocio que pueden querer decir más de una cosa.
- **Las decisiones caras de cambiar:** las que, si se toman mal, obligan a rehacer media app. Casi siempre son estas:
  - Si la usan varias empresas, cómo se separan los datos de cada una.
  - Qué datos son sensibles (salud, menores, documentos, dinero, sueldos), cómo se cuidan y si hay una ley o norma que cumplir. Cómo se cuidan se pregunta en el paso 3.
  - Cómo entra cada tipo de usuario.
  - Si es web, mobile o las dos. Si va a tener app mobile, el backend se prepara para eso desde el primer día: el login y el registro tienen que servir igual desde la web y desde el teléfono. Acá solo se anota la decisión; todo lo demás de mobile lo arma `/iniciar-mobile`.

### 3. Preguntar

En bloques de 3 a 5 preguntas, esperando la respuesta antes del siguiente. Primero las decisiones caras; después:

- **Quién la usa:** los tipos de usuario. El detalle de qué puede hacer cada uno lo cierra `/modulos`.
- **Cómo se vende o se cobra**, si es un producto: por empresa, por usuario, con planes.
- **La versión 1:** qué es lo mínimo que tiene que poder hacer el primer cliente para usarla de verdad. Sin esto el proyecto no tiene final.
- **Cómo se cuidan los datos sensibles,** si la app guarda alguno. Es una decisión cara: agregarlo después obliga a migrar todos los datos. Primero listá cuáles son (los de la lista del paso 2 que aparecen en la idea) y, para cada uno, preguntá qué hay que poder hacer con él:
  - **Solo comprobarlo** (una contraseña, un token): se hashea. La contraseña, con `argon2id`; un token al azar y largo, con SHA-256. No hay nada que decidir.
  - **Volver a leerlo y no buscarlo** (un dato médico, una foto de un documento): se cifra la columna con AES-256-GCM.
  - **Volver a leerlo y buscarlo** (un DNI, un CUIL): ahí hay que elegir. O se cifra y se suma una segunda columna con su huella con otra llave (un "índice ciego"), que permite buscar por el valor exacto y no por un pedazo; o se deja legible y se protege con el nivel de abajo. Recomendá la segunda salvo que el dato sea de salud o la ley lo pida.

  Después, el nivel de todo el sistema, que va siempre: HTTPS, base y respaldos cifrados (el respaldo diario a R2 lleva todo lo de la base) y disco del servidor cifrado si el proveedor lo ofrece. Y dónde vive la llave del cifrado de columnas: en la configuración del servidor, nunca en el repo ni en la base, y perderla es perder los datos. Cada respuesta va a "Datos sensibles" del núcleo.
- **Dónde se publica:** dónde va a correr, con qué dominio, y quién es dueño de las cuentas y las paga. Un proyecto no está terminado hasta que está publicado.
- **Lo que no hace, por ahora:** lo que queda afuera a propósito.
- **Si hay que mostrarla antes de construirla** (por ejemplo, para venderla). Si es así, se anota para `/modulos`: la primera fila de pantallas es un prototipo de las 3 o 4 pantallas clave.

No preguntes acá por los módulos ni por las tablas: eso es `/modulos`.

### 4. Recomendar las tecnologías

Partí de las tecnologías de `preferencias.md`. Para cada parte decí si sirve igual en este proyecto o si conviene otra, con el porqué en una línea. Si una parte no hace falta (por ejemplo, la app no manda mails), decilo. Si recomendás algo que no está en las preferencias, consultá antes su documentación actual. El usuario decide.

Después mostrá las convenciones de código de `preferencias.md` y preguntá si este proyecto cambia alguna. Si `preferencias.md` no las tiene, preguntalas ahora: en qué idioma va el código, cómo se ordenan las carpetas de un módulo, dónde van los tests y cómo se valida lo que entra. Sin esto, cada sesión que programa las inventa distinto.

### 5. Crear la bóveda

En la carpeta de bóvedas de `preferencias.md`, con el nombre `<proyecto> boveda/` y la skill `obsidian-markdown` para las notas:

```text
Inicio.md             la portada: el roadmap general y las preguntas al cliente pendientes
CLAUDE.md             el reglamento de la bóveda
Roadmap general.svg   el orden de construcción (lo crea /modulos, con su .json al lado)
Proyecto/
  Núcleo.md           qué es la app, sus decisiones y sus módulos
  Pendientes.md       lo que espera al cliente o a una spec futura (tareas de Tasks)
  Arquitectura.svg    las partes de la app y cómo se conectan
Cliente/              lo que dice el cliente, y "Preguntas al cliente" (tareas de Tasks)
Backend/
  API/                endpoints, errores y la tabla de permisos
  Estructura/         el modelo de datos
  Configuración/      configuración, servicios externos, datos sensibles y tests
  Specs/              una carpeta por spec
Frontend/
  Pantallas/          el mapa de pantallas y una ficha por pantalla
  Diseño/             diseño, componentes, y textos y mensajes
  Técnico/            datos y sesión, formularios, configuración y tests
  Specs/              una carpeta por spec
Aprendizajes/         un tema por nota
```

- Si la app va a tener mobile además de web, la carpeta `Mobile/` no se crea ahora: la crea `/iniciar-mobile`. Si la app es solo mobile, creá `Mobile/` en lugar de `Frontend/`, con las mismas subcarpetas.
- `Backend/` y `Frontend/` arrancan con sus subcarpetas vacías, sin notas. Cada nota la crea `/cerrar-spec` cuando hay código del que sacarla. Una nota vacía no dice nada y hay que mantenerla.
- Las carpetas `Specs/` quedan vacías: las llena `/spec`, con una sola numeración para todo el proyecto.
- El reglamento (`CLAUDE.md` de la bóveda) dice qué va en cada carpeta y estas reglas:
  - Nunca datos de personas reales.
  - El código vive en el repo; el núcleo y las specs, en la bóveda. Sin copias de un lado al otro, porque dos copias terminan diciendo cosas distintas.
  - Las notas no llevan un título `#` al principio: Obsidian ya muestra el nombre del archivo.
  - Nada suelto: cada nota va en la subcarpeta de su tema. Antes de crear una nota, buscar si ya hay una del mismo tema.
  - Los dibujos son cuatro y los genera la skill `dibujar` a partir de un archivo de datos que vive al lado. Nunca se edita el dibujo: se cambia el dato y se vuelve a generar.
  - El orden de las specs vive en un solo lugar: `Roadmap general.json`. Las notas lo muestran con el dibujo, no lo repiten.
  - Las tareas de Tasks se usan para tres cosas: las preguntas al cliente, los pendientes y las tareas de cada spec.
- `git init` en la bóveda, con un `.gitignore` que deje afuera `.obsidian/workspace*.json`, `.obsidian/cache` y `.DS_Store`, y un primer commit.
- **Respaldo:** las specs viven en la bóveda, así que necesita su propio repo privado. Dale al usuario el comando para crearlo; no lo crees vos. Si no lo quiere, avisale que las specs quedan solo en su computadora.

### 6. Escribir el núcleo

En `Proyecto/Núcleo.md`, con lo que se decidió en los pasos 3 y 4:

1. **Qué es la app**, en dos o tres líneas.
2. **Quién la usa** y cómo entra cada uno.
3. **Dónde se usa** (web, mobile) y cómo se conectan las partes, con el dibujo: `![[Arquitectura.svg]]`.
4. **Decisiones caras de cambiar**, cada una con lo que se decidió y por qué. La de los datos sensibles lleva una tabla: cada dato, qué se hace con él (comprobarlo, leerlo, buscarlo) y cómo se protege.
5. **Tecnologías**, con el porqué de cada una.
6. **Dónde se publica**, y quién es dueño de cada cuenta.
7. **La versión 1:** lo mínimo que tiene que poder hacer el primer cliente.
8. **Lo que la app no hace (por ahora).**

Los módulos, los permisos y las palabras del negocio los agrega `/modulos`.

Las preguntas abiertas van en `Cliente/Preguntas al cliente.md`, como tareas de Tasks con su prioridad (🔺 frena una spec, ⏫ afecta a la que viene, 🔼 a un módulo posterior, 🔽 puede esperar) y `➕ <fecha de hoy>`.

### 7. Dibujar la arquitectura

Con la skill `dibujar`: `Proyecto/Arquitectura.json` y `Proyecto/Arquitectura.svg`. Las partes de la app (web, mobile, API, base de datos, servicios de afuera), en capas, con un candado donde cae cada decisión cara. Miralo como imagen antes de seguir.

### 8. Dejar el CLAUDE.md del proyecto

En la carpeta del proyecto, un `CLAUDE.md` corto. Lleva solo reglas, nunca una lista de pendientes: se carga en cada sesión, y lo que está ahí se lee siempre.

- Qué es el proyecto, en una línea, y la ruta del núcleo en la bóveda.
- Dónde está la bóveda, y que su reglamento se lee antes de escribir ahí.
- La línea `**Specs:** <ruta de la bóveda>`, que es la que leen los demás comandos.
- Que el orden de las specs está en `Roadmap general.json`, en la raíz de la bóveda.
- Que ninguna spec pasa a "Implementado" sin `/cerrar-spec`.
- Que cada commit de una spec dice cuál implementa (`SPEC NN: …`).
- Las convenciones de código, copiadas de `preferencias.md` con lo que se cambió en el paso 4. Las leen `/spec`, `/spec-impl` y `/cerrar-spec`.
- Los tamaños de trabajo, copiados tal cual:

```markdown
## Tamaños de trabajo

- **Arreglo:** menos de 15 minutos, y no cambia lo que el sistema acepta, devuelve o guarda. Se arregla en el momento y se nombra en el resumen. No se anota.
- **Cambio chico:** hasta medio día, sin datos nuevos ni decisiones de negocio. Una tarea con su objetivo y cómo comprobarla. Sin spec.
- **Función:** todo lo demás. Necesita una spec aprobada. Un reordenamiento del código que toca muchos archivos también, aunque no cambie lo que la app hace.

Fuera de una spec, un arreglo o un cambio chico va en su propia rama (`cambio-<nombre>`) y se une a la principal cuando pasan los tests.

A `Proyecto/Pendientes.md` de la bóveda va solo lo que espera una respuesta del cliente, es una función nueva o le toca a otra fila del roadmap, con su origen y su fecha. Lo demás se resuelve cuando aparece.
```

Si la carpeta todavía no es un repo git, decíselo al usuario: lo inicializa él.

### 9. Resumen

Antes de mostrarlo, comprobá que existen el núcleo, el `CLAUDE.md` y el dibujo de la arquitectura, y que lo miraste como imagen.

Mostrá:

- Lo que quedó creado, con sus rutas.
- Las decisiones caras, cada una en una línea.
- La versión 1, en una línea.
- Las preguntas al cliente que frenan algo.
- Que instale el plugin Tasks en la bóveda (en Obsidian: Ajustes, Complementos de la comunidad). La portada y las preguntas al cliente lo usan; sin él se ven como código.
- El paso que sigue: abrir una sesión nueva (o hacer `/clear`) y correr `/modulos`.
