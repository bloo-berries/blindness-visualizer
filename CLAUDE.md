# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm start          # Start development server (localhost:3000)
npm run build      # Production build (prebuild generates llms + OG images)
npm run build:prod # Production build without sourcemaps
npm test           # Run tests in watch mode
npm test -- --watchAll=false   # Run tests once
npm run clean      # Remove build/ and node_modules/.cache/
npm run generate:llms  # Generate LLM data files
npm run generate:og    # Generate Open Graph images for famous people
npm run build:analyze  # Build and open webpack bundle analyzer
```

**CI note**: CI sets `CI=true`, which treats ESLint warnings as errors. Suppress intentional console statements with `// eslint-disable-next-line no-console`. CI uses Node 18.x, runs `npm ci`, build, and tests (with `--passWithNoTests`). Tests live in `src/__tests__/`.

## Architecture Overview

This is a React 18 + TypeScript application built with Create React App that simulates various vision conditions in real-time. It uses Three.js for WebGL-based visual effects processing.

**At a glance**: 209 famous people, 144 vision condition types, 27 animated effects, 26 languages, 9 pages.

### Core Data Flow

1. **Input Sources** (`InputSource` type in `src/types/visualEffects.ts`): uploaded image or YouTube video (webcam is disabled, forced to YouTube)
2. **Effects System**: Effects are defined in `src/data/effects/` and combined in `src/data/visualEffects.ts`
3. **Rendering Pipeline**: The `Visualizer` component processes input through multiple layers (see below)

### Simulator Flow (2-Step)

The `VisionSimulator.tsx` component has a 2-step flow (no MUI Stepper UI):

| Step | Content | Notes |
|------|---------|-------|
| 0 | **Input Selection** — `InputSelector` for choosing YouTube video or image | Auto-advances to step 1 after 300ms when source is selected |
| 1 | **Conditions & Live Simulation** — `ControlPanel` with embedded `Visualizer` | Users toggle conditions and see effects on live video in real-time |

The `ControlPanel` accepts a `visualizerSlot: React.ReactNode` prop — the `Visualizer` component is passed in as a slot and rendered alongside the effects list. The container widens to `1400px` on step 1 to accommodate the side-by-side layout.

**Note**: The `GuidedTour` component is currently disabled (JSX commented out in `VisionSimulator.tsx`, import removed). The component file remains at `src/components/GuidedTour.tsx`.

### Multi-Layer Rendering System

The rendering pipeline uses multiple techniques simultaneously, each handling different effect types:

| Layer | File | Purpose |
|-------|------|---------|
| WebGL Shaders | `shaders/` directory | Color blindness matrix transformations (for canvas-based rendering) |
| CSS Filters + DOM-injected SVG | `colorVisionFilters.ts`, `cssFilterManager.ts` | Color vision simulation (DOM-injected SVG filters), blur, contrast, person-specific filters (29 custom filter files) |
| DOM Overlays | `overlayManager.ts` | Visual field loss, scotomas, floaters (19 custom person overlays) |
| Animated Overlays | `hooks/animatedOverlays/` | JS-driven animated effects (21 animation files) |

