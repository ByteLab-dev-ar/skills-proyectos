#!/usr/bin/env node
// Genera el roadmap general (SVG) a partir de la lista de filas del proyecto.
// Uso:    node roadmap-general.js datos.json salida.svg
// Prueba: node roadmap-general.js --test
const assert = require('assert');
const { PALETA, TINTA, APAGADO, esc, colores, candado, flecha, marco, leer, consola } = require('./comun');

const GRIS = PALETA[0];
const ALTO = 44; // alto de un cartel
const PASO = 52; // de una fila a la siguiente
const ANCHO = 230; // ancho de un cartel
const X = { num: 35, nombre: 58, back: 240, pant: 502 };
const dos = (n) => String(n).padStart(2, '0');

// El estado de cada cartel se calcula, no se escribe a mano: así hay un solo "sigue".
// Con filasBase (las del roadmap general), "necesita" nombra primero filas de ahí:
// así el roadmap mobile sabe qué backend ya está hecho.
function calcularEstados(filas, filasBase = []) {
  const porNombre = new Map([...filas, ...filasBase].map((f) => [f.nombre, f]));
  const filaHecha = (f) => Boolean((f.unico || f.backend || {}).hecha);
  let haySigue = false;
  const estado = (cartel, fila, esPantalla) => {
    if (cartel.hecha) return { tipo: 'hecha', nota: 'hecha' };
    if (cartel.frenada) return { tipo: 'frenada', nota: cartel.frenada };
    // Una dependencia mal escrita cuenta como no hecha: se ve en el dibujo en vez de pasar callada.
    const faltan = (cartel.necesita || []).filter((n) => !porNombre.has(n) || !filaHecha(porNombre.get(n)));
    if (esPantalla && fila.backend && !fila.backend.hecha) faltan.unshift('su backend');
    if (faltan.length) return { tipo: 'espera', nota: 'necesita: ' + faltan.join(', ') };
    if (haySigue) return { tipo: 'lista', nota: 'se puede hacer ya' };
    haySigue = true;
    return { tipo: 'sigue', nota: 'sigue' };
  };
  const titulos = { unico: 'Todo el proyecto', backend: 'Backend', pantalla: 'Pantalla' };
  return filas.map((f) => ({
    ...f,
    carteles: ['unico', 'backend', 'pantalla']
      .filter((k) => f[k])
      .map((k) => {
        const titulo = f[k].texto || titulos[k];
        // El número de spec se ve desde que /spec la escribe, no recién cuando se cierra.
        const rotulo = f[k].spec ? `${titulo} · SPEC ${dos(f[k].spec)}` : titulo;
        return { clave: k, titulo, rotulo, ...estado(f[k], f, k === 'pantalla') };
      }),
  }));
}

