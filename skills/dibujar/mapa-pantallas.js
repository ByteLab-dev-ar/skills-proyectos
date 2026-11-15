#!/usr/bin/env node
// Genera el mapa de pantallas (SVG): una caja por pantalla y flechas de cómo se pasa de una a otra.
// Uso:    node mapa-pantallas.js datos.json salida.svg
// Prueba: node mapa-pantallas.js --test
const assert = require('assert');
const { APAGADO, esc, colores, flecha, leyendaModulos, marco, consola } = require('./comun');

const ANCHO = 196;
const ALTO = 46;
const SEP_X = 44;
const SEP_Y = 14;

// La primera pantalla es el inicio. Cada pantalla va una columna a la derecha de la que la abre.
function ubicar(pantallas) {
  const porNombre = new Map(pantallas.map((p) => [p.nombre, p]));
  const lugar = new Map();
  const filas = []; // cuántas pantallas hay ya en cada columna
  const poner = (p, col) => {
    filas[col] = (filas[col] ?? -1) + 1;
    lugar.set(p.nombre, { col, fila: filas[col] });
  };
  for (const inicio of pantallas) {
    if (lugar.has(inicio.nombre)) continue; // las que nadie abre arrancan en la primera columna
    poner(inicio, 0);
    const cola = [inicio];
    while (cola.length) {
      const p = cola.shift();
      for (const n of p.va || []) {
        if (!porNombre.has(n)) throw new Error(`"${p.nombre}" va a "${n}", que no existe en su sección`);
        if (lugar.has(n)) continue;
        poner(porNombre.get(n), lugar.get(p.nombre).col + 1);
        cola.push(porNombre.get(n));
      }
    }
  }
  return lugar;
}

function dibujar({ titulo, modulos, secciones }) {
  const colorDe = colores(modulos);
  const usados = [...new Set(secciones.flatMap((s) => s.pantallas.map((p) => p.modulo)))];
  let s = leyendaModulos(usados, colorDe, 56).svg;
  let y = 100;
  let columnas = 1;
  for (const seccion of secciones) {
    const lugar = ubicar(seccion.pantallas);
    const esquina = ({ col, fila }) => [24 + col * (ANCHO + SEP_X), y + 14 + fila * (ALTO + SEP_Y)];
    s += `<text x="24" y="${y}" font-size="12" fill="${APAGADO}">${esc(seccion.nombre)}</text>`;
    let filas = 0;
    for (const p of seccion.pantallas) {
      const aca = lugar.get(p.nombre);
      const [x, py] = esquina(aca);
      const [fondo, borde, texto] = colorDe(p.modulo);
      filas = Math.max(filas, aca.fila + 1);
      columnas = Math.max(columnas, aca.col + 1);
      s +=
        `<rect x="${x}" y="${py}" width="${ANCHO}" height="${ALTO}" rx="8" fill="${fondo}" stroke="${borde}"/>` +
        `<text x="${x + 12}" y="${py + 18}" font-size="13" fill="${texto}">${esc(p.nombre)}</text>` +
        `<text x="${x + 12}" y="${py + 34}" font-size="11" fill="${texto}">${esc(p.hace || '')}</text>`;
      for (const n of p.va || []) {
        const alla = lugar.get(n);
        const [x2, y2] = esquina(alla);
        const m1 = py + ALTO / 2;
        const m2 = y2 + ALTO / 2;
        const codo = x + ANCHO + SEP_X / 2;
        if (alla.col === aca.col + 1) {
          s += flecha(m1 === m2 ? [[x + ANCHO + 4, m1], [x2 - 4, m2]] : [[x + ANCHO + 4, m1], [codo, m1], [codo, m2], [x2 - 4, m2]]);
        } else if (alla.col === aca.col && alla.fila === aca.fila + 1) {
          s += flecha([[x + ANCHO / 2, py + ALTO + 2], [x + ANCHO / 2, y2 - 3]]);
        } else {
          // ponytail: solo dibuja flechas hacia la columna siguiente. Las de "volver" se avisan y no se dibujan.
          console.warn(`No se dibuja la flecha "${p.nombre}" → "${n}": vuelve atrás o saltea una pantalla`);
        }
      }
    }
    y += 14 + filas * (ALTO + SEP_Y) + 24;
  }
  const W = Math.max(756, 48 + columnas * ANCHO + (columnas - 1) * SEP_X);
  return marco(titulo || 'Mapa de pantallas', W, y - 22, s);
}

if (process.argv.includes('--test')) {
  const pantallas = [
    { nombre: 'Login', va: ['Inicio', 'Recuperar'] },
    { nombre: 'Recuperar' },
    { nombre: 'Inicio', va: ['Detalle'] },
    { nombre: 'Detalle' },
  ];
  const lugar = ubicar(pantallas);
  assert.deepStrictEqual(lugar.get('Inicio'), { col: 1, fila: 0 });
  assert.deepStrictEqual(lugar.get('Recuperar'), { col: 1, fila: 1 });
  assert.deepStrictEqual(lugar.get('Detalle'), { col: 2, fila: 0 });
  assert.throws(() => ubicar([{ nombre: 'Login', va: ['Nada'] }]), /no existe/);
  console.log('ok');
} else {
  consola(dibujar, 'mapa-pantallas.js');
}
