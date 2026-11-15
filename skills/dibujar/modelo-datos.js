#!/usr/bin/env node
// Genera el modelo de datos (SVG): una tabla por bloque y una flecha de cada clave foránea a su clave primaria.
// Uso:    node modelo-datos.js datos.json salida.svg
// Prueba: node modelo-datos.js --test
const assert = require('assert');
const { TINTA, APAGADO, esc, colores, flecha, leyendaModulos, marco, consola } = require('./comun');

const ANCHO = 230;
const CABEZA = 36;
const RENGLON = 28;
const SEP_X = 70;
const SEP_Y = 24;
const Y0 = 100;
const PASTILLA = { PK: ['#FAEEDA', '#633806'], FK: ['#E6F1FB', '#0C447C'] };
const MONO = 'ui-monospace, Menlo, Consolas, monospace';

// Cada tabla va una columna a la derecha de las tablas a las que apunta.
// Las claves a una tabla de sinFlecha no cuentan: esa tabla está en casi todas y las correría a todas.
function niveles(tablas, sinFlecha = []) {
  const porNombre = new Map(tablas.map((t) => [t.nombre, t]));
  const nivel = new Map();
  const calcular = (t, camino) => {
    if (nivel.has(t.nombre)) return nivel.get(t.nombre);
    if (camino.has(t.nombre)) return 0; // dos tablas que se apuntan entre sí: se corta acá
    camino.add(t.nombre);
    const padres = t.columnas
      .filter((c) => c.fk && c.fk !== t.nombre)
      .map((c) => {
        if (!porNombre.has(c.fk)) throw new Error(`"${t.nombre}.${c.nombre}" apunta a la tabla "${c.fk}", que no existe`);
        return porNombre.get(c.fk);
      })
      .filter((p) => !sinFlecha.includes(p.nombre));
    const n = padres.length ? 1 + Math.max(...padres.map((p) => calcular(p, camino))) : 0;
    nivel.set(t.nombre, n);
    return n;
  };
  tablas.forEach((t) => calcular(t, new Set()));
  return nivel;
}

const altoDe = (t) => CABEZA + t.columnas.length * RENGLON;

// Altura por la que una flecha larga cruza las columnas del medio sin pisar ninguna tabla.
// Devuelve la misma altura si ya está libre; si no, el hueco entre tablas más cercano.
function carril(y, enMedio) {
  const pisa = (v) => enMedio.some((o) => v > o.y - 4 && v < o.y + altoDe(o.t) + 4);
  if (!pisa(y)) return y;
  const huecos = enMedio.flatMap((o) => [o.y - SEP_Y / 2, o.y + altoDe(o.t) + SEP_Y / 2]).filter((v) => !pisa(v));
  return huecos.sort((a, b) => Math.abs(a - y) - Math.abs(b - y))[0];
}

function pastilla(x, medio, clave) {
  const [fondo, texto] = PASTILLA[clave];
  return (
    `<rect x="${x}" y="${medio - 8}" width="28" height="16" rx="8" fill="${fondo}"/>` +
    `<text x="${x + 14}" y="${medio + 3.5}" font-size="10" text-anchor="middle" fill="${texto}">${clave}</text>`
  );
}

function tabla(t, x, y, [claro, fuerte]) {
  const alto = CABEZA + t.columnas.length * RENGLON;
  let s =
    `<rect x="${x}" y="${y}" width="${ANCHO}" height="${alto}" rx="8" fill="#FFFFFF" stroke="#B4B2A9"/>` +
    `<path d="M${x} ${y + CABEZA}V${y + 8}a8 8 0 0 1 8-8H${x + ANCHO - 8}a8 8 0 0 1 8 8V${y + CABEZA}z" fill="${fuerte}"/>` +
    `<text x="${x + 12}" y="${y + 23}" font-size="14" font-weight="500" fill="${claro}">${esc(t.nombre)}</text>`;
  t.columnas.forEach((c, i) => {
    const medio = y + CABEZA + i * RENGLON + RENGLON / 2;
    if (i) s += `<path d="M${x + 1} ${medio - RENGLON / 2}H${x + ANCHO - 1}" stroke="#E5E3DC"/>`;
    if (c.pk || c.fk) s += pastilla(x + 10, medio, c.pk ? 'PK' : 'FK');
    s +=
      `<text x="${x + 46}" y="${medio + 4}" font-size="13" fill="${TINTA}">${esc(c.nombre)}</text>` +
      `<text x="${x + ANCHO - 12}" y="${medio + 4}" font-size="12" text-anchor="end" font-family="${MONO}" fill="#5F5E5A">${esc(c.tipo)}</text>`;
  });
  return s;
}

