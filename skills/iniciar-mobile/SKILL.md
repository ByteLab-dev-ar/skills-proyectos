---
name: iniciar-mobile
description: Arranca la parte mobile de un proyecto que ya tiene su backend. Pregunta qué pantallas tiene la app mobile, crea la carpeta Mobile de la bóveda, dibuja su mapa de pantallas y su roadmap. Se corre cuando el roadmap general está completo, o antes si el usuario lo pide.
disable-model-invocation: true
effort: high
argument-hint: 'vacío, o lo que el usuario ya sabe de la app mobile'
---

# /iniciar-mobile

Arranca la parte mobile del proyecto de la carpeta actual. Lo que el usuario ya sabe de la app mobile: `$ARGUMENTS`.

No se corre al empezar el proyecto, a propósito: mientras se construyen el backend y la web, lo de mobile no hace falta, y dibujarlo antes es gastar en algo que va a cambiar. Cuando llega el momento, el backend ya existe y todo sale con datos reales.

**Lo que no hace:** no escribe código ni crea el proyecto de la app. Eso es la primera spec de mobile.

## Modelo y esfuerzo

Este comando está pensado para **Opus 5.5 con esfuerzo alto**. Antes de nada, fijate con qué modelo estás corriendo. Si no es ese, decilo en la primera línea y seguí: el usuario decide si cambia. El esfuerzo del encabezado vale solo para la primera respuesta, así que recordale que lo deje en alto para toda la sesión.

## Pasos

Una decisión por pregunta, con tu recomendación primero. Lo que el usuario no sabe del negocio va a `Cliente/Preguntas al cliente.md`; no se inventa.

### 1. Leer

- El `CLAUDE.md` del proyecto y el núcleo: la decisión sobre mobile, los módulos, los permisos y las palabras del negocio.
- `Roadmap general.json`: qué backend está hecho y qué falta.
- El mapa de pantallas de la web, si existe.
- `preferencias.md` de la skill `iniciar-proyecto`: con qué se hace la app mobile.

### 2. Comprobar dónde estamos

- Si el núcleo no dice que la app tiene mobile, avisá: es una decisión que no se tomó al arrancar. Preguntá si se suma, y anotala en el núcleo. Decí también qué del backend ya hecho habría que revisar, empezando por el login.
- Si al roadmap general le faltan filas, mostralas. Se puede seguir igual, pero las pantallas que dependan de ese backend van a quedar esperando.
- Si ya existe `Mobile/` o `Roadmap mobile.json`, preguntá antes de tocar nada.

### 3. Preguntar

En bloques de 3 a 5 preguntas, esperando la respuesta antes del siguiente.

- **Quién la usa.** Qué tipos de usuario entran por la app mobile. No siempre son los mismos que en la web.
- **Qué pantallas tiene.** Proponé una lista a partir de los módulos y los permisos, y preguntá qué sobra y qué falta. La app mobile no tiene por qué repetir la web.
- **Lo propio del teléfono.** Avisos al teléfono, cámara, uso sin conexión. Cada uno que se sume es trabajo: preguntá si entra ahora o queda para después.
- **Dónde se publica.** En qué tiendas, con qué cuentas y quién las paga.
- **Lo que no hace, por ahora.**

Si algo que piden necesita backend nuevo (por ejemplo, mandar avisos al teléfono), decilo: es una fila nueva del roadmap general, no del mobile. Preguntá dónde entra.

### 4. Crear la carpeta `Mobile/` en la bóveda

Con la skill `obsidian-markdown`:

```text
Mobile/
  Pantallas/     el mapa de pantallas de mobile y una ficha por pantalla
  Diseño/        diseño, componentes, y textos y mensajes
  Técnico/       navegación, datos y sesión, permisos del teléfono, publicación y tests
  Specs/         una carpeta por spec
```

- Las subcarpetas arrancan vacías, sin notas. Cada nota la crea `/cerrar-spec` cuando hay código del que sacarla: una nota vacía no dice nada y hay que mantenerla.
- Sumá `Mobile/` al reglamento de la bóveda (su `CLAUDE.md`).
- La numeración de las specs sigue siendo una sola para todo el proyecto.

### 5. Dibujar el mapa de pantallas de mobile

Con la skill `dibujar`, en `Mobile/Pantallas/Mapa de pantallas`. Una caja por pantalla, con su nombre y lo que se hace en ella. Usá la misma lista `"modulos"` que el roadmap general, para que cada módulo tenga el mismo color.

Si aparece una pantalla que no tiene módulo, volvé al paso 3 y preguntá.

### 6. Dibujar el roadmap mobile

Con la skill `dibujar`, en la raíz de la bóveda: `Roadmap mobile.json` y `Roadmap mobile.svg`. Usa el mismo script que el roadmap general.

- Lleva `"base": "Roadmap general.json"`. Con eso, lo que cada fila pone en `necesita` son filas del roadmap general, y el dibujo sabe solo qué backend ya está hecho.
- Una fila por pantalla, o por grupo de pantallas que se prueban juntas. Cada fila lleva solo `pantalla`.
- La primera fila es la base de la app mobile: el proyecto creado, con la navegación, y publicado para probar en un teléfono.
- Cada fila dice su módulo, lo que deja funcionando (`deja`) y su tamaño: `chico` hasta dos días, `mediano` hasta una semana, `grande` hasta dos semanas. Si pasa de eso, partí la fila.
- Si hay una primera versión de la app mobile, marcala con `version1Hasta`.

Mostralo en `Inicio.md`, debajo del roadmap general: `![[Roadmap mobile.svg]]`. Miralo como imagen antes de seguir.

### 7. Escribir en el núcleo

Sumá a `Proyecto/Núcleo.md` una sección **App mobile**: quién la usa, qué pantallas tiene, lo propio del teléfono que entra, dónde se publica y lo que no hace por ahora.

### 8. Resumen

Mostrá:

- Lo que quedó creado, con sus rutas.
- Las pantallas, cada una en una línea.
- Lo que quedó esperando backend, y qué fila del roadmap general necesita.
- Las preguntas al cliente que frenan algo.
- La primera spec, lista para copiar en una sesión nueva:

```text
/spec <nombre de la primera fila del roadmap mobile>: <lo que deja funcionando>
```
