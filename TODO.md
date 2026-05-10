# TODO

Remaining improvements and future ideas for the Blindness Visualizer project.

## Manual Setup Tasks

These items require manual action (credentials, external services, etc.):

- [ ] **Coverage badge gist**: Create a GitHub Gist and replace `REPLACE_WITH_YOUR_GIST_ID` in `.github/workflows/ci.yml` with the real Gist ID. Add a `GIST_SECRET` repository secret with a PAT that has `gist` scope.
- [ ] **Cloudflare Pages environment variables**: Verify `PUBLIC_URL` and any deploy-specific env vars are set correctly in the Cloudflare dashboard.
- [ ] **Sentry integration**: If Sentry error tracking is desired beyond Wistia's built-in usage, set up a Sentry project and add the DSN to the app configuration.
- [ ] **Domain verification**: Ensure `theblind.spot` DNS records are properly configured for both Cloudflare Pages and any email/SPF needs.
- [ ] **OpenSSF Scorecard**: Review and address any remaining findings from the OSSF scorecard GitHub Action.

## Testing Improvements

- [ ] **E2E tests with Playwright**: Expand `test:e2e` suite to cover the full simulator flow (input selection → condition toggling → screenshot capture), famous people navigation, and accessibility compliance.
- [ ] **Visual regression tests**: Add screenshot comparison tests (e.g., with Playwright's `toHaveScreenshot()`) for key overlay effects to catch rendering regressions.
- [ ] **Performance benchmarks**: Create automated benchmarks for the render loop (FPS under load) and overlay generation time, tracked over commits.
- [ ] **Cross-browser WebGL testing**: Test WebGL context loss/restore behavior in Safari and Firefox, especially on mobile devices.

## Code Quality

- [ ] **Accessibility audit**: Run a comprehensive WCAG 2.1 AA audit (axe-core or Lighthouse) and fix any remaining issues, especially around the simulator controls and overlay announcements.
- [ ] **Storybook**: Add Storybook for isolated component development of PersonCard, ControlPanel, InputSelector, and overlay previews.
- [ ] **Bundle size monitoring**: Set up automated bundle size tracking (e.g., `bundlewatch` or `size-limit`) in CI to prevent accidental bloat.
- [ ] **TypeScript strict mode**: Enable `strict: true` in `tsconfig.json` and fix resulting type errors incrementally.

## Feature Ideas

- [ ] **Offline mode improvements**: Enhance PWA caching to allow full offline use, including cached YouTube thumbnails and fallback content.
- [ ] **Shareable simulation links**: Extend the preset URL encoding to include the person name for famous people simulations, enabling direct sharing.
- [ ] **Comparison mode enhancements**: Add side-by-side comparison with adjustable split position, or a slider to blend between normal and affected vision.
- [ ] **Custom condition builder**: Allow users to combine and save custom condition profiles beyond the preset system.
- [ ] **Audio descriptions**: Add optional audio narration describing each condition for users who may benefit from auditory learning.
