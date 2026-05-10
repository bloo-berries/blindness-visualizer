# Security Assurance Case

## 1. Introduction

This document provides a security assurance case for **The Blind Spot** — a client-side React 18 + TypeScript application that simulates vision conditions in real-time. It is deployed as a static site on Cloudflare Pages at `https://theblind.spot`.

**Scope**: The application has no backend server, no database, no user authentication, and no server-side data processing. All vision simulation runs entirely in the user's browser via WebGL shaders, CSS filters, and DOM overlays. The only server-side component is a Cloudflare Pages middleware that injects Open Graph meta tags for social media crawlers.

**Related documents**:
- [SECURITY.md](../SECURITY.md) — Vulnerability disclosure policy and response timelines

## 2. Threat Model

### 2.1 Attack Surfaces

| Surface | Description | Entry Point |
|---------|-------------|-------------|
| **User-uploaded images** | Users can upload local image files for vision simulation | `src/components/InputSelector.tsx` file input |
| **Preset sharing (Base64 URL params)** | Encoded condition presets shared via URL query parameters | `src/components/PresetManager.tsx` decode logic |
| **YouTube postMessage** | Cross-origin messaging with embedded YouTube iframe player | `src/components/YouTubeEmbed.tsx` message handler |
| **Feedback form** | User-submitted form data sent to Formspree | `src/components/FeedbackPage.tsx` form submission |
| **Cloudflare middleware HTML injection** | Server-side meta tag injection for crawler requests | `functions/_middleware.ts` |
| **Third-party scripts** | Wistia video player, Sentry (via Wistia), Cloudflare Analytics | Loaded via CSP-allowed domains |
| **Service worker** | Caches assets and handles offline navigation | `src/service-worker.ts` |
| **localStorage** | Persists user preferences (theme, accessibility, presets, language) | `src/contexts/AccessibilityContext.tsx` |

### 2.2 Threat Actors

| Actor | Motivation | Capabilities |
|-------|------------|--------------|
| **Malicious end user** | XSS, data exfiltration, phishing via shared links | Crafted URLs, malicious image uploads, manipulated presets |
| **Compromised third-party CDN** | Supply chain attack via Wistia, Sentry, or Cloudflare Analytics scripts | Script injection within CSP-allowed domains |

### 2.3 Out of Scope

- Cloudflare Pages infrastructure security (managed by Cloudflare)
- YouTube, Wistia, and Formspree service-level security
- Browser sandbox escapes
- Physical access to the user's device

## 3. Trust Boundaries

```
+------------------------------------------------------------------+
|  USER'S BROWSER (sandbox)                                        |
|                                                                  |
|  +----------------------------+   +---------------------------+  |
|  | User Input                 |   | localStorage              |  |
|  | - Image files              |   | - Theme preferences       |  |
|  | - Preset URLs              |   | - Accessibility settings  |  |
|  | - Feedback form data       |   | - Saved presets            |  |
|  +----------+-----------------+   | - Language preference      |  |
|             |                     +---------------------------+  |
|             v                                                    |
|  +-----------------------------------------------------------+  |
|  | React Application (client-only)                            |  |
|  | - Input validation (file type, size, preset format)        |  |
|  | - WebGL rendering (Three.js shaders)                       |  |
|  | - CSS filter/overlay system                                |  |
|  | - React auto-escaping (XSS prevention)                     |  |
|  +-------+----------------+----------------+-----------------+  |
|          |                |                |                     |
+----------|----------------|----------------|---------------------+
           |                |                |
   TRUST BOUNDARY          |        TRUST BOUNDARY
           |                |                |
           v                v                v
+----------------+ +----------------+ +------------------+
| Cloudflare     | | YouTube        | | Formspree        |
| Pages          | | (iframe embed) | | (feedback POST)  |
| - Static files | | - postMessage  | |                  |
| - CSP headers  | | - Video stream | |                  |
| - OG meta      | +----------------+ +------------------+
|   injection    |
+----------------+ +------------------+
                   | Third-party CDNs |
                   | - Wistia         |
                   | - Sentry         |
                   | - CF Analytics   |
                   +------------------+
```

