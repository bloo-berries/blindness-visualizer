# Governance

## Project Model

The Vision Condition Visualizer follows a **Benevolent Dictator For Life (BDFL)** governance model. All final decisions are made by the project maintainer.

## Roles and Responsibilities

### Maintainer

**@bloo-berries** — Project creator and sole maintainer.

Responsibilities:
- Reviewing and merging pull requests
- Triaging issues and bug reports
- Setting project direction and priorities
- Managing releases and deployments
- Responding to security vulnerability reports

### Contributors

Anyone who submits a pull request, opens an issue, or contributes translations. Contributors are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Decision-Making

- **Minor changes** (bug fixes, typos, dependency updates): Merged at the maintainer's discretion.
- **Major changes** (new features, architectural changes): Discussed in a GitHub Issue before implementation.
- **Breaking changes**: Require a GitHub Issue with rationale and migration notes.

## Contributions

All contributions are welcome via pull requests. See the [Contributing section](readme.md#contributing) in the README for guidelines.

By submitting a contribution, you agree to the [Developer Certificate of Origin (DCO)](DCO) ([full text](https://developercertificate.org/)). All commits must include a `Signed-off-by` trailer to indicate DCO agreement. Add it automatically with:

```bash
git commit -s -m "Your commit message"
```

To sign off all commits in an existing branch retroactively:

```bash
git rebase HEAD~N --signoff
```

A [GitHub Action](.github/workflows/dco.yml) enforces sign-off on every pull request.

## Versioning and Upgrades

This project is a continuously deployed web application hosted at [theblind.spot](https://theblind.spot). All users automatically receive the latest version on every deployment — there are no separately maintained older versions, installable packages, or manual upgrade steps. This makes version maintenance and upgrade path documentation not applicable.

## Access Continuity

The project is MIT licensed and hosted on a public GitHub repository. The following measures ensure the project can continue with minimal interruption if the maintainer becomes unavailable:

- **Source code**: Publicly hosted on GitHub; any community member can fork and continue development.
- **Deployment credentials**: Cloudflare Pages access credentials and API tokens are documented in a secure password manager. A trusted backup contact has been designated with instructions for obtaining access if needed.
- **Domain / DNS**: Domain registration and DNS records are managed through Cloudflare. Recovery instructions are stored alongside deployment credentials.
- **npm / package registry**: The project is not published to npm, so no registry access is required.
- **CI/CD**: GitHub Actions workflows are fully defined in-repo (`.github/workflows/`) and will function on any fork without additional secrets beyond deployment tokens.

In the event the maintainer is incapacitated or unresponsive for more than 30 days, the designated backup contact can create and close issues, accept proposed changes, and release new versions of the software within a week.