**Color vision filter approach**: `getColorVisionFilter()` in `colorVisionFilters.ts` injects `<filter>` elements with `<feColorMatrix>` into a hidden `<svg id="cvd-svg-filters">` container in `document.body`, returning `url("#cvd-{type}")` references. This DOM-injection approach replaced the earlier data URI method because Safari/WebKit does not support `filter: url("data:image/svg+xml,...")` (WebKit Bug #104169). The Machado 2009 matrices are blended with identity based on intensity. Monochromacy uses CSS `saturate()/contrast()` instead of SVG. `cleanupAllDOMFilters()` removes all injected elements.

Overlay z-index hierarchy is defined in `overlayConstants.ts` — new overlays must respect this ordering:
- `Z_INDEX.VISUAL_FIELD_LOSS`: 9000 (top)
- `Z_INDEX.BASE`: 5000 (default overlays)
- `Z_INDEX.DIPLOPIA`: 5001
- `Z_INDEX.VISUAL_DISTURBANCE`: 4000
- `Z_INDEX.ANIMATED`: 10 (relative)
- `Z_INDEX.ANIMATED_VISUAL_FIELD_LOSS`: 110

**Important**: CSS filters on the parent container also affect animated overlay children. When creating dark-themed animated overlays (e.g., Fujitora, Julia Carpenter), let the overlay itself provide darkness via its base gradient and keep the CSS filter brightness moderate (45%+). Crushing brightness below ~15% in the CSS filter will make overlays invisible.

### Visualizer Hooks (`src/components/Visualizer/hooks/`)

The Visualizer component uses modular hooks:
- `useAnimatedOverlay` - Visual Aura, CBS Hallucinations, Blue Field, PPVP, Palinopsia, Starbursting, and person-specific animated effects (21 individual animation files in `hooks/animatedOverlays/`)
- `useVisualFieldOverlay` - Retinitis Pigmentosa, AMD, glaucoma, tunnel vision, hemianopia overlays
- `useScreenshot` - Screenshot capture functionality

### Shader System (`src/utils/shaders/`)

The shader system is modular:
- `fragmentShader/` - GLSL code split by category: `colorBlindnessFunctions.ts`, `retinalFunctions.ts`, `diplopiaFunctions.ts`, `glaucomaFunction.ts`, `miltonFunctions.ts`, `galileoFunctions.ts`, `utilityFunctions.ts`, `uniformDeclarations.ts`, `mainFunction.ts`. Barrel `index.ts` combines all parts via `getFragmentShader()`.
- `shaderUniforms.ts` - Uniform declarations for Three.js (31 uniforms)
- `uniformUpdater.ts` - Updates uniform values based on active effects
- `shaderMaterial.ts` - Creates the Three.js ShaderMaterial (imports `getFragmentShader` from `./fragmentShader`)
- `meshCreator.ts` - Creates the WebGL mesh
- `index.ts` - Barrel exports

### Key Type: `ConditionType`

All 144 vision conditions are typed in `src/types/visualEffects.ts`. When adding new conditions:
1. Add the condition ID to the `ConditionType` union type
2. Create the effect definition in the appropriate `src/data/effects/*.ts` file
3. Implement the visual effect in the shader or overlay system

### Effect Categories

Effects are organized by category in `src/data/effects/`:
- `colorVisionEffects.ts` - Color blindness types (protanopia, deuteranopia, etc.)
- `visualFieldEffects.ts` - Field loss (hemianopia, scotoma, tunnel vision)
- `visualDisturbanceEffects.ts` - Visual snow, auras, floaters, PPVP, palinopsia, starbursting
- `retinalEffects.ts` - Retinal diseases (AMD, diabetic retinopathy)
- `ocularEffects.ts` - Eye conditions (cataracts, glaucoma, keratoconus)
- `famousPeopleEffects/` - Person-specific effect combinations (37 individual files in `src/data/effects/famousPeopleEffects/`)

### Famous People Feature

The Famous People section (`src/components/FamousBlindPeople.tsx`) links 209 historical/contemporary/fictional figures to their specific vision conditions. Person data is organized by category in `src/data/famousPeople/`:
- `types.ts` - Type definitions (`PersonData`, etc.)
- `contemporaryFigures.ts` - Contemporary public figures (14 people)
- `athletes.ts` - Athletes (30 people)
- `scientists.ts` - Scientists and medical professionals (16 people)
- `musicians.ts` - Musicians (56 people)
- `artists.ts` - Visual artists (6 people)
- `writersActivists.ts` - Writers, poets, activists, and politicians (47 people)
- `historicalFigures.ts` - Historical figures (15 people)
- `fictionalCharacters.ts` - Fictional characters (25 people)
- `constants.ts` - Pre-computed lookup sets (`PERSON_IDS`, `CATEGORY_PEOPLE_SETS`, `PRECOMPUTED_CONDITION_CATEGORIES`, `PRECOMPUTED_COUNTRIES`) for O(1) filtering
- `index.ts` - Aggregates all categories, defines display order

Sub-components in `src/components/FamousBlindPeople/`:
- `PersonCard.tsx` - Individual card with lazy-loaded image and custom `CUSTOM_POSITIONS` map for per-person image cropping
- `PersonDialog.tsx` - Detail modal for each person
- `EmbeddedVisualization.tsx` - Live simulation embedding within the dialog

Custom overlay effects for specific people are in `src/utils/overlays/famousPeople/` (19 overlay files).

Custom CSS filter files for specific people are in `src/utils/cssFilters/famousPeopleFilters/` (29 filter files + filterConfig.ts, customFilters.ts, index.ts).

**Navigation Flow**: When a user clicks "Experience Simulation" on a person, React Router state passes preconfigured conditions to VisionSimulator:
```typescript
// In VisionSimulator.tsx, received via location.state
location.state?.preconfiguredConditions  // Array of effect IDs
location.state?.personName
location.state?.personCondition
```
This auto-enables the person's effects at full intensity and skips directly to step 1 (conditions & live simulation). A blue banner displays the person's name and condition. Pressing back from step 1 navigates to `/famous-people` instead of step 0.

### Routing

Routes are defined in `App.tsx`:
- `/` - HomePage
- `/simulator` - VisionSimulator
- `/famous-people` - FamousBlindPeople
- `/conditions` - ConditionsPage (Glossary)
- `/faq` - FAQPage
- `/about` - AboutPage
- `/feedback` - FeedbackPage
- `/resources` - ResourcesPage
- `*` - NotFoundPage (404)

### Build Scripts (`scripts/`)

The `prebuild` npm script runs both generators before each build:

- `generate-llms-txt.mjs` — Parses condition and people TS source files via regex, produces `public/llms.txt` (concise) and `public/llms-full.txt` (comprehensive) for AI crawlers
- `generate-og-images.mjs` — Generates 1200x630 PNG Open Graph images per person using Sharp, plus `public/og/metadata.json` consumed by the Cloudflare middleware
- `lib/people-parser.mjs` — Shared module extracting person-parsing logic (regex-based TS parsing without a compiler): `loadAllPeople()`, `parsePeopleFile()`, `parsePersonBlock()`, `parseFamousPeopleIndex()`, `unquote()`, `read()`, `BASE_URL`, `PEOPLE_DIR`

Generated OG images (`public/og/`) are gitignored and rebuilt on each deploy.

### Deployment

Deployed to Cloudflare Pages at `https://theblind.spot`. Configuration is in `wrangler.jsonc`. The GitHub repo is connected to Cloudflare Pages for automatic deployments on push to `main`. SPA routing is handled by Cloudflare's `not_found_handling: "single-page-application"` setting. The `basename` for React Router is automatically configured via `getBasename()` in `App.tsx`, which reads `process.env.PUBLIC_URL`.

**Cloudflare Pages Middleware** (`functions/_middleware.ts`): Intercepts crawler requests (Facebook, Twitter, LinkedIn, Slack, Discord, etc.) to `/famous-people?person=X` and injects person-specific OG meta tags into the HTML response. Loads person metadata from `/og/metadata.json`. Non-crawler requests pass through unchanged. The `PageMeta` component (`src/components/PageMeta.tsx`) handles client-side OG tags via `react-helmet-async` and accepts an optional `ogImage` prop for per-person images.

**GitHub Pages** is a secondary deployment target (`.github/workflows/deploy-gh-pages.yml`) using `PUBLIC_URL=/blindness-visualizer`. The `public/404.html` handles SPA routing for GH Pages.

## Theme System

Three theme modes are available, controlled via `AccessibilityContext`:

| Mode | Default | Background | Text | Primary |
|------|---------|------------|------|---------|
| `light` | No | `#f8fafc` | `#1e293b` | `#1e3a8a` |
| `dim` | **Yes** | `#15202b` | `#e7e9ea` | `#60a5fa` |
| `dark` | No | `#000000` | `#e7e9ea` | `#60a5fa` |

**How it works**:
1. CSS variables are defined in `src/styles/App.css` — `:root` (light), `.dim-mode`, `.dark-mode`
2. `AccessibilityContext` applies the CSS class (`dim-mode` or `dark-mode`) to `document.documentElement`
3. MUI theme is built dynamically in `App.tsx` via `buildTheme()` based on the current mode
4. Preferences persist to `localStorage` key `accessibility-preferences` (wrapped in try-catch for incognito mode)
5. Existing users migrated from light -> dim default via one-time `theme-migrated-v1` flag
6. FOUC prevention: script in `public/index.html` applies theme class before React renders

Key CSS variables: `--color-bg-default`, `--color-bg-paper`, `--color-text-primary`, `--color-text-secondary`, `--color-border`, `--color-navbar-bg`, `--color-card-bg`, `--color-primary`, `--color-drawer-bg`, `--color-info-bg`, `--color-search-bg`, etc.

## Adding New Effects

### Shader-Based Effects

For effects requiring color/pixel manipulation:

1. Add uniform in `shaders/shaderUniforms.ts`
2. Add GLSL function in the appropriate file under `shaders/fragmentShader/` (e.g., `retinalFunctions.ts`)
3. Update `shaders/uniformUpdater.ts` to pass the intensity value
4. Add to `ConditionType` union and create effect definition in `src/data/effects/`

### Overlay-Based Effects

For effects requiring DOM elements (scotomas, field loss):

1. Create overlay generator in `src/utils/overlays/`
2. Register in `overlayManager.ts`
3. Respect z-index hierarchy from `overlayConstants.ts`

### Animated Effects

These effects require continuous re-rendering (listed in `hooks/useAnimatedOverlay.ts` via `EFFECT_GENERATORS` registry + `ANIMATED_EFFECTS`):
```typescript
// 25 generator entries + 'visualFloaters' + 'neoMatrixCodeVisionComplete' = 27 total
```

To add a new animated effect:
1. Create the overlay generator function in `hooks/animatedOverlays/`
2. Export it from `hooks/animatedOverlays/index.ts`
3. Import it in `useAnimatedOverlay.ts` and add to `EFFECT_GENERATORS` registry
4. The effect is automatically included in `ANIMATED_EFFECTS` via `Object.keys(EFFECT_GENERATORS)`
5. If the effect needs custom CSS filters, create a filter file in `src/utils/cssFilters/famousPeopleFilters/` and register it in the index

## Error Handling

- **ErrorBoundary** (`src/components/ErrorBoundary.tsx`): Wraps the React tree. Shows fallback UI with "Refresh Page" button on unhandled errors.
- **localStorage**: All `localStorage.setItem()` calls are wrapped in try-catch to prevent `QuotaExceededError` crashes in private/incognito mode (affects `AccessibilityContext.tsx`, `GuidedTour.tsx`, `PresetManager.tsx`).
- **WebGL**: `createSceneManager()` in `threeSceneManager.ts` may throw if WebGL is unavailable. The `Visualizer` catches this and shows an error message, falling back to CSS-only rendering for YouTube/image sources.

## Adding New Famous People

1. Add person data to the appropriate file in `src/data/famousPeople/` (e.g., `musicians.ts`, `athletes.ts`)
2. Required `PersonData` fields: `name`, `condition`, `years`, `onset`, `simulation`, `description`, `nationality` (`{ country, flag }`). Optional: `achievement`, `wikiUrl`
3. Add their image to `public/images/people/` (filename should match the convention used by existing images)
4. Map their `simulation` key to effect IDs in `src/utils/famousPeopleUtils.tsx` (`getSimulationConditions`)
5. If the person needs custom image cropping, add an entry to `CUSTOM_POSITIONS` in `src/components/FamousBlindPeople/PersonCard.tsx`
6. Optionally create custom effects (`src/data/effects/famousPeopleEffects/`), CSS filters (`src/utils/cssFilters/famousPeopleFilters/`), DOM overlays (`src/utils/overlays/famousPeople/`), or animated overlays (`src/components/Visualizer/hooks/animatedOverlays/`) for unique visualizations

## Performance

`PerformanceOptimizer` (`performanceOptimizer.ts`) is a singleton that throttles animation frame rate based on enabled effect count:
- 1-3 effects: 60 FPS
- 4-5 effects: 45 FPS
- 6+ effects: 30 FPS

All page components use `React.lazy()` with Suspense for code splitting.

## Accessibility System

The `AccessibilityContext` persists user preferences to localStorage and applies CSS classes to `document.documentElement`:

| Preference | CSS Class | WCAG Criterion |
|------------|-----------|----------------|
| High Contrast | `high-contrast-mode` | 1.4.3 (Contrast Minimum) |
| Large Text (125%) | `large-text-mode` | 1.4.4 (Resize Text) |
| Increased Spacing | `increased-spacing-mode` | 1.4.8 (Visual Presentation) |
| Enhanced Focus | `enhanced-focus-mode` | 2.4.7 (Focus Visible) |
| Reduced Motion | `reduced-motion-mode` | 2.3.3 (Animation from Interactions) |

Styles for these classes are defined in `styles/Accessibility.css` (~700 lines).

Additional accessibility features:
- **Skip-to-content link**: Visible on focus, jumps to `#main-content`
- **Keyboard shortcut**: Alt+A (Windows/Linux) or Option+A (Mac) opens the accessibility menu
- **RTL support**: Arabic (`ar`) sets `document.documentElement.dir = "rtl"`
- **Semantic HTML**: `nav`, `main`, `role` attributes, `aria-label`, `aria-current="page"`

The `NavigationBar` includes a theme toggle (cycles light -> dim -> dark), language selector, and accessibility menu. On mobile, navigation collapses into a right-side drawer (280px wide) and the start-simulator shortcut icon is hidden.

## Internationalization (i18n)

Uses `i18next` + `react-i18next` with 26 languages. Configuration is in `src/i18n/index.ts`, translation files in `src/locales/{lang}.json`.

- Language preference persists to `localStorage` key `language-preference`
- Browser auto-detection is disabled; defaults to English
- Arabic (`ar`) has RTL support — `document.documentElement.dir` updates on language change
- All user-facing strings should use the `useTranslation()` hook: `const { t } = useTranslation();`

To add a new language: add the JSON file in `src/locales/`, import it in `src/i18n/index.ts`, and add to both `supportedLanguages` and `resources`.

## PWA Support

Configured via `public/manifest.json` and `src/service-worker.ts` (Workbox):
- Display mode: `standalone`
- App shortcuts: Simulator, Famous People, Glossary
- Service worker: precaches build assets, Cache-First for images (60 entries, 30-day expiry), Stale-While-Revalidate for Google Fonts
- Icons: favicon.ico, logo192.png, logo512.png (maskable)

## SEO

- `PageMeta` component (`src/components/PageMeta.tsx`) uses `react-helmet-async` for per-page meta tags (title, description, OG, Twitter Card, canonical URL, JSON-LD)
- Structured data: WebApplication, EducationalOrganization, Dataset schemas in `public/index.html`
- OG images: Per-person 1200x630 PNGs generated at build time, served via Cloudflare middleware for crawlers

## Content Security Policy

CSP is set **only** in `public/_headers` (Cloudflare Pages HTTP header). There is no CSP meta tag in `index.html` — this is intentional to maintain a single source of truth. Do NOT add a CSP meta tag; if both exist, browsers enforce both independently and the stricter one wins, causing hard-to-debug blocking.

Allowed external domains:
- **Wistia** (`fast.wistia.com`, `*.wistia.com`) — embedded video player
- **YouTube** (`youtube.com`, `www.youtube.com`, `i.ytimg.com`, `s.ytimg.com`, `yt3.ggpht.com`) — video source
- **Formspree** (`formspree.io`) — feedback form submissions
- **Sentry** (`browser.sentry-cdn.com`, `*.sentry-cdn.com`, `*.sentry.io`) — used by Wistia player for error reporting
- **Cloudflare Analytics** (`static.cloudflareinsights.com`, `cloudflareinsights.com`) — web analytics

When adding new external resources, update `public/_headers` or requests will be blocked.

## Known Redundancies and Dead Code

No known dead code remains. Previous items (`svgFilterManager.ts`, `shaderFunctions.ts`, orphaned SVG filters in `index.html`, stale `GuidedTour` import) have been cleaned up.
