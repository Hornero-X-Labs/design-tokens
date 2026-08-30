# AGENTS.md — Design tokens

Las convenciones del proyecto —autoría de commits, Conventional Commits, ramas,
pull requests, idioma— viven en el repositorio padre
[`Hornero-X-Labs/UdeSA-X`](https://github.com/Hornero-X-Labs/UdeSA-X/blob/main/AGENTS.md).
**Leelas primero.** Acá solo está lo propio de este repositorio.

## Qué es este repositorio

Los valores del sistema de diseño que comparten la app mobile y el backoffice
web: paleta, tipografía, escala de espaciado y radios, en claro y oscuro.

Valores, no componentes. Si aparece la tentación de poner acá un botón, la
respuesta está en el ADR-006 del repositorio padre: entre React Native y la web
viajan los valores y cada plataforma implementa lo suyo.

Es el único repositorio público de la organización, para que el `npm ci` de los
frontends funcione en CI sin credenciales. **No meter nada sensible.**

## Dónde está el trabajo

Las historias de usuario y los issues viven en el repositorio padre, no acá.

Al abrir un PR, linkear el issue del padre con la forma larga:
`Hornero-X-Labs/UdeSA-X#120`.

## Reglas propias

- **`tokens.json` es la fuente de verdad.** `tokens.js` y `tokens.d.ts` se
  generan; no se editan a mano. Los tres se commitean juntos.
- **No agregar un paso de build al install.** Nada de `prepare` que transpile:
  rompe con Metro. Es una decisión de ADR-006, no una preferencia.
- **Un cambio de valores es un cambio de versión.** Subir `version` en
  `package.json` y en `tokens.json`, y publicar el tag.
- **Todo color nuevo pasa por `npm run contrast`.** Si no llega al mínimo, no
  entra.

## Setup

```bash
git config core.hooksPath .githooks
```

El hook `commit-msg` borra las firmas de agentes que se cuelen en el mensaje.

## Controles de calidad

```bash
npm run check      # los generados sincronizados con tokens.json
npm run typecheck  # el .d.ts que consumen los frontends compila
npm run contrast   # contraste WCAG de los dos temas
npm test           # los tres
```
