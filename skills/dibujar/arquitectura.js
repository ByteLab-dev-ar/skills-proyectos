#!/usr/bin/env node
// Genera la arquitectura (SVG): capas de arriba abajo, desde lo que usa la persona hasta los datos.
// Uso:    node arquitectura.js datos.json salida.svg
// Prueba: node arquitectura.js --test
const assert = require('assert');
const { PALETA, APAGADO, esc, candado, flecha, marco, consola } = require('./comun');

// Acá el color dice el tipo de parte, no el módulo: la arquitectura no tiene módulos.
const TIPOS = {
  persona: { nombre: 'Lo que usa la persona', color: PALETA[1] },
  sistema: { nombre: 'El sistema', color: PALETA[3] },
  datos: { nombre: 'Datos propios', color: PALETA[4] },
  afuera: { nombre: 'Servicios de afuera', color: PALETA[0], punteado: true },
};
const W = 756;
const X0 = 24;
const raya = (t) => (t.punteado ? ' stroke-dasharray="5 4"' : '');

function dibujar({ titulo, capas }) {
  let s = Object.values(TIPOS)
    .map((t, i) => {
      const x = X0 + i * 178;
      return (
        `<rect x="${x}" y="54" width="170" height="24" rx="8" fill="${t.color[0]}" stroke="${t.color[1]}"${raya(t)}/>` +
        `<text x="${x + 10}" y="70" font-size="11" fill="${t.color[2]}">${t.nombre}</text>`
      );
    })
    .join('');
  let y = 100;
  capas.forEach((capa, i) => {
    // Si alguna parte lleva candado, toda la capa usa el alto mayor para quedar pareja.
    const alto = capa.partes.some((p) => p.candado) ? 62 : 46;
    const altoCapa = 30 + alto + 12;
    if (i) s += flecha([[W / 2, y - 20], [W / 2, y - 5]]);
    s +=
      `<rect x="${X0}" y="${y}" width="${W - 2 * X0}" height="${altoCapa}" rx="12" fill="none" stroke="#D3D1C7"/>` +
      `<text x="${X0 + 12}" y="${y + 19}" font-size="11" fill="${APAGADO}">${esc(capa.nombre)}</text>`;
    const n = capa.partes.length;
    const ancho = (W - 2 * X0 - 24 - (n - 1) * 10) / n;
    capa.partes.forEach((p, k) => {
      const t = TIPOS[p.tipo || capa.tipo];
      if (!t) throw new Error(`"${p.nombre}" tiene un tipo desconocido. Los tipos son: ${Object.keys(TIPOS).join(', ')}`);
      const x = X0 + 12 + k * (ancho + 10);
      const py = y + 30;
      const [fondo, borde, texto] = t.color;
      s +=
        `<rect x="${x}" y="${py}" width="${ancho}" height="${alto}" rx="8" fill="${fondo}" stroke="${borde}"${raya(t)}/>` +
        `<text x="${x + 12}" y="${py + 18}" font-size="13" fill="${texto}">${esc(p.nombre)}</text>` +
        `<text x="${x + 12}" y="${py + 34}" font-size="11" fill="${texto}">${esc(p.detalle || '')}</text>`;
      if (p.candado) s += candado(x + 12, py + 42, texto) + `<text x="${x + 26}" y="${py + 50}" font-size="11" fill="${texto}">${esc(p.candado)}</text>`;
    });
    y += altoCapa + 26;
  });
  return marco(titulo || 'Arquitectura', W, y - 10, s);
}

if (process.argv.includes('--test')) {
  const capa = (tipo) => [{ nombre: 'Capa', partes: [{ nombre: 'API', tipo }] }];
  assert.ok(dibujar({ capas: capa('sistema') }).includes('>API<'));
  assert.throws(() => dibujar({ capas: capa('nube') }), /tipo desconocido/);
  console.log('ok');
} else {
  consola(dibujar, 'arquitectura.js');
}
