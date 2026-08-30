#!/usr/bin/env node
// Genera tokens.ts a partir de tokens.json.
//
// El .ts generado se versiona junto al .json y no se compila en el install:
// un `prepare` que transpile rompe con Metro, el bundler de React Native
// (ver ADR-006 en el repositorio de documentación).
//
//   node scripts/generate-tokens.mjs           escribe tokens.ts
//   node scripts/generate-tokens.mjs --check   no escribe; falla si quedó desincronizado

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(root, "tokens.json");
const TARGET = join(root, "tokens.ts");
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

const generated = `// Generado por scripts/generate-tokens.mjs a partir de tokens.json.
// No editar a mano: los cambios van en tokens.json y se regeneran con \`npm run generate\`.

export const version = ${JSON.stringify(version)};

/** Los valores crudos, con el par claro/oscuro sin resolver. */
export const tokens = ${literal(raw)} as const;

/** Tema claro, con los colores ya resueltos. */
export const light = ${theme("light")} as const;

/** Tema oscuro, con los colores ya resueltos. */
export const dark = ${theme("dark")} as const;

export const themes = { light, dark } as const;

export type ColorScheme = keyof typeof themes;
export type Theme = typeof light;
`;

if (process.argv.includes("--check")) {
  const current = readFileSync(TARGET, "utf8");
  if (current !== generated) {
    console.error(
      "tokens.ts no coincide con tokens.json. Corré `npm run generate` y commiteá el resultado.",
    );
    process.exit(1);
  }
  console.log("tokens.ts está sincronizado con tokens.json.");
} else {
  writeFileSync(TARGET, generated);
  console.log(`tokens.ts generado (versión ${version}).`);
}
