# skills-proyectos

Ocho skills para llevar un proyecto de software desde la idea hasta que está terminado, con Claude Code. Están escritas en castellano rioplatense, cortas, y cada regla dice por qué existe.

La idea de fondo: **se decide antes de programar, se programa de a un paso, y nada se da por hecho sin evidencia.** Lo que se decide queda escrito en una bóveda de Obsidian, y lo que se programa queda en una rama por spec, con un commit por paso.

## El flujo

```text
/iniciar-proyecto → /modulos → /spec → /spec-impl → /cerrar-spec      (/estado, en cualquier momento)
/iniciar-mobile, cuando el roadmap general está completo y la app tiene mobile
```

| Comando | Qué hace | Modelo y esfuerzo |
|---|---|---|
| `/iniciar-proyecto` | Analiza la idea, pregunta lo que falta, cierra las decisiones caras de cambiar (datos sensibles, quién entra, dónde se publica), crea la bóveda y su núcleo. | Fable 5.2, alto |
| `/modulos` | Define los módulos con alta cohesión y bajo acoplamiento: tablas, permisos, puertas abiertas y palabras del negocio. Dibuja el modelo de datos, el mapa de pantallas y el roadmap. | Fable 5.2, alto |
| `/spec` | Escribe la spec de una función antes de programarla: pregunta lo que no está definido y guarda la spec, sus tareas y sus criterios. | Fable 5.2, alto |
| `/spec-impl` | Implementa una spec aprobada, de a un paso: tests primero, revisión, el diff de ese paso, prueba en el navegador y un commit. | Opus 5.5, alto (extra alto si la spec es sensible) |
| `/cerrar-spec` | Comprueba cada criterio con evidencia, rompe el código a propósito para ver que cada test falla, revisa código, seguridad y convenciones, y une la rama. | Fable 5.2, alto |
| `/iniciar-mobile` | Arma la parte mobile cuando la web ya está. | Opus 5.5, alto |
| `/estado` | Dice en qué punto está el proyecto y qué comando conviene correr ahora. Solo lee. | Haiku 5.5, bajo |
| `dibujar` | Genera los dibujos de la bóveda como SVG, a partir de un archivo de datos. La usan las demás. | — |

La regla: **Fable decide y revisa, Opus programa, Haiku lee.** Los modelos son una recomendación. Cada comando avisa en su primera línea si estás usando otro, y seguís igual. Conviene una sesión por comando, o un `/clear` entre uno y otro.

## Cómo se instalan

```bash
npx skills@latest add ByteLab-dev-ar/skills-proyectos
```

Para instalarlas en todos tus proyectos y no solo en el actual, sumá `-g`. Con `-l` ves cuáles hay sin instalar nada. Es el instalador de [vercel-labs/skills](https://github.com/vercel-labs/skills).

**Instalá las ocho.** `estado` usa un script de `dibujar`, y los demás comandos se nombran entre sí.

Sin `npx`, copiando las carpetas a `~/.claude/skills/` (o a `.claude/skills/` de un proyecto):

```bash
git clone https://github.com/ByteLab-dev-ar/skills-proyectos
cp -r skills-proyectos/skills/* ~/.claude/skills/
```

## Antes de usarlas: editá tus preferencias

`skills/iniciar-proyecto/preferencias.md` es lo único que cambia de una persona a otra. Dice:

- en qué carpeta se guardan las bóvedas,
- con qué tecnologías trabajás siempre (acá: NestJS, PostgreSQL con TypeORM, Next.js con HeroUI, Expo),
- cómo escribís el código: idioma, carpetas de cada módulo, dónde van los tests, cómo se valida lo que entra,
- dónde publicás.

Las skills parten de ahí. Si tu stack es otro, cambiá ese archivo y vas a tener las mismas skills con tus reglas. Instaladas con `-g`, está en `~/.claude/skills/iniciar-proyecto/preferencias.md`.

## Qué necesitan

- **Claude Code.**
- **Node.** Los dibujos son scripts de Node sin dependencias.
- **Git.** Y `gh` si querés que el cierre abra el pull request y espere al CI.
- **Obsidian**, con el plugin Tasks, para leer la bóveda. Los dibujos son SVG y se ven sin ningún plugin.
- **Otras skills, opcionales.** Las usan en algunos pasos: `obsidian-markdown`, `code-review` y `security-review`, y para el frontend `react-next-practicas` y `heroui-react`. Si falta alguna, la skill lo dice y consulta la documentación del stack.

## Las reglas que más pesan

- **Tres tamaños de trabajo.** Un arreglo (menos de 15 minutos, no cambia lo que el sistema acepta, devuelve o guarda) se hace en el momento. Un cambio chico (hasta medio día) es una tarea. Todo lo demás es una función y necesita una spec aprobada. Las listas de pendientes son para lo que espera al cliente, no para lo que se puede arreglar hoy.
- **Una rama por spec, un commit por paso.** El diff que se revisa es solo el del paso, no miles de líneas de specs anteriores.
- **Los tests no se creen: se rompen.** `/cerrar-spec` rompe el código a propósito, un sabotaje por cada lugar que hace falta para cumplir un criterio, y exige que el test falle. Un test que sigue en verde no prueba lo que dice.
- **Probar como una persona.** Antes de pedirte que pruebes, `/spec-impl` recorre la app en el navegador, siguiendo varias pantallas seguidas. Los errores de navegación aparecen ahí y no en los casos sueltos.
- **No se reinventa lo que el stack ya trae.** Una validación se hace con el decorador de la librería, una contraseña con `argon2id`. Lo que toca la seguridad no se envuelve a mano.
- **El estado se calcula, no se escribe.** El roadmap es un archivo de datos y el script que lo dibuja es el mismo que lo cuenta en texto, así que el dibujo y `/estado` no pueden decir cosas distintas.

## Qué está probado y qué no

Se probaron de punta a punta con una app de turnos para una peluquería: `/iniciar-proyecto`, `/modulos` y cinco specs, hasta tener un login con su pantalla, con 138 tests de la API y 35 de punta a punta.

No está probado:

- **`/iniciar-mobile`.** Nunca se corrió.
- **El cierre con pull request y CI en GitHub.** La prueba no tenía remoto, así que usó la unión local con git. Los comandos de `gh` se comprobaron contra su documentación, no contra un repo real.
- **Arrancar la app sin ningún `.env`.** Una regla de permisos de quien las probó no deja que Claude los toque.

## Créditos

Nacen de las ideas de [fernando-skills](https://github.com/Klerith/fernando-skills) de Fernando Herrera (MIT) y de [superpowers](https://github.com/obra/superpowers), reescritas desde cero.

## Licencia

MIT. Ver `LICENSE`.