**Key boundaries**:
1. **Browser → React app**: All user input (images, presets, form data) is validated before use
2. **React app → Cloudflare Pages**: Static hosting only; the middleware injects HTML but escapes all dynamic values
3. **React app → YouTube iframe**: postMessage origin is checked before processing
4. **React app → Formspree**: Form data is sent via HTTPS POST; CSP restricts `connect-src` to `formspree.io`
5. **React app → Third-party scripts**: CSP restricts which domains can execute scripts

## 4. Secure Design Principles

This section maps each of Saltzer & Schroeder's secure design principles to concrete evidence in the codebase.

### 4.1 Least Privilege

The application requests **no permissions** beyond what a static web page receives:
- No backend server, no database, no authentication system
- No access to camera (webcam option is disabled; `InputSelector.tsx:68-73`)
- No cookies — preferences stored in localStorage only
- Service worker limited to caching build assets and fonts (`src/service-worker.ts:15-53`)

### 4.2 Economy of Mechanism

Security mechanisms are kept simple with single sources of truth:
- **CSP defined in one place**: `public/_headers` (lines 1-5) — no meta tag duplicate, avoiding conflicting policies
- **Input validation is straightforward**: file type check via `file.type.startsWith('image/')`, file size check against a constant (`InputSelector.tsx:31,338-346`)
- **Preset decoding**: simple try-catch with array type check (`PresetManager.tsx:48-62`)

### 4.3 Complete Mediation

Every external input is validated before use:

| Input | Validation | Location |
|-------|-----------|----------|
| YouTube postMessage | Origin checked against `youtube.com` and `youtube-nocookie.com`; source checked against specific iframe | `YouTubeEmbed.tsx:48-50` |
| Shared presets | Base64 decoded in try-catch; parsed JSON checked for `.c` array property | `PresetManager.tsx:48-62` |
| Image uploads | MIME type must start with `image/`; size capped at 20 MB | `InputSelector.tsx:31,338-346` |
| Feedback form | All required fields validated non-empty before submit enabled | `FeedbackPage.tsx:166` |
| Crawler meta injection | All dynamic values passed through `escapeHtml()` | `_middleware.ts:85-91` |

### 4.4 Open Design

- The entire application is **open source** — security does not depend on obscurity
- CSP rules, validation logic, and rendering pipelines are all publicly auditable
- This security assurance case itself is published in the repository

### 4.5 Fail-Safe Defaults

The application defaults to a safe state on errors:

| Scenario | Behavior | Location |
|----------|----------|----------|
| localStorage unavailable (incognito) | Falls back to default preferences; `setItem` wrapped in try-catch | `AccessibilityContext.tsx:54-68,75-79` |
| Invalid preset URL | `decodePreset()` returns `null`; no conditions are enabled | `PresetManager.tsx:48-62` |
| WebGL unavailable | Falls back to CSS-only rendering | Visualizer component |
| Unhandled React error | `ErrorBoundary` catches and shows a "Refresh Page" fallback UI | `ErrorBoundary.tsx:34-88` |
| Metadata fetch fails in middleware | Returns `null`; request passes through unchanged | `_middleware.ts:74-83` |
| YouTube message parse fails | Silently caught; no action taken | `YouTubeEmbed.tsx:58-60` |

### 4.6 Separation of Privilege

CSP enforces per-resource-type domain allowlists rather than a blanket permission:

| Directive | Allowed Domains | Purpose |
|-----------|----------------|---------|
| `script-src` | `'self'`, Wistia, Sentry, CF Analytics | Only vetted script sources |
| `connect-src` | `'self'`, YouTube, Wistia, Formspree, Sentry, CF Analytics | API/data endpoints |
| `frame-src` | `'self'`, YouTube, Wistia | Embedded video only |
| `img-src` | `'self'`, `data:`, `blob:`, Wistia, YouTube thumbnails | Image sources |
| `object-src` | `'none'` | Blocks plugins (Flash, Java) entirely |
| `form-action` | `'self'` | Prevents form submissions to arbitrary origins |
| `base-uri` | `'self'` | Prevents `<base>` tag hijacking |

See `public/_headers:1-2` for the full policy.

### 4.7 Least Common Mechanism

- **No shared server state**: Each user's session is fully independent; all state lives in the browser
- **No shared database**: Preferences, presets, and settings are per-browser via localStorage
- **No inter-user communication**: Users cannot interact with each other through the application
- **Static hosting**: Cloudflare Pages serves identical files to all users

### 4.8 Psychological Acceptability

