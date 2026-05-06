# Minifig Customizer

A React + TypeScript + Vite widget that lets users build a custom LEGO minifigure by selecting headgear, face, torso, and legs. Designed to be embedded in a WordPress product page as a self-contained bundle.

---

## Dev Setup

**Prerequisites:** Node.js 18+, npm

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run lint     # ESLint
```

**Build output:**

```
dist/
  customizer.js   # IIFE bundle — enqueue in WordPress
  customizer.css  # extracted styles — enqueue in WordPress
```

---

## WordPress Integration

The app expects two globals to be injected by the WordPress plugin before the bundle loads.

### 1. `window.minifigData`

Provides the REST API endpoint for loading the parts catalog:

```js
window.minifigData = {
  partsApiUrl: "https://yoursite.com/wp-json/minifig/v1/parts"
};
```

### 2. `window.MinifigCustomizer`

Receives selection updates whenever the user changes a part. Implement `addToCart` to wire up WooCommerce or any cart logic:

```js
window.MinifigCustomizer = {
  addToCart({ selection, config, layers, chainEnabled }) {
    // selection    — { headgear: "id", face: "id", torso: "id", legs: "id" }
    // config       — { headgear: "label", face: "label", torso: "label", legs: "label" }
    // layers       — string[] of image URLs in render order (chain → legs → torso → face → headgear)
    //                chain image is prepended automatically when chainEnabled is true
    // chainEnabled — boolean: true = keychain product, false = figure-only product
  }
};
```

### 3. DOM mount point

The page must include this element before the bundle initialises:

```html
<div id="product-customizer"></div>
```

---

## Expected API Response

`partsApiUrl` must return JSON in this shape:

```json
{
  "success": true,
  "data": {
    "headgear": [
      { "id": "hat-01", "label": "Red Hat", "src": "https://..." }
    ],
    "face": [ ... ],
    "torso": [ ... ],
    "legs": [ ... ],
    "backgrounds": [
      "https://.../bg1.jpg",
      "https://.../bg2.jpg"
    ],
    "chain": "https://.../chain.png"
  }
}
```

**CatalogItem fields:**

| Field   | Type   | Required | Notes                        |
|---------|--------|----------|------------------------------|
| `id`    | string | yes      | Unique within the group      |
| `label` | string | yes      | Shown as `alt` text on thumb |
| `src`   | string | yes      | Full URL to the part image   |
| `thumb` | string | no       | Unused currently             |

**`backgrounds`** is a flat array of image URLs. One is picked at random on mount. If the array is empty or missing, the preview falls back to a solid warm-gray background (`#F5F3F0`).

**`chain`** is the URL for the keychain chain image. When present, it is prepended to the `layers` array whenever the user has "Pakabukas" mode active.

---

## Architecture

```
src/
  main.tsx                    # Entry — mounts to #product-customizer
  App.tsx                     # Root layout: Preview + Settings panels
  data/
    catalog.ts                # CatalogItem types, mutable catalog object,
                              # loadCatalog() (fetches API), getRandomBackground(),
                              # chainSrc (chain image URL or null)
  context/
    CustomizerContext.ts      # Context type definition
    CustomizerProvider.tsx    # State owner — loads catalog, manages selection,
                              # chainEnabled toggle, derives ordered layers array
    useCustomizer.ts          # Hook for consuming context
  components/
    Preview.tsx               # Layered <img> render, random bg, preload + pop animation
    Settings.tsx              # Part picker — animated <details> sections with emoji icons
    Toggle.tsx                # Chain toggle — switches between "Pakabukas" / "Tik figūrėlė"
  utils/
    preloader.ts              # Image preload cache (prevents flash on part change)
  styles/                     # Global CSS variables, layout, buttons
```

**Data flow:**

1. `CustomizerProvider` calls `loadCatalog()` on mount → populates `catalog` (parts + backgrounds + chain) and sets initial selection
2. User clicks a part in `Settings` → `setPart(group, id)` updates selection state
3. User toggles the chain mode in `Toggle` → `chainEnabled` flips; `layers` is re-derived
4. `layers` is derived from selection (chain? → legs → torso → face → headgear order)
5. `Preview` preloads new layer images then renders them stacked with a pop animation
6. `App` fires `window.MinifigCustomizer.addToCart()` on every selection or chain-mode change
