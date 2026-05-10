# Vision Condition Visualizer — Documentation

**Live site**: [theblind.spot](https://theblind.spot)

A web-based tool that simulates vision conditions in real-time, helping users understand how people with various visual impairments experience the world.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/bloo-berries/blindness-visualizer.git
cd blindness-visualizer
npm install
npm start
```

The app opens at `http://localhost:3000`.

### Build

```bash
npm run build          # Production build
npm run build:prod     # Production build without sourcemaps
npm test               # Run tests
```

## Usage

### Step 1 — Choose an Input Source

The simulator accepts two input types:

| Input | Format | Notes |
|-------|--------|-------|
| **Image upload** | JPEG, PNG, WebP, GIF | Any resolution; displayed at container size |
| **YouTube video** | YouTube URL | Embedded via YouTube IFrame API |

### Step 2 — Select and Configure Conditions

After selecting an input, the simulator displays a control panel alongside a live preview. Users can:

- **Toggle conditions** from 148 available types across 6 categories
- **Adjust intensity** (0–100%) per condition via sliders
- **Stack multiple conditions** to see combined effects
- **Save screenshots** of the current simulation

### Famous People Section

Browse 209+ individuals with vision conditions. Each profile includes:

- Biographical details and achievements
- Medical condition information
- A live embedded simulation preview
- An "Experience Simulation" button that loads their exact conditions into the simulator

Filter by name, condition category, or country.

## External Interface

### Web Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with navigation to simulator and famous people |
| `/simulator` | Vision Simulator | Core simulation tool (2-step flow: input selection, then live simulation) |
| `/famous-people` | Famous People | Browse 209+ individuals; supports `?person=<id>` query parameter |
| `/conditions` | Glossary | Reference list of all 148 vision conditions |
| `/faq` | FAQ | Frequently asked questions |
| `/about` | About | Project background and mission |
| `/feedback` | Feedback | User feedback form (submitted via Formspree) |
| `/resources` | Resources | External links and further reading |

### Simulator Input

| Input | Method | Accepted Values |
|-------|--------|-----------------|
| Image | File upload | JPEG, PNG, WebP, GIF |
| Video | YouTube URL | Any public YouTube video URL |

### Simulator Output

The simulator renders the selected input with vision condition effects applied in real-time. The output is purely visual (displayed on-screen) and can be captured as a PNG screenshot.

### Rendering Pipeline

Effects are applied through four simultaneous layers:

| Layer | Technology | Effect Types |
|-------|-----------|--------------|
| WebGL Shaders | Three.js / GLSL | Color blindness matrix transformations |
| CSS Filters + SVG | DOM-injected `<feColorMatrix>` | Color vision simulation, blur, contrast |
| DOM Overlays | Positioned HTML elements | Visual field loss, scotomas, floaters |
| Animated Overlays | JavaScript `requestAnimationFrame` | Dynamic effects (auras, hallucinations, light perception) |

### Vision Condition Categories

| Category | Count | Examples |
|----------|-------|---------|
| Color Vision | 12 | Protanopia, Deuteranopia, Tritanopia, Achromatopsia |
| Visual Field | 18 | Hemianopia, Quadrantanopia, Scotoma, Tunnel Vision |
| Visual Disturbances | 10 | Visual Snow, Auras, Floaters, Palinopsia, Starbursting |
| Retinal Diseases | 8 | AMD, Diabetic Retinopathy, Retinitis Pigmentosa |
| Ocular Conditions | 10 | Cataracts, Glaucoma, Keratoconus |
| Refractive Errors | 6 | Myopia, Hyperopia, Astigmatism, Diplopia |

### Preconfigured Simulation via Navigation

When navigating from a famous person's profile to the simulator, conditions are passed via React Router state:

```
/simulator
  state: {
    preconfiguredConditions: string[]   // Array of condition IDs
    personName: string                  // Display name
    personCondition: string             // Condition description
  }
```

### Accessibility Settings

Users can configure these preferences (persisted to localStorage):

| Setting | Effect |
|---------|--------|
| Theme | Light / Dim (default) / Dark |
| High Contrast | Increased contrast ratios |
| Large Text | 125% font size |
| Increased Spacing | More whitespace between elements |
| Enhanced Focus | More visible focus indicators |
| Reduced Motion | Disables animations |

### Internationalization

26 languages supported. Language is selected via the navigation bar and persisted to localStorage. Arabic uses RTL layout.

### PWA

The app is installable as a Progressive Web App with offline support for cached assets.
