# Contributing

Thanks for your interest in contributing to Cuppy! This document outlines the process for contributing to the project.

## Code of conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later; see `@types/node` in the root `package.json` for the exact version)
- [pnpm](https://pnpm.io/) (see `packageManager` in the root `package.json`)
- [Python](https://www.python.org/) to run the dataset updater script (v3.11 or later; see [pyproject.toml](scripts/update-datasets/pyproject.toml))
- [Poetry](https://python-poetry.org/) to install the dataset updater script’s dependencies

### Setup

1. Clone the repository.
2. Run `pnpm install` to install the project’s dependencies.
3. Run `poetry install` in the `scripts/update-datasets` directory to install the dataset updater script’s dependencies.

You’re all set! 🎉 Now you can run the following commands:

- `pnpm run dev` to build the project for development and watch for changes.
- `pnpm run build` to build the project for production.
- `pnpm run clean` to clean the project’s build artifacts.

## Repository structure

Cuppy is structured as a monorepo managed using [`pnpm` workspaces](https://pnpm.io/workspaces). The project is split into the following packages:

- [`core`](core) contains the main Cuppy library, `@cuppy/core`.
- [`datasets`](datasets) contains the price index datasets used for inflation calculations, e.g., [`datasets/cpi-u`](datasets/cpi-u) is `@cuppy/cpi-u`.
- [`demo`](demo) contains the code for the [Cuppy website](https://moltinginstar.com/cuppy), `@cuppy/demo`.

The following directories are also present:

- [`scripts`](scripts) contains scripts for managing the project, e.g., `update-datasets`.
- [`.github/workflows`](.github/workflows) contains the CI/CD workflows for the project.

## Release process

### Commit messages

This project uses [`lerna version`](https://github.com/lerna/lerna/tree/main/libs/commands/version#--conventional-commits) to automatically generate release notes and publish new versions of the project.

This means that commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Versioning

As per the [Semantic Versioning](https://semver.org/) specification, the version number is incremented according to the following rules:

- Increment the major version number when making breaking changes to the API.
- Increment the minor version number when adding functionality in a backwards-compatible manner.
- Increment the patch version number when making backwards-compatible bug fixes.

Data updates are considered backwards-compatible feature additions, so they will increment the minor version number.

### Publishing

When you’re ready, create a pull request with your changes. Once the pull request has been merged, a new version will be published automatically by GitHub Actions. See the workflow files in the [`.github/workflows`](.github/workflows) directory for more information on how this works. GitHub Actions are also responsible for updating the datasets on a monthly basis.
