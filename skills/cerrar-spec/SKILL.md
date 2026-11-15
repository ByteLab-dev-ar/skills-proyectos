---
name: cerrar-spec
description: Cierra una spec ya implementada con /spec-impl. Corre los tests, comprueba cada criterio de aceptación con evidencia, rompe el código a propósito para ver que cada test falla, revisa el código, la seguridad y las reglas de los módulos, arregla lo que encuentra, actualiza la bóveda y marca la spec como hecha en el roadmap. Es obligatorio antes de pasar una spec a "Implementado".
disable-model-invocation: true
argument-hint: '<número de la spec>'
---

# /cerrar-spec

Cierra la spec `$ARGUMENTS`. Si no te pasaron ninguna, preguntá cuál. Está en la bóveda que nombra la línea `**Specs:**` del `CLAUDE.md` del proyecto, en `Backend/Specs/`, `Frontend/Specs/` o `Mobile/Specs/`, junto a su archivo de tareas.

## Modelo y esfuerzo

Este comando está pensado para **Fable 5.2 con esfuerzo alto**. Es el último control antes de dar una spec por hecha, y conviene que revise un modelo distinto al que programó.

Esta sesión corre con esfuerzo `${CLAUDE_EFFORT}`. En la primera línea, decí con qué modelo y qué esfuerzo estás corriendo, y si alguno no es el recomendado, cuál conviene. Después seguí igual: el usuario decide si cambia o sigue así.

## Dos reglas

- **Ninguna spec pasa a "Implementado" sin este comando.** Es el único que cambia ese estado, en el paso 9.
- **Una spec se cierra sin pendientes propios.** Lo que la revisión encuentra se arregla acá o se descarta con su motivo. A `Proyecto/Pendientes.md` va solo lo que espera una respuesta del cliente, es una función nueva o le toca a otra fila del roadmap.

## Pasos

Hacelos en orden.

### 1. Tests

Corré los tests de las partes que tocó la spec, y también el lint, el formato, los tipos y el build. Si el proyecto tiene tests de punta a punta, también. Si lo que falla se arregla en minutos (el formato, un tipo), arreglalo y seguí. Si no, mostrá el primer error y pará acá.

### 2. Tareas y criterios

- Si en `Tareas spec NN.md` queda alguna tarea sin tildar, mostrala y preguntá si se hizo o falta.
- Comprobá uno por uno los criterios de la sección "Criterios de aceptación" de la spec, cada uno con su evidencia:
  - Si un test lo cubre, nombrá el test.
  - Si no, comprobalo a mano y mostrá qué hiciste y qué devolvió. Las pruebas que escriben datos van contra la base de prueba del proyecto (la nombra la spec o el README), nunca la de desarrollo. Si un criterio nombra la de desarrollo, corrélo contra la de prueba y decilo. La excepción es arrancar desde cero, que usa la de desarrollo.
  - Antes de levantar la app o de probar algo a mano, mirá qué está escuchando en sus puertos. Si los ocupa un proceso que no arrancaste vos (por ejemplo, una app que dejó andando una sesión que se cortó), no lo frenes y no pruebes contra él: decilo y pasale al usuario un solo bloque que lo frene.
  - Nunca marques un criterio como cumplido sin evidencia. Si no se puede comprobar, decilo.
  - Si un permiso bloquea una comprobación (por ejemplo, una regla que no deja tocar los `.env`), no la esquives. Decí qué parte quedó sin comprobar y pasale al usuario un solo bloque que la compruebe. El criterio queda sin tildar hasta que el usuario conteste.
- **Prueba de sabotaje.** Un test que pasa no prueba nada si también pasaría con el código roto. Va antes que las pruebas a mano que borran cosas, y el repo tiene que estar sin cambios sin guardar. Por cada criterio que cubre un test:
  1. Rompé a propósito el código que cumple ese criterio, con el cambio más chico que puedas: sacar una comparación, dar vuelta una condición, devolver un valor fijo.
  2. Corré ese test. Tiene que fallar. Si lo que rompiste es una migración o la preparación de los tests, recreá la base de prueba antes de correrlo.
  3. Deshacé el cambio y comprobá con `git status` que no quedó nada roto.

  - **Un sabotaje por cada lugar que hace falta para cumplir el criterio**, no uno por criterio: la función, y también la línea que la conecta con la app. Los tests que prueban una función suelta suelen dejar pasar que nadie la llame.
  - Si el test sigue pasando y dejó de cumplirse el criterio, o algo que el alcance promete, el test no mira lo que dice: es un hallazgo. El test se arregla en el paso 6, se guarda con su commit y se le repite el sabotaje.
  - Si el test sigue pasando y todo lo que la spec promete se sigue cumpliendo, rompiste código que no hacía falta: no es un hallazgo.
  - Si el test cubre solo una parte del criterio, la parte que falta se comprueba a mano y se nombra.

  Si son más de unos veinte, armá un script que los corra de a uno y deshaga cada cambio, y dejalo corriendo mientras hacés las revisiones de los pasos 3 y 4, que solo leen. Las pruebas a mano esperan a que termine: necesitan el repo quieto.

  Mostrá una línea por sabotaje: qué rompiste y qué test falló. Y la cuenta: cuántos sabotajes, cuántos hallazgos.
