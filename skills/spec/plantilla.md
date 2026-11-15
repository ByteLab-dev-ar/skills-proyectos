# La forma de una spec

Esto es lo que consulta `/spec` al escribir. No es texto para copiar: es la forma que la spec tiene que respetar. Los ejemplos son de una app de recibos de sueldo, con los nombres en castellano para que se lean fácil. En la spec, los nombres del código van como digan las convenciones del proyecto.

## Encabezado

```markdown
> **Estado:** Borrador
> **Fecha:** AAAA-MM-DD
> **Módulo:** Recibos
> **Depende de:** SPEC 03, SPEC 05
> **Sensible:** sí — toca los permisos de quién ve cada recibo
> **Objetivo:** Una sola oración.
> **Deja funcionando:** Lo que una persona va a poder hacer cuando esté cerrada.
```

- **Sin título `#`:** el nombre del archivo (`Spec NN - <Nombre>`) ya lo dice, y Obsidian lo muestra arriba.
- **Estados:** `Borrador`, `Aprobado`, `Implementado`, `Obsoleto`. `Aprobado` lo pone el usuario; `Implementado`, solo `/cerrar-spec`.
- **Objetivo:** se lee en cinco segundos y se entiende qué se va a construir. Si hacen falta dos oraciones, la función es muy grande.
- **Deja funcionando:** sale de la fila del roadmap. Es lo que se va a poder probar de punta a punta. Si la fila promete algo que recién se ve con specs posteriores, decí qué parte deja lista esta.
- **Sensible:** `sí` si toca una decisión cara del núcleo, dinero, datos sensibles o permisos, con el motivo en pocas palabras. Si no, `no`. `/spec-impl` lo lee para pedir más esfuerzo.

## Por qué existe (opcional)

Solo si la spec toma una decisión que no es obvia o rompe una costumbre del proyecto. El porqué, no el qué.

## Alcance

Dos listas, las dos obligatorias.

```markdown
## Alcance

**Entra:**

- La empresa sube un PDF por empleado y por mes.

**No entra (por ahora):**

- Subir todos los recibos juntos en un archivo comprimido.
```

"No entra" guarda lo que se nombró en las preguntas y se decidió dejar para después. Es para funciones, no para arreglos: un arreglo que aparece al programar se arregla en el momento.

## Modelo de datos

Las tablas y campos que aparecen o cambian, con sus nombres reales y el módulo dueño de cada tabla. Si la spec no trae datos nuevos, decilo: "Esta spec no agrega datos. Usa las tablas de SPEC 03."

## Pantallas (solo en specs de pantalla)

Para cada pantalla: qué muestra y cómo se ve en sus cuatro estados (cuando anda, cuando falla, cuando está vacía y mientras carga). El diseño fino se decide acá, justo antes de construirla.

## Plan de implementación

Pasos numerados. Cada paso deja el sistema andando.

```markdown
## Plan de implementación

1. Crear la tabla `recibo` y su migración. Test: la migración corre y vuelve atrás.
2. Agregar `POST /api/recibos`. Tests: guarda el recibo; rechaza a quien no es de la empresa.
```

- Cada paso se puede guardar en un commit por sí solo.
- Un paso es una sola cosa, que se revisa en diez minutos. Si mezcla dos, partilo. Lo que escribe un generador (`nest new`, `create-next-app`) no cuenta.
- Cada paso nombra sus archivos con la carpeta donde van, según las convenciones del proyecto.
- Cada paso nombra sus tests y qué prueban. Si no se puede automatizar, nombra su prueba a mano.
- Las pruebas a mano de una API las corre Claude con sus herramientas, nunca el usuario. Se escriben como qué pedidos hacer y qué tiene que devolver cada uno ("entrar como empleado y pedir `GET /api/recibos`: 200, solo con sus recibos"). Van contra una base de prueba, nunca la de desarrollo.
- El último paso no es "probar todo": para eso están los criterios.

## Criterios de aceptación

Una lista de casillas. Cada una se contesta con sí o no.

```markdown
## Criterios de aceptación

- [ ] Un empleado ve solo sus recibos.
- [ ] Subir dos veces el recibo del mismo mes reemplaza el anterior.
```

- Mal: "Que funcione bien", "Buena experiencia", "Sin errores".
- Bien: "Al apretar Firmar sin contraseña, se muestra el mensaje 'Escribí tu contraseña'."

## Decisiones

Lo que se eligió y lo que se descartó, cada cosa con su motivo. Es la sección que más sirve tres meses después.

```markdown
## Decisiones

- **Sí:** un PDF por empleado. Es como los entrega hoy el estudio contable.
- **No:** generar el PDF en la app. Va en otra spec, si alguna vez hace falta.
```

## Riesgos (opcional)

Solo si hay alguno que no es obvio. Una tabla: el riesgo y qué se hace si pasa.

## Reglas de todo el documento

- Una idea por oración.
- Nombres concretos: el archivo, la ruta, el texto exacto del mensaje.
- Sin "por definir". Si algo no se decidió, se pregunta antes de escribir.
- Sin código largo. La spec describe; el código se escribe después.
- Las mismas palabras del negocio que el núcleo.