function dibujar({ titulo, modulos, tablas, sinFlecha = [], notas = [] }) {
  const nivel = niveles(tablas, sinFlecha);
  if (sinFlecha.length) notas = [`Las claves a ${sinFlecha.join(', ')} llevan la pastilla FK y no la flecha: están en casi todas las tablas.`, ...notas];
  const colorDe = colores(modulos);
  const lugar = new Map();
  const libre = []; // próxima altura libre de cada columna
  for (const t of tablas) {
    const col = nivel.get(t.nombre);
    const y = libre[col] ?? Y0;
    lugar.set(t.nombre, { x: 24 + col * (ANCHO + SEP_X), y, t });
    libre[col] = y + CABEZA + t.columnas.length * RENGLON + SEP_Y;
  }
  const medioDe = (l, i) => l.y + CABEZA + i * RENGLON + RENGLON / 2;

  const leyenda = leyendaModulos([...new Set(tablas.map((t) => t.modulo))], colorDe, 56);
  let s =
    leyenda.svg +
    pastilla(leyenda.x + 8, 62, 'PK') +
    `<text x="${leyenda.x + 42}" y="66" font-size="11" fill="${TINTA}">clave primaria</text>` +
    pastilla(leyenda.x + 130, 62, 'FK') +
    `<text x="${leyenda.x + 164}" y="66" font-size="11" fill="${TINTA}">clave foránea</text>`;

  for (const l of lugar.values()) s += tabla(l.t, l.x, l.y, colorDe(l.t.modulo));

  let k = 0;
  for (const l of lugar.values()) {
    l.t.columnas.forEach((c, i) => {
      if (!c.fk || sinFlecha.includes(c.fk)) return;
      const padre = lugar.get(c.fk);
      if (padre.x >= l.x) {
        console.warn(`No se dibuja la flecha ${l.t.nombre}.${c.nombre} → ${c.fk}: la tabla no quedó a la izquierda`);
        return;
      }
      const y1 = medioDe(l, i);
      const y2 = medioDe(padre, Math.max(0, padre.t.columnas.findIndex((x) => x.pk)));
      // ponytail: cada flecha dobla un poco más a la izquierda que la anterior para no pisarse.
      const corrida = (k++ % 4) * 8;
      const codo = l.x - 22 - corrida;
      // Si el padre está a más de una columna, la flecha pasa por un hueco entre las tablas del medio.
      const enMedio = [...lugar.values()].filter((o) => o.x > padre.x && o.x < l.x);
      const paso = carril(y2, enMedio);
      const llegada = [padre.x + ANCHO + 3, y2];
      const codo2 = padre.x + ANCHO + 22 + corrida;
      const puntos = paso === y2
        ? [[l.x, y1], [codo, y1], [codo, y2], llegada]
        : [[l.x, y1], [codo, y1], [codo, paso], [codo2, paso], [codo2, y2], llegada];
      s +=
        flecha(puntos) +
        `<text x="${l.x - 10}" y="${y1 - 6}" font-size="11" text-anchor="middle" fill="${APAGADO}">N</text>` +
        `<text x="${padre.x + ANCHO + 11}" y="${y2 - 7}" font-size="11" text-anchor="middle" fill="${APAGADO}">1</text>`;
    });
  }

  let y = Math.max(Y0, ...libre.filter(Boolean)) - SEP_Y + 30;
  for (const nota of notas) {
    s += `<text x="24" y="${y}" font-size="12" fill="#5F5E5A">· ${esc(nota)}</text>`;
    y += 18;
  }
  const columnas = Math.max(1, libre.length);
  const W = Math.max(756, 48 + columnas * ANCHO + (columnas - 1) * SEP_X);
  return marco(titulo || 'Modelo de datos', W, y - (notas.length ? 4 : 14), s);
}

if (process.argv.includes('--test')) {
  const col = (nombre, extra) => ({ nombre, tipo: 'uuid', ...extra });
  const tablas = [
    { nombre: 'recibo', columnas: [col('id', { pk: true }), col('empleado_id', { fk: 'empleado' })] },
    { nombre: 'empresa', columnas: [col('id', { pk: true })] },
    { nombre: 'empleado', columnas: [col('id', { pk: true }), col('empresa_id', { fk: 'empresa' })] },
  ];
  const nivel = niveles(tablas);
  assert.deepStrictEqual([nivel.get('empresa'), nivel.get('empleado'), nivel.get('recibo')], [0, 1, 2]);
  assert.throws(() => niveles([{ nombre: 'a', columnas: [col('b_id', { fk: 'b' })] }]), /no existe/);
  // Con empresa en sinFlecha, empleado ya no se corre a la derecha y su flecha no se dibuja.
  assert.strictEqual(niveles(tablas, ['empresa']).get('empleado'), 0);
  const svg = dibujar({ tablas: tablas.map((t) => ({ ...t, modulo: 'M' })), sinFlecha: ['empresa'] });
  assert.strictEqual((svg.match(/>N</g) || []).length, 1); // queda solo la flecha recibo → empleado
  // Una flecha larga no pisa una tabla del medio: busca el hueco más cercano.
  const medio = [{ y: 100, t: { columnas: [1, 2, 3] } }]; // ocupa de 100 a 220
  assert.strictEqual(carril(300, medio), 300);
  assert.strictEqual(carril(210, medio), 220 + SEP_Y / 2);
  assert.strictEqual(carril(110, medio), 100 - SEP_Y / 2);
  console.log('ok');
} else {
  consola(dibujar, 'modelo-datos.js');
}
