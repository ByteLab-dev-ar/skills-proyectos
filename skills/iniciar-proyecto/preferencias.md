# Preferencias

Este archivo es lo único que cambia de una persona a otra. Editalo antes de usar la skill.

## Dónde se guardan las bóvedas

`~/Documents/Bovedas/`

## Tecnologías de siempre

- **Backend:** NestJS, PostgreSQL con TypeORM, class-validator con class-transformer para validar los DTO, pnpm, Vitest.
- **Contraseñas:** `@node-rs/argon2` (argon2id, con sus valores por defecto). Nunca un hash escrito a mano, ni `bcrypt`.
- **Datos sensibles:** el nivel de protección de cada dato se decide al arrancar el proyecto (ver `/iniciar-proyecto`). Lo que solo se compara (una contraseña) se hashea. Lo que hay que volver a leer (un DNI, un dato médico) se cifra con AES-256-GCM, con la llave fuera de la base.
- **Web:** Next.js (App Router) con HeroUI, TanStack Query, react-hook-form con Zod para los formularios, Playwright para los tests de punta a punta.
- **Mobile:** Expo con HeroUI Native.
- **Archivos:** un bucket tipo S3 (Cloudflare R2), si la app guarda archivos.
- **Mails:** Resend, si la app manda mails.

## Convenciones de código

`/iniciar-proyecto` las copia al `CLAUDE.md` del proyecto. Las siguen `/spec` y `/spec-impl`, y las revisa `/cerrar-spec`.

### Idioma

- **En inglés, todo el código:** carpetas, archivos, clases, funciones, variables, tablas y columnas, rutas de la API, campos del JSON y nombres de comandos.
- **En castellano, lo que lee una persona:** los mensajes que muestra la app, las rutas de las páginas de la web, los comentarios, los nombres de los tests, los commits y la bóveda.
- Cada palabra del negocio tiene un solo nombre en el código. La lista está en el núcleo, en "Palabras del negocio".

### Backend (NestJS)

Una carpeta por módulo. En su raíz, solo el módulo, el controlador y el servicio. Lo demás va en subcarpetas, que se crean recién cuando hacen falta:

```text
src/<module>/
  <module>.module.ts
  <module>.controller.ts
  <module>.service.ts
  dto/          lo que entra y lo que sale
  entities/     las tablas
  guards/
  decorators/
  validators/   reglas que la librería no trae
  cli/          comandos que se corren a mano
  utils/
  test/         los tests del módulo
src/test/       los tests de toda la app y de los ayudantes
src/common/     lo que usan varios módulos
src/config/     variables de entorno
src/database/   conexión y migraciones
test/           preparación y ayudantes de los tests, sin tests adentro
```

- **Validación:** toda entrada se valida con un DTO de class-validator, también la de un comando. Una regla que la librería no trae va como decorador propio en `validators/`. Sin funciones de validación sueltas. Un texto que va a la base no acepta el carácter nulo: Postgres lo rechaza y la API contestaría 500.
- **Antes de escribir algo a mano,** buscá si lo resuelve el framework o una librería ya instalada, o la que ya usás en otro proyecto de las preferencias.
- **Lo que toca la seguridad** (contraseñas, tokens, cifrado) no se envuelve a mano: se usa la librería del stack.
- **Una dependencia nueva** se propone con su motivo antes de instalarla.
- **Decoradores propios, los menos posibles:** primero los que trae la librería (`@Length`, `@IsEmail`, `@IsTimeZone`, `@Matches`), con su mensaje en castellano si lo lee una persona.

### Web (Next.js) y mobile (React Native)

Los mismos módulos que el backend, con los mismos nombres.

```text
src/app/                 solo rutas: cada page.tsx devuelve una view
src/<module>/
  <screen>/              una carpeta por pantalla, si el módulo tiene más de una
    views/               la pantalla: arma, no decide. Hasta unas 100 líneas
    components/          las piezas de esa pantalla
    hooks/               toda la lógica: pedidos, formularios, estado
    schemas/             esquemas de Zod de los formularios
    utils/
    test/
  components/            lo que comparten las pantallas del módulo
  hooks/
src/common/              lo que usan varios módulos: components, hooks, utils
e2e/                     tests de punta a punta
```

- Un módulo con una sola pantalla lleva `views/`, `components/` y `hooks/` directo, sin la carpeta de la pantalla.
- La web puede tener un módulo que el backend no tiene, cuando es solo de pantalla: por ejemplo, la carcasa del panel, donde después viven las pantallas de los demás módulos.
- Las carpetas se crean recién cuando hacen falta. `styles/` casi nunca aparece, con Tailwind. `stores/` aparece con el primer store de Zustand.
- **Dónde vive cada estado:** lo que viene de la API, en TanStack Query, dentro de un hook. Los filtros y la página, en la URL. Lo de un solo componente, en `useState`. Lo que cruza pantallas y no viene de la API, en Zustand. Sin carpeta `reducers`: un `useReducer` va dentro de un hook.
- Los formularios, con react-hook-form y un esquema de Zod.
- **Lo sensible no sobrevive a su uso.** Un formulario con una contraseña se vacía apenas se manda bien, y al salir no queda en la página nada de quien estaba antes. Next conserva el estado de una página cuando se navega a otra: sin esto, al volver aparece lo que se había escrito.
- **Tests:** cada pantalla se prueba de punta a punta con Playwright, en `e2e/`: entrar, llenar, apretar y ver el resultado, como lo haría una persona. Un hook o una utilidad con lógica propia lleva además su test en `test/`. No se escribe un test por componente. Además de un caso por estado, cada pantalla lleva un test del recorrido completo en la misma página, sin recargar entre pasos: los errores de navegación aparecen ahí y no en los casos sueltos. Y los tests fallan si la página escribe un error en la consola.
- **Skills del stack:** antes de escribir una pantalla se cargan `react-next-practicas` y `heroui-react`.

### Siempre

- Un solo formateador y una sola configuración para todo el repo, en la raíz.
- El proyecto tiene en la raíz un comando para cada control: `test`, `lint`, `typecheck`, `format:check` y `build`. Los arma la spec de la base del sistema.
- Los cinco pasan antes de mostrar un paso.
- Los tests de punta a punta tienen su propio comando, `test:e2e`, porque compilan la web y abren un navegador. Es el sexto control: se corre al terminar cada paso que toca la web, y siempre al cerrar una spec.

## Dónde publico

- **Dónde corre:** un servidor propio (VPS) con Docker Compose. El backend, la web y la base de datos viven en el mismo servidor.
- **Entrada y HTTPS:** Nginx adelante, con certbot para los certificados.
- **Respaldo de la base:** una copia diaria fuera del servidor, en Cloudflare R2.
- **Cuentas:** son mías (servidor, dominio, mails, respaldos) y le cobro un abono mensual al cliente.
- **Proveedor del servidor:** sin definir. Completalo cuando lo elijas.

`/iniciar-proyecto` parte de acá para preguntar dónde va a correr cada app.