- El criterio que se cumple se tilda en la spec: `- [x] <criterio> ✅ <fecha de hoy>`. El que no, queda `- [ ]`. Se tilda solo en la spec: `Criterios spec NN.md` es un embed y no se edita.

### 3. Revisión de código

Con la skill `code-review` en nivel alto (`high`), solo sobre los commits de esta spec: lo que cambió desde que la rama se separó de la principal (`git diff <principal>...HEAD`, con tres puntos). Lo de specs anteriores no entra en la revisión, salvo que rompa algo que esta spec promete.

### 4. Revisión de seguridad

Con la skill `security-review`. Si no puede correr (por ejemplo, porque el repo no tiene remoto), hacé la revisión a mano y decí en la línea de cierre que fue a mano: leé el mismo diff y probá la app andando con entradas raras (textos enormes, caracteres raros, campos de más, cuerpos que no son lo que se espera). Si el modelo rechaza el paso, avisá y seguí: el usuario puede correr solo ese paso con Opus 5.5.

### 5. Reglas de los módulos y convenciones de código

Mirá las tablas y los campos que agregó o cambió la spec, contra las reglas de `/modulos`:

- Cada tabla tiene un solo módulo dueño.
- Un módulo escribe solo en sus tablas.
- Un módulo nombra los datos de otro solo por su `id`.
- Ningún campo sirve solo a otro módulo.

Y mirá todo lo que cambió la spec contra las convenciones de código del `CLAUDE.md` del proyecto. La revisión de código busca errores; esto busca desorden, que no rompe nada hoy y cuesta caro después:

- Cada archivo está en su carpeta y con su nombre.
- Cada cosa está en el idioma que mandan las convenciones.
- Toda entrada se valida como mandan.
- Cada dato sensible nuevo se protege como dice la decisión de datos sensibles del núcleo, y nada sensible va al registro, a un mensaje de error ni a una respuesta que no lo necesita.
- Nada está escrito a mano si el framework o una librería ya instalada lo resuelve.

Si el `CLAUDE.md` no tiene convenciones de código, decilo acá y en la línea de cierre.

### 6. Arreglar

Juntá lo que encontraron los pasos 2 a 5 y mostralo. Cada hallazgo se trata según su tamaño. Lo que es un arreglo se arregla ahora, aunque le toque a otra fila: anotarlo cuesta más que hacerlo.

| Qué es | Qué se hace |
|---|---|
| **Arreglo** | Se arregla ahora y se vuelven a correr los tests |
| **Cambio chico** | Preguntá si se hace ahora. Lo normal es que sí: la spec no está terminada sin él |
| **Función nueva** | Va a `Proyecto/Pendientes.md`, con su origen y la fecha |
| **Le toca a otra fila del roadmap** | Va a `Proyecto/Pendientes.md`, nombrando la fila. `/spec` lo ofrece cuando llegue esa fila |
| **Un hallazgo de seguridad** | Se arregla ahora, cambie o no lo que el sistema devuelve, y se nombra en el resumen. Si no sabés cerrarlo bien, frená y preguntá |
| **Un error en el texto de la spec** | Se corrige en la spec y se nombra en el resumen |
| **No es un problema** | Se descarta, y se anota el motivo en el resumen |

Si hay cambios chicos para preguntar, preguntalos juntos y esperá la respuesta antes del paso 7: las notas de la bóveda se escriben con el código ya terminado.

Si un criterio de aceptación no se cumple, la spec no se cierra: se arregla y se vuelve al paso 1.

Lo que arregles se relee antes de guardarlo, el código y sus tests, igual que un paso de `/spec-impl`. Se guarda en la rama de la spec, con un commit `SPEC NN: cierre — <qué se arregló>`.

