---
name: modulos
description: Define los módulos de la app. Dice qué resuelve cada uno, qué tablas son suyas, de quién depende, quién puede hacer qué y qué se deja listo para lo que pueda venir. Deja el modelo de datos, el mapa de pantallas y el roadmap general. Va después de /iniciar-proyecto y antes de la primera /spec; se vuelve a correr cuando la app suma un módulo.
disable-model-invocation: true
argument-hint: 'vacío la primera vez; después, el módulo que se suma o que cambia'
---

# /modulos

Define los módulos de la app. Un módulo es una parte grande de la app, dueña de sus datos. Puede no tener tablas, como la base del sistema o los mails.

Contesta una pregunta: **qué partes tiene la app.** Si te pasaron algo en `$ARGUMENTS`, es el módulo que se suma o que cambia: leé lo que ya existe y tocá solo lo que cambia.

## Modelo y esfuerzo

Este comando está pensado para **Fable 5.2 con esfuerzo alto**: cómo se reparten los datos es de lo más caro de cambiar después.

Esta sesión corre con esfuerzo `${CLAUDE_EFFORT}`. En la primera línea, decí con qué modelo y qué esfuerzo estás corriendo, y si alguno no es el recomendado, cuál conviene. Después seguí igual: el usuario decide si cambia o sigue así.

## La idea

Se busca que cada módulo se ocupe de una sola cosa y dependa poco de los demás. Así, sumar algo más adelante es agregar un módulo, no romper los que ya andan.

Un ejemplo. La app tiene eventos, y algún día podría vender entradas.

- **Mal:** la tabla `evento` lleva `precio_entrada` y `entradas_vendidas`. El día que se vendan entradas hay que cambiar `evento` y todo lo que la usa.
- **Bien:** `evento` tiene solo lo suyo (nombre, fecha, lugar, cupo). El día que se vendan entradas se agrega un módulo Entradas, con su tabla `entrada` que apunta a `evento`. `evento` no se toca.

Los nombres de los ejemplos de esta skill están en castellano para que se lean fácil. En el proyecto, las tablas y los campos se llaman como digan sus convenciones de código.

**Se deja la puerta abierta; no se construye la habitación.** Hoy no se crea la tabla `entrada`. Solo se cuida que `evento` no se mezcle con nada, y se anota por qué.

## Las reglas

1. Cada tabla tiene un solo módulo dueño.
2. Un módulo escribe solo en sus tablas. Para cambiar un dato de otro módulo, se lo pide a ese módulo.
3. Un módulo nombra los datos de otro solo por su `id`.
4. Cada tabla habla de un solo tema. Un campo que solo le sirve a otro módulo no va ahí.
5. Las dependencias van en un solo sentido: si A necesita a B, B no necesita a A.
6. No se crea ninguna tabla ni campo para una función que todavía nadie pidió.

## Pasos

- Una decisión por pregunta, con tu recomendación primero.
- Se pregunta lo que cambia lo que la app hace. Lo técnico lo decidís vos y lo decís en una línea.
- Cada bloque de preguntas termina el turno: esperá la respuesta antes de seguir.
- Si preguntás con una ventana de preguntas, lo que escribas antes puede quedar tapado. Lo que hace falta para contestar va dentro de la pregunta.
- Lo que el usuario no sabe del negocio va a `Cliente/Preguntas al cliente.md`, con su prioridad; no se inventa.

### 1. Leer

El `CLAUDE.md` del proyecto, el núcleo (sobre todo las decisiones caras y la versión 1) y las preguntas al cliente. Si ya hay módulos, también `Roadmap general.json` y el modelo de datos.

### 2. Proponer los módulos

A partir del núcleo, mostrá una lista: el nombre de cada módulo, qué resuelve en una oración y quién lo usa. Si no lo usa nadie directo, qué módulos se apoyan en él.

- Para saber si algo es un módulo aparte: si se puede explicar sin nombrar a otro, es otro módulo.
- Si un módulo no entra en una oración, son dos.
- Una app chica tiene entre 4 y 8, contando los que no tienen tablas. Con más, fijate si alguno es en realidad una función de otro.

Preguntá si la lista está bien antes de seguir.

### 3. Las palabras del negocio

Van antes que las tablas, porque las tablas se llaman con estas palabras. Una lista corta: cada palabra del negocio con lo que quiere decir en esta app.

- Una sola palabra para cada cosa. Si en la idea aparecen dos para lo mismo ("recibo" y "liquidación"), preguntá cuál queda.
- Cada palabra lleva al lado su nombre en el código, según las convenciones del `CLAUDE.md` del proyecto: por ejemplo, "turno" es `appointment`. Es el único nombre que esa cosa va a tener en tablas, clases y rutas.
- Una sola cosa para cada palabra. Pasa seguido con "cliente": en la bóveda es quien encargó la app (la carpeta `Cliente/`). Si la app tiene clientes propios, en las notas nuevas a quien la encargó se lo nombra de otra forma.

### 4. Los datos de cada módulo

Para cada módulo, sus tablas en borrador: columnas, tipos, y qué es clave primaria y qué clave foránea. Preguntá lo que no esté definido, en bloques de 3 a 5.

