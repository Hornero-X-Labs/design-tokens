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
npm install "github:Hornero-X-Labs/design-tokens#v0.1.0"
```

```ts
import { themes, type ColorScheme } from "@hornero/design-tokens";

const scheme: ColorScheme = "light";
const { color, space, radius } = themes[scheme];

color.primary; // "#B4552D"
space.md; // 16
```

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

### Por qué el paquete expone TypeScript sin compilar

`tokens.ts` se genera y **se versiona** junto a `tokens.json`, y no hay paso de
build en el install. Un `prepare` que transpile rompe con Metro, el bundler de
React Native, y agrega una pieza que habría que mantener sin necesitarla.

Los dos consumidores transpilan TypeScript por su cuenta: Vite con esbuild y
Expo con Babel. Si el pre-bundler de Vite se queja del paquete, se lo excluye:

```ts
// vite.config.ts
export default defineConfig({
  optimizeDeps: { exclude: ["@hornero/design-tokens"] },
});
```

## Cómo cambiar un valor

1. Editar **`tokens.json`**, que es la fuente de verdad. `tokens.ts` no se toca a
   mano.
2. Regenerar y verificar:

   ```bash
   npm run generate   # reescribe tokens.ts
   npm test           # chequea la sincronización y el contraste
   ```

3. Commitear los dos archivos juntos, subir la versión en `package.json` y
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
