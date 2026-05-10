# Contributing to Vision Condition Visualizer

We welcome contributions! This document outlines the process for contributing to this project and the test requirements all contributions must meet.

## Getting Started

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** (see guidelines below)
4. **Ensure all tests pass**: `npm test -- --watchAll=false`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

## Test Policy

**As major new functionality is added, tests for the new functionality MUST be added to an automated test suite.** This is a hard requirement for all pull requests that introduce or modify behavior.

### What requires tests

- **New features and components**: Any new React component, hook, or utility function must have corresponding unit tests.
- **Bug fixes**: A regression test must accompany each bug fix to prevent recurrence.
- **New visual effects or overlays**: Effect creation functions must be tested for element creation, cleanup, and edge cases (disabled/undefined input).
- **New famous people utilities**: Any new mapping or parsing logic in `famousPeopleUtils` must be tested.
- **Data transformations**: Functions that transform, filter, or aggregate data must have tests covering expected inputs and edge cases.

### What does NOT require tests

- **Documentation-only changes**: Updates to README, CONTRIBUTING, or other markdown files.
- **CSS-only changes**: Pure styling changes with no logic.
- **Translation files**: Adding or updating locale JSON files in `src/locales/`.
- **Static data additions**: Adding entries to data arrays (e.g., a new person in `src/data/famousPeople/`) that use existing, already-tested code paths.
- **Asset additions**: Adding images, fonts, or other static assets.

### Test conventions

- **Directory structure**: All tests live in `src/__tests__/`, mirroring the source directory structure:
  - `src/__tests__/components/` for component tests
  - `src/__tests__/hooks/` for hook tests
  - `src/__tests__/utils/` for utility tests
  - `src/__tests__/overlays/` for overlay/visual effect tests
- **Test utilities**: Use `@testing-library/react` for component tests and `@testing-library/user-event` for user interaction simulation.
- **Mocking**: CRA enables `resetMocks` by default, so all `jest.fn()` mocks are automatically reset between tests. Module mocks (`jest.mock(...)`) must be declared at the top of the file, before imports of the mocked module.
- **Naming**: Test files should be named `<ModuleName>.test.ts` or `<ModuleName>.test.tsx`.
- **Coverage threshold**: The project enforces a minimum of 80% statement coverage in CI. Run `npm test -- --watchAll=false --coverage` locally to verify before submitting.

## Code Style

This project follows the [Create React App ESLint configuration](https://www.npmjs.com/package/eslint-config-react-app) with additional rules defined in `package.json`. TypeScript strict mode provides further enforcement. CI treats all ESLint warnings as errors (`CI=true`), so contributions must pass linting to be merged. Suppress intentional console statements with `// eslint-disable-next-line no-console`.

## Areas for Contribution

- **New vision conditions**: Add more realistic simulations
- **Additional famous people**: Expand the educational content
- **Accessibility improvements**: Enhance screen reader support
- **Performance optimization**: Improve rendering speed
- **Mobile experience**: Enhance touch interactions
- **New languages**: Add translation files for more locales
