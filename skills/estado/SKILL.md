---
name: estado
description: Dice en qué punto está el proyecto. Muestra qué funciona, qué está en curso, qué sigue, qué se puede hacer ya, qué espera y cuánto falta para la versión 1, y el comando que conviene correr ahora. Solo lee; no cambia nada. Usala cuando el usuario pregunta en qué está el proyecto o qué sigue.
effort: low
allowed-tools: Read, Glob, Grep, Bash(node:*), Bash(ls:*), Bash(git status:*), Bash(git branch:*)
---

# /estado

Dice en qué punto está el proyecto de la carpeta actual. **Solo lee: no cambia ningún archivo.**

## Modelo y esfuerzo

Este comando lee y resume: en una sesión nueva alcanza con **Haiku 5.5 y esfuerzo bajo**. Si la sesión ya está en otro modelo, no pidas cambiarlo: cambiar a mitad de sesión sale más caro que seguir.

## Pasos

### 1. Encontrar la bóveda

Está en la línea `**Specs:**` del `CLAUDE.md` del proyecto. Si no hay línea, el proyecto todavía no se inició: decilo, nombrá `/iniciar-proyecto` y pará.

### 2. Leer el roadmap

El estado no se calcula a ojo: lo da el mismo script que dibuja el roadmap. Está en la skill `dibujar`, que vive al lado de esta:

```bash
node "<carpeta de esta skill>/../dibujar/roadmap-general.js" --estado "<bóveda>/Roadmap general.json"
```

Si existe `Roadmap mobile.json`, corré lo mismo con ese archivo.

Si no hay `Roadmap general.json`, los módulos todavía no se definieron: decilo, nombrá `/modulos` y pará.

### 3. Ver qué está en curso

- **Las specs abiertas.** Buscá la línea `> **Estado:**` en las specs de `Backend/Specs/`, `Frontend/Specs/` y `Mobile/Specs/`. Importan las que están en `Borrador` o `Aprobado`.
- **De una spec en `Aprobado`,** mirá su `Tareas spec NN.md`: cuántas tareas están tildadas, de cuántas hay.
- **La rama del repo** (`git branch --show-current`): si se llama `spec-NN-…`, esa spec se está implementando.
- **Las preguntas al cliente** marcadas con 🔺 que siguen abiertas, en `Cliente/Preguntas al cliente.md`.
- **Los pendientes:** cuántos hay en `Proyecto/Pendientes.md`.

### 4. Contestar

Corto, en este orden. Salteá el bloque que esté vacío.

1. **Una línea** con lo que más importa: cuánto falta para la versión 1, o que ya está completa.
2. **Funciona:** lo que una persona ya puede hacer, tal como lo dice el roadmap.
3. **En curso:** la spec abierta, su estado y por qué paso va.
4. **Sigue.**
5. **Se puede hacer ya.**
6. **Espera,** y qué necesita cada cosa.
7. **Frenado por el cliente,** con la pregunta que lo frena.
8. **El comando que conviene correr ahora,** uno solo, listo para copiar:

| Lo que encontraste | El comando |
|---|---|
| Una spec en `Borrador` | Ninguno: falta que el usuario la relea y la pase a `Aprobado` |
| Una spec en `Aprobado` con tareas sin tildar | `/spec-impl NN` |
| Una spec en `Aprobado` con todas las tareas tildadas | `/cerrar-spec NN` |
| Ninguna spec abierta | `/spec <la fila que sigue>` |
| El roadmap general completo, el núcleo dice que hay mobile y no existe `Roadmap mobile.json` | `/iniciar-mobile` |

## Reglas

- **No inventes.** Decí solo lo que está en los archivos. Si dos archivos no coinciden (por ejemplo, una spec en `Implementado` que el roadmap no marca como hecha), mostralo: es un error que hay que arreglar, no algo para suavizar.
- **No cambies nada**, ni siquiera para arreglar eso. Decí qué comando lo arregla.
- **Sin vueltas.** Quien pregunta quiere saber dónde está y qué hacer ahora.