Aplicá las decisiones caras del núcleo. Por ejemplo: si la app la usan varias empresas, toda tabla con datos de una empresa lleva su `empresa_id`.

### 5. Las dependencias

Listá quién necesita a quién ("Recibos necesita a Empresas"). Si aparece un círculo, mostralo y proponé cómo cortarlo: casi siempre hay un dato que está en el módulo equivocado.

### 6. Los permisos

Una tabla por módulo: las acciones en las filas, los roles en las columnas, y sí o no en cada cruce. Quién puede hacer qué es una decisión cara: escrita acá, la usa cada spec.

- Los roles salen de "Quién la usa" del núcleo. Sumá "sin entrar" si hay algo que se ve sin cuenta.
- Lo que el desarrollador hace a mano (por ejemplo, crear la primera cuenta) se anota al pie: no es un rol.
- Preguntá los cruces que el núcleo no define.

### 7. Las puertas abiertas

Proponé hasta cinco cosas que el cliente podría pedir dentro de un año, y preguntá si son esas. Para cada una, anotá:

- **Qué queda listo hoy.** Casi siempre es "nada nuevo: el módulo X ya es dueño de lo suyo".
- **Qué no se construye hoy.** La tabla, el campo o la pantalla que todavía no hacen falta.

Si para dejar una puerta abierta hay que construir algo hoy, no es una puerta abierta: es una función, y va al roadmap o queda afuera.

### 8. Revisar las reglas

Pasá las seis reglas por cada módulo y cada tabla. Mostrá lo que no cumple y cómo se arregla. No sigas con una regla rota sin que el usuario lo sepa. Lo que queda al límite de una regla se nombra en el resumen.

### 9. Escribir en el núcleo

Sumá a `Proyecto/Núcleo.md` cuatro secciones:

- **Módulos.** Primero las seis reglas, una por línea: las leen `/spec` y `/cerrar-spec`. Después, uno por uno: qué resuelve, sus tablas, de quién depende, lo que hace paso a paso y sus reglas de seguridad.
- **Permisos**, con las tablas del paso 6.
- **Palabras del negocio.**
- **Puertas abiertas.**

Corregí también lo que el núcleo ya decía y acá cambió (por ejemplo, la versión 1). El núcleo muestra el modelo de datos y el mapa de pantallas con sus dibujos.

### 10. Dibujar

Con la skill `dibujar`. Los tres archivos de datos llevan la misma lista `"modulos"`, en el mismo orden, para que cada módulo tenga el mismo color en los tres.

**El modelo de datos**, en `Backend/Estructura/Modelo de datos`. Una flecha entre dos colores es una dependencia entre módulos: revisá que coincidan con las del paso 5. Si una tabla está en casi todas (la empresa, cuando la app la usan varias), nombrala en `sinFlecha`: sus claves llevan la pastilla y no la flecha.

**El mapa de pantallas, en borrador**, en `Frontend/Pantallas/Mapa de pantallas`. Una caja por pantalla, con su nombre y lo que se hace en ella. Sirve para descubrir lo que nadie nombró: si aparece una pantalla sin módulo, o un módulo sin pantalla que debería tenerla, volvé al paso 2 y preguntá. La base y los mails no tienen pantalla, y está bien. El diseño fino de cada pantalla se hace en su spec, justo antes de construirla.

**El roadmap general**, en la raíz de la bóveda. Es el único lugar donde vive el orden de las specs. Mostralo en `Inicio.md` con `![[Roadmap general.svg]]`.

- La primera fila es la base del sistema, e incluye publicarla. Desde ahí, cada fila que se cierra queda disponible para mostrar.
- Se construye de a rebanadas: cada fila lleva el backend de algo que una persona puede usar y, al lado, su pantalla. Así siempre hay algo que se puede probar de punta a punta.
- El nombre de cada fila es corto, de hasta tres palabras: se escribe dentro de los carteles de las filas que la necesitan.
- Lo que necesita cada cartel (`necesita`) nombra otras filas. Toda fila necesita a la base del sistema, directo o a través de otra: la que no necesita a ninguna otra, nombra a la base.
- Cada fila dice su módulo, lo que deja funcionando (`deja`) y su tamaño:
  - `chico`: hasta dos días.
  - `mediano`: hasta una semana.
  - `grande`: hasta dos semanas. Si pasa de eso, partí la fila.
- `version1Hasta` es la última fila que hace falta para la versión 1 del núcleo. Las filas de la versión 1 van primero.
- Si la app tiene web y mobile, el roadmap general lleva el backend y la web, y el mapa de pantallas es el de la web. Lo de mobile no se dibuja ahora: lo arma `/iniciar-mobile`. Las tablas y los permisos sí se piensan desde ahora para los dos.

Mirá los tres dibujos como imagen antes de seguir.

### 11. Resumen

Mostrá:

- Los módulos, cada uno en una línea.
- Las puertas abiertas, cada una en una línea.
- Cuántas filas tiene la versión 1, y cuántas de cada tamaño.
- Lo que quedó al límite de alguna regla, si hay algo.
- Las preguntas al cliente que frenan algo.
- La primera spec, lista para copiar en una sesión nueva:

```text
/spec <nombre de la primera fila>: <lo que deja funcionando>
```

Antes del resumen, un commit en la bóveda con lo que cambió.
