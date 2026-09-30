# design-tokens

Los **valores** del sistema de diseño de **UdeSA-X**: paleta, tipografía, escala
de espaciado y radios, en tema claro y oscuro.

> Parte del proyecto [`Hornero-X-Labs/UdeSA-X`](https://github.com/Hornero-X-Labs/UdeSA-X),
> donde viven la documentación, las historias de usuario y el tablero.

🚧 **Estado: valores iniciales.** Alcanzan para que los dos frontends compartan
color, tipografía y espaciado. La paleta definitiva la define T-17.

Acá viajan valores, no componentes: React Native y la web renderizan distinto, y
compartir un botón exigiría React Native Web. Cada plataforma implementa sus
componentes con lo suyo. La razón completa está en el ADR-006 del repositorio de
documentación.

Es el único repositorio público de la organización, para que el `npm ci` de los
dos frontends funcione en CI sin cargarles un token. Adentro solo hay valores de
color, tipografía y espaciado.

## Cómo consumirlo

Se instala como dependencia de git **pineada a un tag**, nunca a una rama:

```bash
npm install "github:Hornero-X-Labs/design-tokens#v0.2.0"
```

```ts
import { themes, type ColorScheme } from "@hornero/design-tokens";

const scheme: ColorScheme = "light";
const { color, space, radius, size } = themes[scheme];

color.primary; // "#B4552D"
space.md; // 16
size.touchMin; // 44
```

### Qué grupos hay y en qué unidad

| Grupo | Qué trae | Unidad |
| --- | --- | --- |
| `color` | Paleta, más `scrim` y `shadow` | Hex. Los dos últimos son `#RRGGBBAA` |
| `font.family` | Familias sans y mono | Lista CSS |
| `font.size` | Escala tipográfica | Píxeles sin unidad |
| `font.weight` | Pesos | String (`"500"`) |
| `font.lineHeight` | `tight` y `normal` | **Multiplicador** del tamaño de fuente |
| `font.letterSpacing` | `slight` y `wide` | **Multiplicador** del tamaño de fuente |
| `space` | Escala de espaciado | Píxeles sin unidad |
| `radius` | Redondeos | Píxeles sin unidad |
| `size` | Altos táctiles, avatares y logo (ancho; el alto sale del aspect ratio) | Píxeles sin unidad |

Los dos multiplicadores son los únicos valores numéricos que **no** son píxeles.
El CSS los usa tal cual (`line-height: 1.45`); React Native necesita un valor
absoluto, así que los multiplica por el tamaño de fuente.

`color.scrim` y `color.shadow` llevan alfa porque son capas que dejan ver lo que
tienen detrás. Por eso no entran en `npm run contrast`: el contraste de un color
translúcido depende del fondo, y el script frena si recibe uno.

El paquete exporta:

| Export | Qué es |
| --- | --- |
| `themes` | `{ light, dark }`, con los colores ya resueltos por tema. |
| `light` / `dark` | Cada tema por separado. |
| `tokens` | Los valores crudos, con el par claro/oscuro sin resolver. |
| `version` | La versión de los valores, para poder mostrarla o loguearla. |
| `ColorScheme` / `Theme` | Los tipos. |

También se puede importar el JSON directo con
`@hornero/design-tokens/tokens.json`.

### Por qué el paquete ya viene compilado

`tokens.js` y `tokens.d.ts` se generan desde `tokens.json` y **se versionan**, y
no hay paso de build en el install. Un `prepare` que transpile rompe con Metro,
el bundler de React Native, y agrega una pieza que habría que mantener sin
necesitarla.

Se publica JavaScript y no TypeScript porque **ni Node ni los bundlers
transpilan TypeScript que viene dentro de `node_modules`**: Node lo rechaza con
`ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING`. Los tipos viajan aparte, en el
`.d.ts`, que es la forma en la que un paquete npm los distribuye.

## Cómo cambiar un valor

1. Editar **`tokens.json`**, que es la fuente de verdad. Los archivos generados
   no se tocan a mano.
2. Regenerar y verificar:

   ```bash
   npm run generate   # reescribe tokens.js y tokens.d.ts
   npm test           # sincronización, tipos y contraste
   ```

3. Commitear los tres archivos juntos, subir la versión en `package.json` y
   abrir el PR.
4. Con el PR mergeado, publicar el tag:

   ```bash
   git tag v0.2.0 && git push origin v0.2.0
   ```

5. En cada frontend, apuntar la dependencia al tag nuevo. Es un cambio
   explícito y por repositorio: eso es lo que evita que un cambio de color rompa
   una aplicación sin que nadie se entere.

## Accesibilidad

`npm run contrast` verifica los pares de color de los dos temas contra la
WCAG 2.1: 4.5:1 para texto y 3:1 para bordes. Corre en CI, así que un color que
rompa la legibilidad no entra.

Por eso el primario tiene un valor distinto por tema: el terracota del tema claro
da 3.79:1 sobre el fondo oscuro y no llega al mínimo.

## Cómo trabajar acá

Las convenciones están en [`AGENTS.md`](./AGENTS.md). Setup, una vez por clon:

```bash
git config core.hooksPath .githooks
```
