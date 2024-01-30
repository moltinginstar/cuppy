# CPI-U (CUUR0000SA0) for Cuppy

This is a plugin for [Cuppy](https://github.com/moltinginstar/cuppy) enabling automatic adjustment of historical currency amounts for inflation based on the [U.S. Consumer Price Index for All Urban Consumers (CPI-U)](https://www.bls.gov/cpi/) data.

It is updated yearly to include the latest data from the provided by the [Bureau of Labor Statistics (BLS)](https://www.bls.gov/).

## Usage

```ts
import cuppy from "@cuppy/core";
import cpiU from "@cuppy/cpi-u";

cuppy.dataset(cpiU);
```

## License

This package is licensed under the [MIT License](https://github.com/moltinginstar/cuppy/blob/main/datasets/cpi-u/LICENSE).
