# Conventions — @hornero/design-tokens

**This design system ships values, not components.** There are no React
components to import: `window.HorneroDesignTokens` holds token *objects*, and
the styling surface is a set of CSS custom properties. This is deliberate
(ADR-006 of the UdeSA-X project): the values are shared by a React Native app
and a React web backoffice, and each platform implements its own widgets.

So: **build your own components, and style every one of them with the tokens
below.** Never hardcode a hex colour, a pixel size, a spacing value or a radius
— if a value is not in this list, it is not part of the design system.

## Setup

One line, once per page. There is no provider and no wrapper component:

```html
<link rel="stylesheet" href="styles.css">
```

`styles.css` defines all tokens on `:root` and sets `body` background, text
colour and base font. Both themes ship: the dark palette applies automatically
under `prefers-color-scheme: dark`. To pin a theme, set `data-theme="light"` or
`data-theme="dark"` on `<html>` — an explicit value wins over the system one.

## The styling idiom: CSS custom properties

Style with `var(--*)` in plain CSS. There are no utility classes and no style
props — this system has no class vocabulary of its own, so use your own class
names and fill every value from this table.

**Colour** (light/dark pairs, resolved automatically):
`--color-primary`, `--color-on-primary` (text/icons on top of primary),
`--color-background` (page), `--color-surface` (raised panels, cards),
`--color-text`, `--color-text-muted` (secondary text), `--color-border`.

**Typography**: `--font-family-sans`, `--font-family-mono`;
`--font-size-sm` (14px), `--font-size-md` (16px, body), `--font-size-lg` (20px),
`--font-size-xl` (28px); `--font-weight-regular` (400), `--font-weight-medium`
(500), `--font-weight-bold` (700).

**Spacing** — use for padding, margin and gap:
`--space-xs` (4px), `--space-sm` (8px), `--space-md` (16px),
`--space-lg` (24px), `--space-xl` (40px).

**Radius**: `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (16px),
`--radius-pill` (999px, for pills and circular buttons).

The colour pairs are contrast-checked against WCAG in the source repo, so
`--color-text` on `--color-background`, `--color-text-muted` on
`--color-surface`, and `--color-on-primary` on `--color-primary` are all safe
combinations. Inventing a new pairing gives up that guarantee.

## The same values in JavaScript

`_ds_bundle.js` exposes the raw values for the rare case where CSS can't reach
them (canvas, inline SVG, a chart library):
`window.HorneroDesignTokens.light` and `.dark` (colours resolved per theme),
`.tokens` (raw, unresolved pairs), `.themes`, `.version`. Prefer the CSS custom
properties — they follow the theme on their own.

## Where the truth lives

`styles.css` → `_ds_bundle.css` holds every declaration, generated from the
repo's `tokens.json`. Read it before styling: it is short, and it is the
complete list. There are no per-component docs, because there are no
components.

## Idiomatic example

```jsx
// A card and a button, built from the tokens. Nothing is imported from the DS.
<div style={{
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-lg)',
  display: 'flex', flexDirection: 'column', gap: 'var(--space-md)',
}}>
  <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)' }}>
    Publicaciones
  </h2>
  <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
    3 pendientes de revisión
  </p>
  <button style={{
    background: 'var(--color-primary)', color: 'var(--color-on-primary)',
    border: 'none', borderRadius: 'var(--radius-pill)',
    padding: 'var(--space-sm) var(--space-lg)',
    fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-medium)',
    fontFamily: 'var(--font-family-sans)', cursor: 'pointer',
  }}>
    Revisar
  </button>
</div>
```
