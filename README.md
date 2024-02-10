<div align="center">
  <img
    src="demo/public/logo.png"
    alt="cuppy logo"
    width="200"
  />

  <h1>cuppy</h1>

  <p>A lightweight currency display component with automatic inflation adjustment.</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![npm](https://img.shields.io/npm/dw/@cuppy/core)](https://www.npmjs.com/package/@cuppy/core)
[![Bundle size](https://img.shields.io/bundlejs/size/@cuppy/core)](https://www.npmjs.com/package/@cuppy/core)

</div>

Cuppy is a zero-dependency TypeScript library for declaratively formatting monetary values across your webpage. It supports automatic adjustment of historical currency amounts for inflation based on the Consumer Price Index. (“Cuppy” is how “CPI” would be pronounced if economics was any fun.)

## Installation

Using a package manager:

```bash
npm i @cuppy/core @cuppy/cpi-u
```

or

```bash
yarn add @cuppy/core @cuppy/cpi-u
```

or

```bash
pnpm add @cuppy/core @cuppy/cpi-u
```

## Usage

```html
<span
  data-cuppy
  data-from="1969"
  data-to="2020"
  data-hint="to"
  data-hint-display="inline"
  data-year-display="always"
  data-hint-year-display="ifFallback"
  data-number-style="compactShort"
  data-currency-style="name"
  data-sign-display="always"
  data-use-grouping
  data-precision-mode="decimalPlaces"
  data-min-digits="4"
  data-max-digits="5"
  data-inflation-dataset="cpiU"
  data-locale="en-NZ"
>
  25_400_000_000
</span>
```

```ts
import cuppy from "@cuppy/core";
import cpiU from "@cuppy/cpi-u";

// Set global defaults
cuppy.options.hint = "to";
cuppy.options.currencyStyle = "code";
cuppy.options.numberStyle = "compactShort";
cuppy.options.useGrouping = false;
cuppy.options.maxDigits = 3;
cuppy.options.yearFormatter = (value, year) => `${value} in ${year}`;
cuppy.options.inlineHintFormatter = (value, hint) => `${value} (${hint})`;

// Load inflation dataset
cuppy.dataset(cpiU);

// Format all Cuppies on the page!
cuppy();
```

## Documentation

For more information, see the respective READMEs for each package:

- [@cuppy/core](core/README.md)
- [@cuppy/cpi-u](datasets/cpi-u/README.md)
- [@cuppy/demo](demo/README.md)
- [Dataset updater](scripts/update-datasets/README.md)

## Roadmap

At the moment Cuppy only supports U.S. dollars and the [Consumer Price Index for All Urban Consumers (CPI-U)](datasets/cpi-u) dataset. However, it is flexible enough to accomodate new currencies and inflation datasets via plugins.

There are a few different directions Cuppy could go in the future. One possibility is to retrieve the inflation data from an API instead of bundling it with the library. This would allow automatic updates of the inflation data without requiring end users to update their version of Cuppy.

Another high-impact improvement would be treeshaking support for datasets. Currently, the entire inflation dataset is bundled with the library even if only a subset of the data is used (which I imagine is the case for most users).

However, my main focus for the near future is refining the mobile experience with a more accessible alternative to tooltips, and on the code quality front, improving test coverage and code organization.

## Contributing

If you like the idea and want to help make it better, please consider contributing! It can be as simple as opening an issue to report a bug or suggest an improvement, or as involved as implementing a new feature or fixing a bug yourself. For more information, see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Cuppy is licensed under the [MIT License](LICENSE).
