// Lo que comparten los scripts de dibujo: colores, marco del SVG, flechas y la entrada por consola.
const fs = require('fs');
const path = require('path');

// [fondo, borde, texto]. Un color por módulo. Todos pastel y con el borde suave:
// un borde oscuro repetido en muchas cajas cansa la vista.
const PALETA = [
  ['#F1EFE8', '#B9B7AE', '#5F5E5A'], // gris
  ['#EEEDFE', '#ADA8E6', '#534AB7'], // violeta
  ['#FBEAF0', '#E3A6BC', '#99405E'], // rosa
  ['#E1F5EE', '#8CCDB9', '#0F6E56'], // verde agua
  ['#FCEFE6', '#E8B79A', '#9A5630'], // durazno
  ['#E8F2FC', '#8DB8E3', '#1F5C99'], // azul
  ['#FAEEDA', '#DDB878', '#854F0B'], // ámbar
  ['#EAF3DE', '#A9CB86', '#3B6D11'], // verde
];
const TINTA = '#2C2C2A';
const APAGADO = '#888780';
const FUENTE = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Devuelve una función módulo -> color. Con `orden` (la lista de módulos del proyecto),
// cada módulo tiene el mismo color en todos los dibujos. Sin ella, toma el color por orden de aparición.
function colores(orden = []) {
  const mapa = new Map(orden.map((nombre, i) => [nombre, PALETA[i % PALETA.length]]));
  return (nombre) => {
    if (!mapa.has(nombre)) mapa.set(nombre, PALETA[mapa.size % PALETA.length]);
    return mapa.get(nombre);
  };
}

// Candado: marca lo frenado y las decisiones caras de cambiar. (x, y) es la esquina de arriba a la izquierda.
const candado = (x, y, c) =>
  `<rect x="${x}" y="${y + 4}" width="8.5" height="5.5" rx="1" fill="${c}"/>` +
  `<path d="M${x + 1.75} ${y + 4}v-1.5a2.5 2.5 0 0 1 5 0v1.5" fill="none" stroke="${c}" stroke-width="1.3"/>`;

// Línea que pasa por los puntos y termina en punta. Los tramos van derechos: horizontales o verticales.
function flecha(puntos) {
  const linea = puntos.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('');
  const [[x1, y1], [x2, y2]] = puntos.slice(-2);
  const punta =
    x2 > x1 ? `M${x2 - 4} ${y2 - 4}l4 4-4 4`
    : x2 < x1 ? `M${x2 + 4} ${y2 - 4}l-4 4 4 4`
    : y2 > y1 ? `M${x2 - 4} ${y2 - 4}l4 4 4-4`
    : `M${x2 - 4} ${y2 + 4}l4-4 4 4`;
  return `<path d="${linea}${punta}" fill="none" stroke="${APAGADO}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>`;
}

// Un cuadradito de color y el nombre de cada módulo. Devuelve el dibujo y dónde termina.
function leyendaModulos(nombres, colorDe, y) {
  let x = 24;
  let svg = '';
  for (const m of nombres) {
    const [fondo, borde] = colorDe(m);
    svg += `<rect x="${x}" y="${y}" width="12" height="12" rx="3" fill="${fondo}" stroke="${borde}"/>` +
      `<text x="${x + 18}" y="${y + 10}" font-size="11" fill="${TINTA}">${esc(m)}</text>`;
    x += 32 + m.length * 6.5; // ponytail: ancho estimado por letra
  }
  return { svg, x };
}

// El SVG completo. Lleva fondo propio para leerse igual con Obsidian en tema claro u oscuro.
function marco(titulo, W, H, cuerpo) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FUENTE}">\n` +
    `<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="#FFFFFF" stroke="#D3D1C7"/>\n` +
    `<text x="24" y="38" font-size="16" font-weight="500" fill="${TINTA}">${esc(titulo)}</text>\n` +
    cuerpo +
    '\n</svg>\n'
  );
}

// Lee un archivo de datos. "base" nombra otro archivo, al lado de este, del que se lee qué está hecho:
// lo usa el roadmap mobile para saber qué backend del roadmap general ya existe.
function leer(entrada) {
  const datos = JSON.parse(fs.readFileSync(entrada, 'utf8'));
  if (datos.base) {
    const rutaBase = path.resolve(path.dirname(entrada), datos.base);
    datos.filasBase = JSON.parse(fs.readFileSync(rutaBase, 'utf8')).filas;
  }
  return datos;
}

function consola(dibujar, script) {
  const [entrada, salida] = process.argv.slice(2);
  if (!entrada || !salida) {
    console.error(`Uso: node ${script} datos.json salida.svg`);
    process.exit(1);
  }
  fs.writeFileSync(salida, dibujar(leer(entrada)));
  console.log(`Listo: ${salida}`);
}

module.exports = { PALETA, TINTA, APAGADO, esc, colores, candado, flecha, leyendaModulos, marco, leer, consola };
