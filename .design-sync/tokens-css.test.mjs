// Pruebas de las unidades que escribe tokens-css.mjs.
// Correr con `npm run test:css`.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tokensCss } from "./tokens-css.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const real = JSON.parse(readFileSync(join(root, "tokens.json"), "utf8"));

const entrada = {
  version: "9.9.9",
  font: {
    size: { md: 16 },
    weight: { bold: "700" },
    lineHeight: { tight: 1.15 },
    letterSpacing: { wide: 0.08 },
  },
  space: { md: 16 },
};
const css = tokensCss(entrada);

test("line-height queda sin unidad", () => {
  assert.match(css, /--font-line-height-tight: 1\.15;/);
});

test("letter-spacing sale en em", () => {
  assert.match(css, /--font-letter-spacing-wide: 0\.08em;/);
});

test("el resto de los números sigue en px y las cadenas no cambian", () => {
  assert.match(css, /--font-size-md: 16px;/);
  assert.match(css, /--space-md: 16px;/);
  assert.match(css, /--font-weight-bold: 700;/);
});

test("ningún multiplicador de tokens.json termina en px", () => {
  const todo = tokensCss(real);
  for (const grupo of ["lineHeight", "letterSpacing"]) {
    const nombre = grupo.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    const lineas = todo.split("\n").filter((l) => l.includes(`--font-${nombre}-`));
    assert.equal(lineas.length, Object.keys(real.font[grupo]).length);
    for (const linea of lineas) assert.doesNotMatch(linea, /px;/);
  }
});