Security controls do not impede the user experience:
- **Graceful degradation**: WebGL failures fall back to CSS rendering; localStorage failures use defaults
- **User-friendly errors**: ErrorBoundary shows a clear "Refresh Page" button, not a stack trace (`ErrorBoundary.tsx:56-68`)
- **Error details only in development**: Stack traces shown only when `NODE_ENV === 'development'` (`ErrorBoundary.tsx:70-84`)
- **Transparent data policy**: InputSelector includes an accessible data policy dialog explaining client-only processing (`InputSelector.tsx:287-326`)

## 5. Common Weakness Mitigations

### CWE-79: Cross-Site Scripting (XSS)

| Control | Implementation |
|---------|---------------|
| React auto-escaping | All JSX expressions are escaped by default; no user input is rendered via `dangerouslySetInnerHTML` |
| Middleware HTML escaping | `escapeHtml()` sanitizes `&`, `"`, `<`, `>` in all injected meta tag values (`_middleware.ts:85-91`) |
| Content Security Policy | `script-src` restricts script execution to `'self'` and specific CDN domains (`public/_headers:1-2`) |
| No `innerHTML` with user data | User-provided strings (preset names, form data) are always rendered through React's JSX escaping |

### CWE-94: Code Injection

| Control | Implementation |
|---------|---------------|
| No `eval()` usage | The codebase does not use `eval()`, `Function()`, or `setTimeout(string)` |
| No dynamic script loading | All scripts are either bundled at build time or loaded from CSP-allowed CDN domains |
| `object-src 'none'` | Prevents plugin-based code execution (Flash, Java applets) (`public/_headers:1-2`) |

### CWE-502: Insecure Deserialization

| Control | Implementation |
|---------|---------------|
| Preset validation | `decodePreset()` wraps `atob()` + `JSON.parse()` in try-catch; validates the parsed object has a `.c` property that is an `Array` before use (`PresetManager.tsx:48-62`) |
| No `eval` of deserialized data | Preset condition IDs are matched against known effect types — arbitrary code in IDs has no execution path |

### CWE-16: Security Misconfiguration

| Header | Value | Purpose |
|--------|-------|---------|
| `Content-Security-Policy` | See Section 4.6 | Restricts resource loading to vetted origins |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing attacks |
| `X-Frame-Options` | `DENY` | Prevents clickjacking (see CWE-1021) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer information leakage |

All headers defined in `public/_headers:1-5`.

### CWE-200: Sensitive Data Exposure

| Control | Implementation |
|---------|---------------|
| No server-side user data | Application processes no personal data server-side; images stay in-browser |
| Dev-only error details | Error stack traces only displayed when `process.env.NODE_ENV === 'development'` (`ErrorBoundary.tsx:70-84`) |
| localStorage-only persistence | User preferences stored locally; never transmitted to a server |
| No authentication tokens | No auth system means no tokens, sessions, or credentials to protect |

### CWE-1021: Clickjacking

| Control | Implementation |
|---------|---------------|
| `X-Frame-Options: DENY` | Prevents the application from being embedded in iframes on other sites (`public/_headers:4`) |
| `frame-src` allowlist | Only YouTube and Wistia iframes are permitted within the application |

## 6. Verification

### 6.1 Automated Controls

| Control | Mechanism |
|---------|-----------|
| **TypeScript type safety** | Strict TypeScript compilation catches type errors at build time; `ConditionType` union enforces valid condition IDs |
| **ESLint** | CI treats warnings as errors (`CI=true`); catches common code quality and security issues |
| **Dependency auditing** | `npm audit` available for checking known vulnerabilities in dependencies |
| **CSP enforcement** | Browser-enforced Content Security Policy blocks unauthorized resource loading at runtime |

### 6.2 Manual Review Checklist

- [ ] New external domains added to CSP in `public/_headers`
- [ ] No `dangerouslySetInnerHTML` with user-controlled content
- [ ] No `eval()`, `Function()`, or `innerHTML` with dynamic data
- [ ] All new user inputs validated before use
- [ ] Error boundaries catch failures gracefully without exposing internals
- [ ] localStorage access wrapped in try-catch for incognito compatibility

### 6.3 Disclosure Process

Security vulnerabilities should be reported through GitHub Security Advisories as described in [SECURITY.md](../SECURITY.md). Response timelines:
- Acknowledgment within 72 hours
- Initial assessment within 1 week
- Fix within 30 days for critical issues
