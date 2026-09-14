#!/usr/bin/env node
// Verifica que los pares de color de cada tema cumplan el mínimo de la WCAG 2.1.
//
// Es lo que hace verificable el criterio de accesibilidad de T-17: si alguien
// cambia un color en tokens.json y rompe la legibilidad, el CI lo frena.

import { themes } from "../tokens.js";

const AA_TEXTO = 4.5; // 1.4.3 Contraste mínimo, texto normal
const AA_NO_TEXTO = 3; // 1.4.11 Contraste de elementos no textuales

function luminancia(hex) {
  // La paleta tiene colores con alfa (el velo y la sombra). Un #RRGGBBAA acá
  // daría la luminancia del color opaco y el contraste saldría "ok" cuando en
  // pantalla el color es translúcido. Antes que mentir, frena.
  if (hex.length !== 7) {
    throw new Error(
      `${hex} no es un #RRGGBB opaco: el contraste de un color con alfa depende de lo que haya detrás.`,
    );
  }

  const canales = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = canales.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a, b) {
  const [alta, baja] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (alta + 0.05) / (baja + 0.05);
}

// El velo y la sombra no entran: son capas translúcidas que no forman un par de
// texto sobre fondo. Lo que sí se verifica es el texto del composer, que se
// dibuja sobre `background`, y ya está cubierto por el primer par.
const pares = ({ color }) => [
  ["texto sobre el fondo", color.text, color.background, AA_TEXTO],
  ["texto sobre la superficie", color.text, color.surface, AA_TEXTO],
  ["texto atenuado sobre el fondo", color.textMuted, color.background, AA_TEXTO],
  ["primario sobre el fondo", color.primary, color.background, AA_TEXTO],
  ["texto del botón sobre el primario", color.onPrimary, color.primary, AA_TEXTO],
  ["borde sobre el fondo", color.border, color.background, AA_NO_TEXTO],
];

let fallas = 0;
for (const [nombre, tema] of Object.entries(themes)) {
  console.log(`tema ${nombre}`);
  for (const [descripcion, frente, fondo, minimo] of pares(tema)) {
    const valor = contraste(frente, fondo);
    const pasa = valor >= minimo;
    if (!pasa) fallas += 1;
    const marca = pasa ? "ok" : "FALLA";
    console.log(
      `  ${valor.toFixed(2).padStart(5)}:1  (mín ${minimo})  ${marca}  ${descripcion}`,
    );
  }
}

if (fallas > 0) {
  console.error(`\n${fallas} par(es) de color por debajo del mínimo.`);
  process.exit(1);
}
console.log("\nTodos los pares cumplen el mínimo.");
