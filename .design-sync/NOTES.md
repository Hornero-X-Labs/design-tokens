# design-sync — notas de este repositorio

## Qué se sincroniza

- Este repositorio es **tokens-only**: publica valores, no componentes
  (ADR-006). El converter lo detecta solo y lo dice: `[ZERO_MATCH] no component
  exports — treating as tokens-only DS`. **No es un error**, es el estado
  correcto. Si algún día aparecieran componentes acá, sería una violación del
  ADR antes que un problema del sync.
- La salida son los tokens como CSS custom properties más el README con el
  header de convenciones. Cero cards de componentes.

## El CSS lo deriva el sync, no el paquete

- El paquete publica JSON, JavaScript y tipos: **no publica CSS**. El pipeline
  de tokens del converter (`cfg.tokensPkg`/`tokensGlob`) copia el CSS que un
  paquete ya publica, así que acá no aplica.
- `.design-sync/tokens-css.mjs` deriva las custom properties desde
  `tokens.json` hacia `.design-sync/.cache/tokens.css` (gitignorado), y
  `cfg.cssEntry` apunta ahí. **Correrlo antes de cada build del sync**: si el
  archivo no existe, el build corta con `[ZERO_MATCH] ... and no styles —
  nothing to sync`.
- El script no toca `package.json` ni agrega un paso de build al install: es
  solo para el sync. La regla de "un cambio de valores es un cambio de versión"
  sigue viviendo en `tokens.json`.
- Los nombres son kebab-case derivados de `tokens.json`: `onPrimary` →
  `--color-on-primary`. Si se renombra una clave en `tokens.json`, cambia el
  nombre del token y hay que actualizar `.design-sync/conventions.md`.

## Comandos

```sh
node .design-sync/tokens-css.mjs
node .ds-sync/resync.mjs --config .design-sync/config.json \
  --node-modules ./.ds-sync/node_modules --entry ./tokens.js \
  --out ./ds-bundle --no-render-check [--remote .design-sync/.cache/remote-sync.json]
```

- `--node-modules` apunta a `./.ds-sync/node_modules`, no a `./node_modules`:
  el repositorio solo tiene `typescript` instalado y el converter necesita
  `react`/`react-dom` para el `_vendor/`. Con `./node_modules` corta con
  `react not found under --node-modules`.
- `--entry ./tokens.js` es explícito porque `node_modules/@hornero/design-tokens`
  no existe (npm no se autoinstala).

## Warns conocidos

- `[DTS_REACT] @types/react not found`: inofensivo acá. Solo afecta la
  extracción de props de componentes, y no hay componentes.
- `[RENDER_SKIPPED]`: el render check está salteado a propósito con
  `--no-render-check` (decisión del usuario, 2026-09-13). Con 0 previews no hay
  nada que renderizar; instalar playwright + chromium no verificaría nada.

## Riesgos de re-sync

- **El CSS derivado se puede desincronizar en silencio.** No hay un
  `--check` como el de `generate-tokens.mjs`: si alguien edita `tokens.json` y
  no vuelve a correr `.design-sync/tokens-css.mjs`, el sync sube los valores
  viejos sin quejarse. Correr siempre el generador primero.
- **`conventions.md` enumera los 25 tokens a mano.** Un token agregado en
  `tokens.json` llega al CSS solo, pero no al header hasta que alguien lo
  escriba. En cada re-sync, revalidar los nombres del header contra
  `ds-bundle/_ds_bundle.css` en los dos sentidos (nombrado-pero-inexistente y
  existente-pero-sin-documentar).
- **El cuerpo del README lo genera el converter y habla de componentes**
  ("All 0 components…", cómo montarlos). Es texto fijo del converter: el header
  de convenciones lo corrige arriba, pero si alguna vez confunde al agente de
  diseño, el arreglo es el header, no el cuerpo.
- **Nada verifica el contraste del lado del sync.** `npm run contrast` cubre
  los pares de `tokens.json`, y el header apoya sus recomendaciones en eso: si
  cambian los colores y el contraste baja, el header queda afirmando algo que
  dejó de ser cierto.
- El build asumió Node v22.23.2 y npm 10.9.8.
