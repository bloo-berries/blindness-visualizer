# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm start          # Start development server (localhost:3000)
npm run build      # Production build
npm run build:prod # Production build without sourcemaps
npm test           # Run tests in watch mode
npm test -- --watchAll=false   # Run tests once
npm run clean      # Remove build/ and node_modules/.cache/
```

**CI note**: GitHub Pages CI sets `process.env.CI = true`, which treats ESLint warnings as errors. Suppress intentional console statements with `// eslint-disable-next-line no-console`.

## Architecture Overview

This is a React 18 + TypeScript application built with Create React App that simulates various vision conditions in real-time. It uses Three.js for WebGL-based visual effects processing.

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

### Multi-Layer Rendering System

The rendering pipeline uses multiple techniques simultaneously, each handling different effect types:

| Layer | File | Purpose |
|-------|------|---------|
| WebGL Shaders | `shaders/` directory | Color blindness matrix transformations |
| SVG Filters | `svgFilterManager.ts` | Additional color vision effects |
| CSS Filters | `cssFilterManager.ts` | Blur, contrast adjustments |
| DOM Overlays | `overlayManager.ts` | Visual field loss, scotomas, floaters |

Overlay z-index hierarchy is defined in `overlayConstants.ts` - new overlays must respect this ordering.

### Visualizer Hooks (`src/components/Visualizer/hooks/`)

The Visualizer component uses modular hooks:
- `useMediaSetup` - Webcam/video/image source initialization
- `useEffectProcessor` - Main effect processing pipeline
- `useAnimatedOverlay` - Visual Aura, CBS Hallucinations, Blue Field, PPVP, Palinopsia, Starbursting, and person-specific animated effects (20+ individual animation files in `hooks/animatedOverlays/`)
- `useVisualFieldOverlay` - Retinitis Pigmentosa, AMD, glaucoma, tunnel vision, hemianopia overlays
- `useScreenshot` - Screenshot capture functionality

### Shader System (`src/utils/shaders/`)

The shader system is modular:
- `fragmentShader.ts` - GLSL code organized by category (color blindness, retinal, diplopia, etc.)
- `shaderUniforms.ts` - Uniform declarations for Three.js
- `uniformUpdater.ts` - Updates uniform values based on active effects
- `shaderMaterial.ts` - Creates the Three.js ShaderMaterial
- `shaderFunctions.ts` - Additional GLSL helper functions

### Key Type: `ConditionType`

All vision conditions are typed in `src/types/visualEffects.ts`. When adding new conditions:
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
- `famousPeopleEffects.ts` - Person-specific effect combinations (36+ individual files in `src/data/effects/famousPeopleEffects/`)

### Famous People Feature

The Famous People section (`src/components/FamousBlindPeople.tsx`) links historical/contemporary figures to their specific vision conditions. Person data is in `src/data/famousPeopleData.ts`. Custom overlay effects for specific people are in `src/utils/overlays/famousPeople/`.

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

### Deployment

Deployed to GitHub Pages at `https://bloo-berries.github.io/blindness-visualizer`. The `basename` for React Router is automatically configured via `getBasename()` in `App.tsx`, which reads `process.env.PUBLIC_URL`.

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
4. Preferences persist to `localStorage` key `accessibility-preferences`
5. Existing users migrated from light → dim default via one-time `theme-migrated-v1` flag

Key CSS variables: `--color-bg-default`, `--color-bg-paper`, `--color-text-primary`, `--color-text-secondary`, `--color-border`, `--color-navbar-bg`, `--color-card-bg`, `--color-primary`, `--color-drawer-bg`, etc.

## Adding New Effects

### Shader-Based Effects

For effects requiring color/pixel manipulation:

1. Add uniform in `shaders/shaderUniforms.ts`
2. Add GLSL function in `shaders/fragmentShader.ts` (in appropriate category section)
3. Update `shaders/uniformUpdater.ts` to pass the intensity value
4. Add to `ConditionType` union and create effect definition in `src/data/effects/`

### Overlay-Based Effects

For effects requiring DOM elements (scotomas, field loss):

1. Create overlay generator in `src/utils/overlays/`
2. Register in `overlayManager.ts`
3. Respect z-index hierarchy from `overlayConstants.ts`

### Animated Effects

These effects require continuous re-rendering (listed in `hooks/useAnimatedOverlay.ts` as `ANIMATED_EFFECTS`):
```typescript
['visualAura', 'visualAuraLeft', 'visualAuraRight', 'hallucinations', 'blueFieldPhenomena', ...]
// 21+ effect IDs total — check ANIMATED_EFFECTS constant for full list
```

## Performance

`PerformanceOptimizer` (`performanceOptimizer.ts`) is a singleton that throttles animation frame rate based on enabled effect count:
- 1-3 effects: 60 FPS
- 4-5 effects: 45 FPS
- 6+ effects: 30 FPS

## Accessibility System

The `AccessibilityContext` persists user preferences to localStorage and applies CSS classes to `document.documentElement`:

| Preference | CSS Class |
|------------|-----------|
| High Contrast | `high-contrast-mode` |
| Large Text | `large-text-mode` |
| Increased Spacing | `increased-spacing-mode` |
| Enhanced Focus | `enhanced-focus-mode` |
| Reduced Motion | `reduced-motion-mode` |

Styles for these classes are defined in `styles/Accessibility.css`.

The `NavigationBar` includes a theme toggle (cycles light → dim → dark), language selector, and accessibility menu. On mobile, navigation collapses into a right-side drawer (280px wide) and the start-simulator shortcut icon is hidden.

## Bundle Analysis

```bash
npm run build:analyze  # Build and open webpack bundle analyzer
```