### 7. La bóveda

Leé el reglamento de la bóveda (su `CLAUDE.md`) y usá la skill `obsidian-markdown`.

- **Lo aprendido.** Una nota por tema en `Aprendizajes/`, en criollo y con un ejemplo: qué es, qué problema hubo, cómo se resolvió y por qué no de otra forma. Solo lo que vale la pena recordar: no copies la spec ni la lista de cambios. Si ya hay una nota del mismo tema, sumale una sección.
- **Las notas de `Backend/`, `Frontend/` y `Mobile/`** que la spec cambió, a partir del código: endpoints, errores, la tabla de permisos, configuración, servicios de afuera, pantallas, componentes, textos y mensajes. Si la nota de un tema todavía no existe, creala en la subcarpeta que dice el reglamento. Si un tema está en dos partes (la configuración, los tests), el nombre de la nota dice de cuál es: "Configuración de la API", "Configuración de la web". Las que no tocó, dejalas como están.
- **El modelo de datos**, si la spec cambió tablas: actualizá `Modelo de datos.json` a partir de las entidades y migraciones reales, y generá el dibujo de nuevo con la skill `dibujar`.
- **El mapa de pantallas**, si la spec agregó o cambió pantallas: lo mismo.
- **Los pendientes:** sacá de `Proyecto/Pendientes.md` lo que esta spec resolvió.

### 8. Resumen

Mostrá el resultado de cada paso: los tests, cuántos criterios se cumplen de cuántos hay, lo que se arregló, lo que se descartó y por qué, y las notas y dibujos que cambiaron. Y lo que falta: el cierre.

### 9. Cierre (solo cuando el usuario lo pida)

No cierres por tu cuenta: esperá a que el usuario lo pida con palabras ("cerrá"), ahora o de antemano. Unir la rama a la principal no se deshace fácil.

Primero, estos cambios juntos, para que la spec y el roadmap nunca digan cosas distintas:

- **En la spec**, pasá el estado a `Implementado` y, debajo, sumá la línea del cierre:

  ```text
  > **Cierre:** /cerrar-spec el AAAA-MM-DD. Tests corridos, criterios comprobados (N de N), sabotaje (N sabotajes, N hallazgos arreglados), revisión de código, revisión de seguridad, reglas de módulos y convenciones de código.
  ```

  `N de N` se cuenta en el archivo: cuántas casillas quedaron tildadas, de cuántas hay. Si un paso no corrió, o una parte quedó sin comprobar, decilo en esa línea ("la revisión de seguridad no corrió"). Nunca anotes un paso que no se hizo.

- **En el roadmap donde está su fila** (`Roadmap general.json` o `Roadmap mobile.json`), poné `"hecha": true` en el cartel de esta spec. Generá el dibujo de nuevo con la skill `dibujar` y miralo como imagen.

Después, guardar y unir. Lo hacés vos: el usuario no tiene que correr comandos ni entrar a GitHub.

1. **Guardar.** Un commit en la rama de la spec con lo que quede sin guardar: `SPEC NN: cierre`. Otro en el repo de la bóveda, con la spec, el roadmap y las notas. Subí los dos, si tienen remoto.
2. **Abrir el pull request** de la rama contra la principal: `gh pr create --fill --base <principal>`.
3. **Esperar al CI:** `gh pr checks --watch --fail-fast`. Es el control automático antes de unir.
   - Si pasa, seguí.
   - Si falla, mostrá el primer error, arreglalo en la rama, subilo y volvé a esperar. No unas con el CI en rojo.
   - Si el repo no tiene CI, decilo y seguí.
4. **Unir:** `gh pr merge --merge --delete-branch`. Después pasate a la rama principal y traé lo último (`git pull`), para que la próxima spec nazca de ahí.
5. Si el repo no está en GitHub o no hay `gh`, decilo y uní la rama a la principal con git, sin pull request (`git merge --no-ff`), corré los tests en la principal y borrá la rama de la spec.

Si algo de esto necesita que el usuario corra un comando, pasale un solo bloque por respuesta.

Al final, **decí qué sigue.** El roadmap marca solo cuál es la próxima. Además:

- Si con esta spec quedaron hechas todas las filas de la versión 1, decilo: la versión 1 está completa.
- Si quedaron hechas todas las filas del roadmap general y el núcleo dice que la app tiene mobile, decí que el paso que sigue es `/iniciar-mobile`.
