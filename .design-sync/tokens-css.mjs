#!/usr/bin/env node
// Deriva un CSS de custom properties a partir de tokens.json, para que
// claude.ai/design reciba los valores del sistema de diseño.
//
// No es un artefacto del paquete publicado: no entra en `files` de
// package.json, no lo consume ningún frontend y no se commitea la salida.
// Existe solo para el sync, que necesita un stylesheet donde este
// repositorio solo publica JSON y JavaScript (ver ADR-006: acá viajan
// valores, no componentes).
//
//   node .design-sync/tokens-css.mjs   escribe .design-sync/.cache/tokens.css

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(root, "tokens.json");
const TARGET = join(root, ".design-sync", ".cache", "tokens.css");
const SCHEMES = ["light", "dark"];

const raw = JSON.parse(readFileSync(SOURCE, "utf8"));
const { $comment, version, ...groups } = raw;

// Un valor de color es el par { light, dark }; el resto viaja tal cual.
const isColorPair = (value) =>
  value !== null &&
  typeof value === "object" &&
  SCHEMES.every((scheme) => typeof value[scheme] === "string");

const kebab = (key) => key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

// Los números son píxeles (tamaños, espaciado, radios); las cadenas viajan
// literales (familias tipográficas, pesos, colores).
const css = (value) => (typeof value === "number" ? `${value}px` : String(value));

// Aplana el árbol a pares [--nombre, valor]. Los colores quedan en `porTema`,
// donde hay un valor por esquema; el resto en `fijos`.
function flatten(node, path, fijos, porTema) {
  for (const [key, value] of Object.entries(node)) {
    const name = `--${[...path, kebab(key)].join("-")}`;
    if (isColorPair(value)) {
      porTema.push([name, value]);
    } else if (value !== null && typeof value === "object") {
      flatten(value, [...path, kebab(key)], fijos, porTema);
    } else {
      fijos.push([name, css(value)]);
    }
  }
}

const fijos = [];
const porTema = [];
flatten(groups, [], fijos, porTema);

const declara = (pares, indent = "  ") =>
  pares.map(([name, value]) => `${indent}${name}: ${value};`).join("\n");
const colores = (scheme, indent = "  ") =>
  declara(porTema.map(([name, pair]) => [name, pair[scheme]]), indent);

const contenido = `/* Generado por .design-sync/tokens-css.mjs a partir de tokens.json (versión ${version}).
   No editar a mano: los cambios van en tokens.json. */

:root {
  color-scheme: light dark;

${colores("light")}

${declara(fijos)}
}

/* El tema del sistema, salvo que el documento pida claro explícitamente. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${colores("dark", "    ")}
  }
}

/* El tema elegido a mano gana en los dos sentidos. */
:root[data-theme="dark"] {
${colores("dark")}
}

:root[data-theme="light"] {
${colores("light")}
}

body {
  margin: 0;
  background: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-family-sans);
  font-size: var(--font-size-md);
}
`;

mkdirSync(dirname(TARGET), { recursive: true });
writeFileSync(TARGET, contenido);
console.log(`${TARGET} generado (versión ${version}).`);
