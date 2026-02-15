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

## Architecture Overview

This is a React 18 + TypeScript application built with Create React App that simulates various vision conditions in real-time. It uses Three.js for WebGL-based visual effects processing.

### Core Data Flow

1. **Input Sources** (`InputSource` type in `src/types/visualEffects.ts`): webcam, uploaded image, or YouTube video
2. **Effects System**: Effects are defined in `src/data/effects/` and combined in `src/data/visualEffects.ts`
3. **Rendering Pipeline**: The `Visualizer.tsx` component processes input through multiple layers (see below)

### Multi-Layer Rendering System

The rendering pipeline uses multiple techniques simultaneously, each handling different effect types:

| Layer | File | Purpose |
|-------|------|---------|
| WebGL Shaders | `shaderManager.ts`, `shaders/` | Color blindness matrix transformations |
| SVG Filters | `svgFilterManager.ts` | Additional color vision effects |
| CSS Filters | `cssFilterManager.ts` | Blur, contrast adjustments |
| DOM Overlays | `overlayManager.ts` | Visual field loss, scotomas, floaters |

Overlay z-index hierarchy is defined in `overlayConstants.ts` - new overlays must respect this ordering.

### Key Type: `ConditionType`

All vision conditions are typed in `src/types/visualEffects.ts`. When adding new conditions:
1. Add the condition ID to the `ConditionType` union type
2. Create the effect definition in the appropriate `src/data/effects/*.ts` file
3. Implement the visual effect in the shader or overlay system

### Effect Categories

Effects are organized by category in `src/data/effects/`:
- `colorVisionEffects.ts` - Color blindness types (protanopia, deuteranopia, etc.)
- `visualFieldEffects.ts` - Field loss (hemianopia, scotoma, tunnel vision)
- `visualDisturbanceEffects.ts` - Visual snow, auras, floaters
- `retinalEffects.ts` - Retinal diseases (AMD, diabetic retinopathy)
- `ocularEffects.ts` - Eye conditions (cataracts, glaucoma, keratoconus)
- `famousPeopleEffects.ts` - Person-specific effect combinations

### Famous People Feature

The Famous People section (`src/components/FamousBlindPeople.tsx`) links historical/contemporary figures to their specific vision conditions. Person data is in `src/data/famousPeopleData.ts`. Custom overlay effects for specific people are in `src/utils/overlays/famousPeople/`.

**Navigation Flow**: When a user clicks "Experience Simulation" on a person, React Router state passes preconfigured conditions to VisionSimulator:
```typescript
// In VisionSimulator.tsx, received via location.state
location.state?.preconfiguredConditions  // Array of effect IDs
location.state?.personName
location.state?.personCondition
```
This auto-enables the person's effects and skips directly to step 3 (simulation view).

### Routing

Routes are defined in `App.tsx`:
- `/` - HomePage
- `/simulator` - VisionSimulator
- `/famous-people` - FamousBlindPeople
- `/conditions`, `/faq`, `/about`, `/feedback`, `/resources` - Info pages

### Deployment

Deployed to GitHub Pages at `https://bloo-berries.github.io/blindness-visualizer`. The `basename` for React Router is automatically configured based on `PUBLIC_URL`.

## Adding New Effects

### Shader-Based Effects

For effects requiring color/pixel manipulation:

1. Add uniform in `shaderManager.ts`: `myEffectIntensity: { value: 0.0 }`
2. Add GLSL function in `shaders/shaderFunctions.ts`
3. Update `updateShaderUniforms()` to pass the intensity value
4. Add to `ConditionType` union and create effect definition in `src/data/effects/`

### Overlay-Based Effects

For effects requiring DOM elements (scotomas, field loss):

1. Create overlay generator in `src/utils/overlays/`
2. Register in `overlayManager.ts`
3. Respect z-index hierarchy from `overlayConstants.ts`

### Animated Effects

These effects require continuous re-rendering (defined in `EffectPreview.tsx`):
```typescript
['visualAura', 'visualAuraLeft', 'visualAuraRight', 'visualSnow', 'hallucinations']
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
