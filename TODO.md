# TODO

Remaining improvements and future ideas for the Blindness Visualizer project.

## Blockers (GitHub Developer Program)

- [ ] **Email inbox**: Set up `hello@theblind.spot` mailbox via Cloudflare Email Routing. Required for Developer Program application. Referenced in SECURITY.md, CODE_OF_CONDUCT.md, README.md, GOVERNANCE.md, and .github/SUPPORT.md.
  1. Open the [Cloudflare dashboard](https://dash.cloudflare.com) → select `theblind.spot` → **Email** → **Email Routing**
  2. Click **Create address** → set custom address to `hello`, destination to your personal email
  3. Cloudflare will prompt you to add the required MX and TXT (SPF) DNS records — accept them
  4. Verify the destination email if prompted
  5. Send a test email to `hello@theblind.spot` to confirm delivery
- [ ] **Publish v1.0.0 release**: After committing and pushing all changes to `main`, run:
  ```bash
  git tag -a v1.0.0 -m "VisionSim GitHub Action — first release"
  git push origin v1.0.0
  ```
  This triggers `.github/workflows/publish-action.yml` which builds the Docker image and pushes it to GHCR.
- [ ] **Marketplace listing**: Submit the VisionSim action to the GitHub Marketplace once v1.0.0 is published.

## Manual Setup Tasks

These items require manual action (credentials, external services, etc.):

- [ ] **Coverage badge gist** *(optional)*: Create a GitHub Gist and set `GIST_SECRET` repo secret with a PAT that has `gist` scope, then restore the badge step in `.github/workflows/ci.yml` (see comment in that file).

## Testing Improvements

- [ ] **Visual regression tests**: Add screenshot comparison tests (e.g., with Playwright's `toHaveScreenshot()`) for key overlay effects to catch rendering regressions.
- [ ] **Performance benchmarks**: Create automated benchmarks for the render loop (FPS under load) and overlay generation time, tracked over commits.

## Code Quality

- [ ] **Storybook**: Add Storybook for isolated component development of PersonCard, ControlPanel, InputSelector, and overlay previews.
- [ ] **Bundle size monitoring**: Set up automated bundle size tracking (e.g., `bundlewatch` or `size-limit`) in CI to prevent accidental bloat.

## VisionSim GitHub Action

- [ ] **Pruning old previews**: Add a scheduled workflow to clean up composite images on the `visionsim-previews` orphan branch older than 30 days.
- [ ] **Matrix support**: Allow running multiple condition sets in parallel via a GitHub Actions matrix strategy.

## Feature Ideas

- [ ] **Shareable simulation links**: Extend the preset URL encoding to include the person name for famous people simulations, enabling direct sharing.
- [ ] **Custom condition builder**: Allow users to combine and save custom condition profiles beyond the preset system.
- [ ] **Audio descriptions**: Add optional audio narration describing each condition for users who may benefit from auditory learning.
- [ ] **Offline mode improvements**: Enhance PWA caching for YouTube thumbnails and fallback content.

## Completed

- [x] **Sentry integration**: Sentry CDN domains in CSP (`public/_headers`); used by Wistia for error reporting.
- [x] **TypeScript strict mode**: `strict: true` enabled in `tsconfig.json` with `noUnusedLocals` and `noUnusedParameters`.
- [x] **Accessibility audit**: `@axe-core/playwright` integrated, `e2e/accessibility.spec.ts` runs WCAG 2.1 AA audits across 6 pages, Lighthouse CI enforces 90% a11y score.
- [x] **Comparison mode**: `ComparisonDialog.tsx` and `ComparisonView.tsx` implemented with side-by-side toggle.
- [x] **E2E tests with Playwright**: 6 spec files covering routing, accessibility, simulator flow, famous people, color filters, and headless renderer. Cross-browser (Chromium, Firefox, WebKit).
- [x] **Cross-browser WebGL testing**: Playwright configured with Chromium, Firefox, and WebKit projects.
- [x] **OpenSSF Scorecard**: Workflow runs weekly + on push with SARIF upload.
- [x] **Cloudflare Pages environment variables**: `PUBLIC_URL` wired throughout; site live at `theblind.spot`.
- [x] **Domain verification**: `theblind.spot` DNS configured and serving.
