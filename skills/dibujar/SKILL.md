---
name: dibujar
description: Genera los dibujos de la bóveda (roadmap general, modelo de datos, mapa de pantallas y arquitectura) como archivos SVG a partir de un archivo de datos. Usala siempre que haya que crear o actualizar uno de esos dibujos.
---

# Dibujar

Cada dibujo es un archivo de datos (JSON) más un script que lo convierte en SVG. Nunca escribas ni edites un SVG a mano: se cambia el dato y se vuelve a generar. Así el dibujo no puede decir algo distinto de los datos, y actualizarlo cuesta una línea.

Hace falta Node (`node --version`). No hace falta Obsidian abierto ni ningún plugin: Obsidian muestra los SVG como imágenes.

## Cómo se hace

1. Escribí o cambiá el archivo de datos. Vive al lado del dibujo, con el mismo nombre: `Roadmap general.json` y `Roadmap general.svg`.
2. Generá el dibujo con el script que está en la carpeta de esta skill:

   ```bash
   node "<carpeta de esta skill>/roadmap-general.js" "Roadmap general.json" "Roadmap general.svg"
   ```

3. Si el script corta con un error, el mensaje dice qué dato está mal (una flecha a algo que no existe, un tipo desconocido). Corregí el dato, no el script.
4. **Miralo antes de entregarlo.** Pasalo a imagen (en Mac: `sips -s format png "dibujo.svg" --out /tmp/dibujo.png`) y abrila. Buscá texto que se sale de su caja y flechas que cruzan una caja.
5. La nota que lo muestra lo embebe: `![[Roadmap general.svg]]`.

## Los dibujos

| Dibujo | Script | Dónde va en la bóveda | Cuándo se genera |
|---|---|---|---|
| Roadmap general | `roadmap-general.js` | En la raíz | En `/modulos`, y cada vez que se escribe o se cierra una spec |
| Modelo de datos | `modelo-datos.js` | `Backend/Estructura/` | En `/modulos`, y cuando una spec cambia tablas |
| Mapa de pantallas | `mapa-pantallas.js` | `Frontend/Pantallas/` (y `Mobile/Pantallas/`, el de mobile) | En `/modulos` (el de mobile, en `/iniciar-mobile`), y cuando se agrega una pantalla |
| Arquitectura | `arquitectura.js` | `Proyecto/` | En `/iniciar-proyecto`; casi nunca cambia |
| Roadmap mobile | `roadmap-general.js` | En la raíz | En `/iniciar-mobile`, y cada vez que se escribe o se cierra una spec de mobile |

No hay más dibujos que estos. Cada dibujo de más es algo que hay que mantener al día.

## Los colores

- En el roadmap, el color dice el estado: azul lo hecho, y rojo suave lo que falta (lo que sigue, lo que está por hacer y lo frenado). El módulo de cada fila queda en el archivo de datos, pero no se pinta.
- En el modelo de datos y el mapa de pantallas, el color dice el módulo. Los dos archivos llevan la misma lista `"modulos"` que el roadmap, en el mismo orden: por eso cada módulo tiene el mismo color en los dos.
- Siempre colores pastel, con bordes suaves: un borde oscuro sobre muchas cajas cansa la vista.
- En la arquitectura, el color dice el tipo de parte.

## Los datos de cada dibujo

La carpeta `ejemplos/` tiene un archivo completo de cada uno, con una app de recibos de sueldo. Copiá su forma.

### Roadmap general

```json
{
  "titulo": "Recibos · Roadmap general",
  "modulos": ["Base", "Acceso", "Mails"],
  "version1Hasta": "Recuperar contraseña",
  "filas": [
    { "nombre": "Login", "modulo": "Acceso", "tamano": "mediano",
      "deja": "Se puede registrar un usuario y entrar con su contraseña.",
      "backend": { "spec": 2, "hecha": true }, "pantalla": {} }
  ]
}
```