// Íconos dibujados como formas: (x, y) es la esquina de arriba a la izquierda, en una caja de 10 x 9.
const ICONO = {
  hecha: (x, y, c) => `<path d="M${x} ${y + 4.5}l3 3 5.5-6" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  sigue: (x, y, c) => `<path d="M${x + 1} ${y}v9l7.5-4.5z" fill="${c}"/>`,
  frenada: candado,
};
const punteado = (tipo) => (tipo === 'hecha' || tipo === 'sigue' ? '' : ' stroke-dasharray="5 4"');

function cartel(x, y, ancho, [fondo, borde, texto], c) {
  const icono = ICONO[c.tipo];
  return (
    `<rect x="${x}" y="${y}" width="${ancho}" height="${ALTO}" rx="8" fill="${fondo}" stroke="${borde}"${punteado(c.tipo)}/>` +
    `<text x="${x + 12}" y="${y + 18}" font-size="13" fill="${texto}">${esc(c.rotulo || c.titulo)}</text>` +
    (icono ? icono(x + 12, y + 26, texto) : '') +
    `<text x="${x + 12 + (icono ? 14 : 0)}" y="${y + 34}" font-size="11" fill="${texto}">${esc(c.nota)}</text>`
  );
}

// ponytail: corta por cantidad de letras, no por ancho real. Si un nombre se sale, medir el texto.
function partir(texto, max) {
  const lineas = [''];
  for (const palabra of String(texto).split(' ')) {
    const ultima = lineas[lineas.length - 1];
    if (ultima && (ultima + ' ' + palabra).length > max && lineas.length < 2) lineas.push(palabra);
    else lineas[lineas.length - 1] = ultima ? ultima + ' ' + palabra : palabra;
  }
  return lineas;
}

function leyenda(y) {
  const items = [['hecha', 'hecha'], ['sigue', 'sigue'], ['lista', 'por hacer'], ['frenada', 'frenada']];
  return items
    .map(([tipo, texto], i) => {
      const x = 24 + i * 92;
      const icono = ICONO[tipo];
      return (
        `<rect x="${x}" y="${y}" width="84" height="24" rx="8" fill="${GRIS[0]}" stroke="${GRIS[1]}"${punteado(tipo)}/>` +
        (icono ? icono(x + 10, y + 7.5, GRIS[2]) : '') +
        `<text x="${x + 10 + (icono ? 14 : 0)}" y="${y + 16}" font-size="11" fill="${GRIS[2]}">${texto}</text>`
      );
    })
    .join('');
}

function dibujar({ titulo, modulos, version1Hasta, filas, filasBase }) {
  const colorDe = colores(modulos);
  const Y0 = 100;
  const HUECO = 24; // lugar para la línea que marca hasta dónde llega la versión 1
  const corte = version1Hasta ? filas.findIndex((f) => f.nombre === version1Hasta) : -1;
  if (version1Hasta && corte < 0) throw new Error(`version1Hasta nombra la fila "${version1Hasta}", que no existe`);
  const yDe = (i) => Y0 + i * PASO + (corte >= 0 && i > corte ? HUECO : 0);
  const W = X.pant + ANCHO + 24;
  const H = yDe(filas.length - 1) + PASO + 16 + (corte >= 0 && corte === filas.length - 1 ? HUECO : 0);
  const cuerpo = calcularEstados(filas, filasBase)
    .map((f, i) => {
      const y = yDe(i);
      const medio = y + ALTO / 2;
      const col = colorDe(f.modulo);
      // Debajo del nombre va el tamaño de la fila (chico, mediano o grande), si lo tiene.
      const lineas = partir(f.nombre, 24).map((l) => [l, 13, TINTA]);
      if (f.tamano) lineas.push([f.tamano, 11, APAGADO]);
      const por = Object.fromEntries(f.carteles.map((c) => [c.clave, c]));
      let s =
        `<circle cx="${X.num}" cy="${medio}" r="11" fill="${col[0]}" stroke="${col[1]}"/>` +
        `<text x="${X.num}" y="${medio + 4}" font-size="12" text-anchor="middle" fill="${col[2]}">${i + 1}</text>` +
        lineas
          .map(([l, letra, color], n) => `<text x="${X.nombre}" y="${medio + 4 + (n - (lineas.length - 1) / 2) * 15}" font-size="${letra}" fill="${color}">${esc(l)}</text>`)
          .join('');
      // Un cartel solo (la base del sistema, o una pantalla sin backend propio) ocupa todo el ancho.
      const solo = por.unico || (!por.backend && por.pantalla);
      if (solo) return s + cartel(X.back, y, X.pant + ANCHO - X.back, col, solo);
      if (por.backend) s += cartel(X.back, y, ANCHO, col, por.backend);
      if (por.pantalla) {
        if (por.backend) s += flecha([[X.back + ANCHO + 7, medio], [X.pant - 8, medio]]);
        s += cartel(X.pant, y, ANCHO, col, por.pantalla);
      } else {
        s += `<text x="${X.pant + 12}" y="${medio + 4}" font-size="12" fill="${APAGADO}">sin pantalla</text>`;
      }
      return s;
    })
    .join('\n');
  const yCorte = yDe(corte) + ALTO;
  const lineaCorte =
    corte < 0
      ? ''
      : `\n<text x="24" y="${yCorte + 20}" font-size="11" fill="${APAGADO}">Hasta acá: versión 1</text>` +
        `<path d="M144 ${yCorte + 16}H${W - 24}" stroke="${APAGADO}" stroke-dasharray="3 4"/>`;
  return marco(titulo || 'Roadmap general', W, H, leyenda(54) + '\n' + cuerpo + lineaCorte);
}

// El estado del proyecto en texto, para /estado. Sale de los mismos datos y la misma cuenta que el dibujo,
// así que el texto y el dibujo no pueden decir cosas distintas.
function resumen({ titulo, version1Hasta, filas, filasBase }) {
  const corte = version1Hasta ? filas.findIndex((f) => f.nombre === version1Hasta) : -1;
  const parte = { unico: '', backend: ' · backend', pantalla: ' · pantalla' };
  const grupos = { sigue: [], lista: [], espera: [], frenada: [] };
  const funciona = [];
  const aMedias = [];
  let hechos = 0;
  let total = 0;
  let faltanV1 = 0;
  calcularEstados(filas, filasBase).forEach((f, i) => {
    const hechas = f.carteles.filter((c) => c.tipo === 'hecha');
    const faltan = f.carteles.filter((c) => c.tipo !== 'hecha');
    total += f.carteles.length;
    hechos += hechas.length;
    if (corte >= 0 && i <= corte) faltanV1 += faltan.length;
    const nombres = (lista) => lista.map((c) => c.titulo.toLowerCase()).join(', ');
    if (!faltan.length) funciona.push(`- ${f.nombre}: ${f.deja || 'hecha'}`);
    else if (hechas.length) aMedias.push(`- ${f.nombre}: hecho ${nombres(hechas)}; falta ${nombres(faltan)}`);
    for (const c of faltan) {
      const motivo = c.tipo === 'espera' || c.tipo === 'frenada' ? `: ${c.nota}` : '';
      grupos[c.tipo].push(`- ${f.nombre}${parte[c.clave]}${f.tamano ? ` (${f.tamano})` : ''}${motivo}`);
    }
  });
  const bloque = (nombre, lista) => (lista.length ? [`\n${nombre}`, ...lista] : []);
  const version1 = corte < 0 ? [] : [faltanV1 ? `Versión 1: faltan ${faltanV1} carteles (llega hasta "${version1Hasta}").` : 'Versión 1: completa.'];
  return [
    titulo || 'Roadmap',
    `Hechos: ${hechos} de ${total} carteles.`,
    ...version1,
    ...bloque('FUNCIONA', funciona),
    ...bloque('A MEDIAS', aMedias),
    ...bloque('SIGUE', grupos.sigue),
    ...bloque('SE PUEDE HACER YA', grupos.lista),
    ...bloque('ESPERA', grupos.espera),
    ...bloque('FRENADA', grupos.frenada),
  ].join('\n');
}

if (process.argv.includes('--test')) {
  const filas = [
    { nombre: 'Base', modulo: 'Base', unico: { spec: 1, hecha: true } },
    { nombre: 'Login', modulo: 'Acceso', backend: { spec: 2, hecha: true }, pantalla: {} },
    { nombre: 'Mails', modulo: 'Mails', backend: {} },
    { nombre: 'Recuperar', modulo: 'Acceso', backend: { necesita: ['Mails'] }, pantalla: {} },
    { nombre: 'Firma', modulo: 'Recibos', backend: { frenada: 'espera al cliente' }, pantalla: {} },
  ];
  const tipos = calcularEstados(filas).flatMap((f) => f.carteles.map((c) => c.tipo));
  assert.deepStrictEqual(tipos, ['hecha', 'hecha', 'sigue', 'lista', 'espera', 'espera', 'frenada', 'espera']);
  assert.ok(dibujar({ titulo: 'a < b', filas }).includes('a &lt; b'));
  // El número de spec se dibuja esté o no cerrada.
  assert.ok(dibujar({ filas }).includes('Backend · SPEC 02'));
  assert.ok(dibujar({ filas: [{ nombre: 'X', modulo: 'M', backend: { spec: 7 } }] }).includes('Backend · SPEC 07'));
  assert.ok(dibujar({ version1Hasta: 'Mails', filas }).includes('versión 1'));
  assert.throws(() => dibujar({ version1Hasta: 'Nada', filas }), /no existe/);
  // Roadmap mobile: una pantalla depende del backend del roadmap general, aunque se llamen igual.
  const mobile = [
    { nombre: 'Login', modulo: 'Acceso', pantalla: { necesita: ['Login'] } },
    { nombre: 'Avisos', modulo: 'Mails', pantalla: { necesita: ['Mails'] } },
  ];
  assert.deepStrictEqual(calcularEstados(mobile, filas).flatMap((f) => f.carteles.map((c) => c.tipo)), ['sigue', 'espera']);
  const texto = resumen({ version1Hasta: 'Mails', filas });
  assert.ok(texto.includes('SIGUE\n- Login · pantalla'));
  assert.ok(texto.includes('Versión 1: faltan 2 carteles'));
  assert.ok(texto.includes('FRENADA\n- Firma · backend: espera al cliente'));
  console.log('ok');
} else if (process.argv.includes('--estado')) {
  const entrada = process.argv.find((a) => a.endsWith('.json'));
  if (!entrada) {
    console.error('Uso: node roadmap-general.js --estado datos.json');
    process.exit(1);
  }
  console.log(resumen(leer(entrada)));
} else {
  consola(dibujar, 'roadmap-general.js');
}
