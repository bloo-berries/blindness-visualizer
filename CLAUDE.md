# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm start

# Build for production
npm run build

# Run tests (uses Jest with React Testing Library)
npm test

# Run a specific test file
npm test -- tests/ControlPanel.test.tsx

# Check TypeScript types (no built-in command, use build to verify)
npm run build
```

## Architecture Overview

### Core Visual Processing Pipeline
The application uses a multi-layer approach for visual effects processing:

1. **WebGL/Three.js Layer** (`utils/shaderManager.ts`, `utils/threeSceneManager.ts`)
   - Handles GPU-accelerated shader-based effects for color blindness simulations
   - Custom GLSL shaders for complex visual transformations like diplopia, retinitis pigmentosa

2. **CSS Filter Layer** (`utils/cssFilterManager.ts`)
   - Applies browser-native CSS filters for basic effects (blur, contrast, brightness)
   - Manages myopia, hyperopia, and basic visual adjustments

3. **DOM Overlay Layer** (`utils/overlayManager.ts`)
   - Creates HTML canvas overlays for conditions requiring animated or complex patterns
   - Handles glaucoma peripheral vision loss, visual snow, migraine auras

### State Management Pattern
- Uses React Context (`contexts/AccessibilityContext.tsx`) for global accessibility settings
- Component-level state for visual effects configuration
- Effect states stored as arrays with `enabled` and `intensity` properties

### Input Processing
The `Visualizer` component (`components/Visualizer.tsx`) handles three input types:
- **Webcam**: Uses `getUserMedia` API with real-time canvas processing
- **Image Upload**: File input with FileReader API
- **YouTube Videos**: Integration via `react-youtube` library with canvas capture

### Routing Structure
- `/` - Home page with navigation cards
- `/simulator` - Main vision condition simulator
- `/famous-people` - Educational section about famous blind/visually impaired individuals

## Key Implementation Details

### Adding New Vision Conditions
1. Define the effect in `data/visualEffects.ts` or component's effects array
2. Implement processing logic in appropriate layer:
   - Shader effects: Add uniforms and GLSL code in `shaderManager.ts`
   - CSS effects: Add filter logic in `cssFilterManager.ts`
   - Overlay effects: Create overlay function in `overlayManager.ts`
3. Wire up the effect in `Visualizer.tsx` `applyEffects()` method

### Performance Considerations
- Canvas operations use `requestAnimationFrame` for smooth rendering
- Three.js scene optimized with single plane geometry and texture updates
- Effect processing only runs when effects are enabled
- Media stream cleanup handled in component unmount

### TypeScript Configuration
- Strict mode enabled
- Base URL set to `src` for absolute imports
- Target ES5 for browser compatibility
- React JSX transform for React 18+

## Testing Approach
- Uses Jest with React Testing Library
- Test files located in `tests/` directory
- Component testing focuses on user interactions and prop handling
- No E2E testing framework currently configured