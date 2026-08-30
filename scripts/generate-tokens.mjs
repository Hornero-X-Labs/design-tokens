#!/usr/bin/env node
// Genera tokens.js y tokens.d.ts a partir de tokens.json.
//
// Los dos se versionan junto al .json y no se compilan en el install: un
// `prepare` que transpile rompe con Metro, el bundler de React Native
// (ver ADR-006 en el repositorio de documentación).
//
// Se publica JavaScript y no TypeScript porque ni Node ni los bundlers
// transpilan TypeScript que viene dentro de node_modules.
//
//   node scripts/generate-tokens.mjs           escribe los dos archivos
//   node scripts/generate-tokens.mjs --check   no escribe; falla si quedaron desincronizados

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(root, "tokens.json");
const TARGET_JS = join(root, "tokens.js");
const TARGET_TYPES = join(root, "tokens.d.ts");
const SCHEMES = ["light", "dark"];

const raw = JSON.parse(readFileSync(SOURCE, "utf8"));

// Un valor de color es el par { light, dark }; el resto viaja tal cual.
const isColorPair = (value) =>
  value !== null &&
  typeof value === "object" &&
  SCHEMES.every((scheme) => typeof value[scheme] === "string");

function resolve(value, scheme) {
  if (isColorPair(value)) return value[scheme];
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, inner]) => [key, resolve(inner, scheme)]),
    );
  }
  return value;
}

function literal(value, indent = 0) {
  const pad = "  ".repeat(indent);
  const inner = "  ".repeat(indent + 1);
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  const entries = Object.entries(value).map(
    ([key, val]) => `${inner}${JSON.stringify(key)}: ${literal(val, indent + 1)},`,
  );
  return `{\n${entries.join("\n")}\n${pad}}`;
}

const { $comment, version, ...groups } = raw;
const theme = (scheme) => literal(resolve(groups, scheme));

const encabezado = `// Generado por scripts/generate-tokens.mjs a partir de tokens.json.
// No editar a mano: los cambios van en tokens.json y se regeneran con \`npm run generate\`.
`;

const js = `${encabezado}
export const version = ${JSON.stringify(version)};

/** Los valores crudos, con el par claro/oscuro sin resolver. */
export const tokens = ${literal(raw)};

/** Tema claro, con los colores ya resueltos. */
export const light = ${theme("light")};

/** Tema oscuro, con los colores ya resueltos. */
export const dark = ${theme("dark")};

export const themes = { light, dark };
`;

const types = `${encabezado}
export declare const version: string;

/** Los valores crudos, con el par claro/oscuro sin resolver. */
export declare const tokens: ${literal(raw)};

/** Tema claro, con los colores ya resueltos. */
export declare const light: ${theme("light")};

/** Tema oscuro, con los colores ya resueltos. */
export declare const dark: Theme;

export declare const themes: { light: Theme; dark: Theme };

export type ColorScheme = "light" | "dark";
export type Theme = typeof light;
`;

const salidas = [
  [TARGET_JS, js],
  [TARGET_TYPES, types],
];

if (process.argv.includes("--check")) {
  const desincronizados = salidas.filter(
    ([ruta, esperado]) => readFileSync(ruta, "utf8") !== esperado,
  );
  if (desincronizados.length > 0) {
    for (const [ruta] of desincronizados) {
      console.error(`${ruta} no coincide con tokens.json.`);
    }
    console.error("Corré `npm run generate` y commiteá el resultado.");
    process.exit(1);
  }
  console.log("Los archivos generados están sincronizados con tokens.json.");
} else {
  for (const [ruta, contenido] of salidas) writeFileSync(ruta, contenido);
  console.log(`tokens.js y tokens.d.ts generados (versión ${version}).`);
}