- Las filas van en el orden en que se construyen. Este archivo es el único lugar donde vive ese orden.
- Cada fila lleva `backend`, `pantalla` o las dos. Una fila que es de todo el proyecto (la base del sistema) lleva `unico`.
- Dentro de cada cartel: `spec` (su número, desde que `/spec` la escribe), `hecha: true` (cuando `/cerrar-spec` la cierra), `necesita` (nombres de otras filas) y `frenada` (el motivo, si espera al cliente).
- `necesita` se cumple cuando esa otra fila tiene hecho su backend, o su cartel único.
- `tamano`: `chico`, `mediano` o `grande`. `deja`: lo que una persona va a poder hacer cuando la fila esté hecha. No se dibuja; lo lee `/estado`.
- `version1Hasta`: el nombre de la última fila de la versión 1. Dibuja la línea de corte.
- `base`: solo en el roadmap mobile. Nombra el archivo del roadmap general (`"base": "Roadmap general.json"`). Con eso, `necesita` nombra filas del roadmap general, y cada pantalla sabe si su backend ya está hecho.
- **El estado no se escribe.** El script calcula qué está hecho, qué espera y cuál es el único "sigue".

### Modelo de datos

```json
{
  "titulo": "Recibos · Modelo de datos",
  "modulos": ["Base", "Acceso", "Mails"],
  "tablas": [
    { "nombre": "usuario", "modulo": "Acceso", "columnas": [
      { "nombre": "id", "tipo": "uuid", "pk": true },
      { "nombre": "empresa_id", "tipo": "uuid", "fk": "empresa" },
      { "nombre": "apodo", "tipo": "text?" } ] }
  ],
  "notas": ["Un solo usuario por mail (índice único)."]
}
```

- `fk` es el nombre de la tabla a la que apunta. `?` al final del tipo quiere decir que puede quedar vacío.
- `notas`: las reglas que no se ven en las tablas (índices únicos, valores permitidos).
- `sinFlecha`: tablas a las que apuntan casi todas, como la empresa (`"sinFlecha": ["empresa"]`). Sus claves llevan la pastilla FK pero no la flecha, y el dibujo lo aclara solo. El archivo declara igual todas las claves.
- Sale de las entidades y migraciones reales cuando ya hay código. Una flecha entre dos colores es una dependencia entre módulos.

### Mapa de pantallas

```json
{
  "titulo": "Recibos · Mapa de pantallas",
  "modulos": ["Base", "Acceso", "Mails"],
  "secciones": [
    { "nombre": "Web · la usa la empresa", "pantallas": [
      { "nombre": "Login", "modulo": "Acceso", "hace": "entra con mail y contraseña", "va": ["Inicio"] },
      { "nombre": "Inicio", "modulo": "Base", "hace": "resumen del mes" } ] }
  ]
}
```

- Una sección por cada entrada distinta a la app (por ejemplo, la empresa y el empleado). La primera pantalla de cada sección es por donde se entra.
- `va`: las pantallas que se abren desde esta. No pongas las flechas de "volver": el script no las dibuja.

### Arquitectura

```json
{
  "titulo": "Recibos · Arquitectura",
  "capas": [
    { "nombre": "El sistema", "tipo": "sistema", "partes": [
      { "nombre": "API", "detalle": "NestJS", "candado": "separa los datos de cada empresa" } ] }
  ]
}
```

- Las capas van de arriba abajo: lo que usa la persona, el sistema, y donde se guarda.
- Tipos: `persona`, `sistema`, `datos` y `afuera` (servicios de otros). Una parte puede tener un tipo distinto al de su capa.
- `candado`: una decisión cara de cambiar que cae en esa parte.

## Límites conocidos

- El ancho de los textos se estima por cantidad de letras. Un nombre muy largo puede salirse: acortalo.
- En el modelo de datos, con muchas tablas una flecha larga puede cruzar otra tabla. Probá primero con `sinFlecha`; si sigue, cambiá el orden de las tablas en el archivo.

## El estado en texto

El script del roadmap también dice el estado del proyecto en texto, con la misma cuenta que usa para dibujar. Lo usa `/estado`:

```bash
node "<carpeta de esta skill>/roadmap-general.js" --estado "Roadmap general.json"
```
