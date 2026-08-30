// Generado por scripts/generate-tokens.mjs a partir de tokens.json.
// No editar a mano: los cambios van en tokens.json y se regeneran con `npm run generate`.

export const version = "0.1.0";

/** Los valores crudos, con el par claro/oscuro sin resolver. */
export const tokens = {
  "$comment": "Fuente de verdad del sistema de diseño. Editar acá y regenerar tokens.ts con `npm run generate`.",
  "version": "0.1.0",
  "color": {
    "primary": {
      "light": "#B4552D",
      "dark": "#E08A5C",
    },
    "onPrimary": {
      "light": "#FFFFFF",
      "dark": "#17120F",
    },
    "background": {
      "light": "#FFFFFF",
      "dark": "#17120F",
    },
    "surface": {
      "light": "#F7F3F0",
      "dark": "#241C17",
    },
    "text": {
      "light": "#1A1614",
      "dark": "#F5F0EC",
    },
    "textMuted": {
      "light": "#5C5049",
      "dark": "#B8ABA3",
    },
    "border": {
      "light": "#9A8A80",
      "dark": "#75655A",
    },
  },
  "font": {
    "family": {
      "sans": "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      "mono": "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    },
    "size": {
      "sm": 14,
      "md": 16,
      "lg": 20,
      "xl": 28,
    },
    "weight": {
      "regular": "400",
      "medium": "500",
      "bold": "700",
    },
  },
  "space": {
    "xs": 4,
    "sm": 8,
    "md": 16,
    "lg": 24,
    "xl": 40,
  },
  "radius": {
    "sm": 4,
    "md": 8,
    "lg": 16,
    "pill": 999,
  },
};

/** Tema claro, con los colores ya resueltos. */
export const light = {
  "color": {
    "primary": "#B4552D",
    "onPrimary": "#FFFFFF",
    "background": "#FFFFFF",
    "surface": "#F7F3F0",
    "text": "#1A1614",
    "textMuted": "#5C5049",
    "border": "#9A8A80",
  },
  "font": {
    "family": {
      "sans": "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      "mono": "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    },
    "size": {
      "sm": 14,
      "md": 16,
      "lg": 20,
      "xl": 28,
    },
    "weight": {
      "regular": "400",
      "medium": "500",
      "bold": "700",
    },
  },
  "space": {
    "xs": 4,
    "sm": 8,
    "md": 16,
    "lg": 24,
    "xl": 40,
  },
  "radius": {
    "sm": 4,
    "md": 8,
    "lg": 16,
    "pill": 999,
  },
};

/** Tema oscuro, con los colores ya resueltos. */
export const dark = {
  "color": {
    "primary": "#E08A5C",
    "onPrimary": "#17120F",
    "background": "#17120F",
    "surface": "#241C17",
    "text": "#F5F0EC",
    "textMuted": "#B8ABA3",
    "border": "#75655A",
  },
  "font": {
    "family": {
      "sans": "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      "mono": "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    },
    "size": {
      "sm": 14,
      "md": 16,
      "lg": 20,
      "xl": 28,
    },
    "weight": {
      "regular": "400",
      "medium": "500",
      "bold": "700",
    },
  },
  "space": {
    "xs": 4,
    "sm": 8,
    "md": 16,
    "lg": 24,
    "xl": 40,
  },
  "radius": {
    "sm": 4,
    "md": 8,
    "lg": 16,
    "pill": 999,
  },
};

export const themes = { light, dark };
