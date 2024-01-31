# Cuppy

Cuppy is a zero-dependency TypeScript library for declaratively formatting monetary values across your webpage. It supports automatic adjustment of historical currency amounts for inflation based on the Consumer Price Index. (“Cuppy” is how “CPI” would be pronounced if economics was any fun.)

## Usage

### Basic usage

#### Formatting

To mark an element as a Cuppy, add the `data-cuppy` attribute to it and provide the monetary value as the element’s text content or using the `data-value` attribute:

```html
<!-- Via innerText -->
<span data-cuppy>25400000000</span>

<!-- Via data-value -->
<span data-cuppy data-value="25400000000"></span>
```

Then in your JavaScript, call the `cuppy` function to format all Cuppies on the page:

```ts
import cuppy from "@cuppy/core";

cuppy();
```

This will format the Cuppy using the default options for the user’s preferred locale.

#### Inflation adjustment

To adjust the value for inflation, you must install a dataset for the Consumer Price Index. For example, the [`@cuppy/cpi-u`](https://github.com/moltinginstar/cuppy/tree/main/datasets/cpi-u) package provides data for the United States Consumer Price Index for All Urban Consumers (CPI-U) all the way back to 1913. You can install it like this:

```bash
npm i @cuppy/cpi-u
```

and then load it in your JavaScript:

```ts
import cuppy from "@cuppy/core";
import cpiU from "@cuppy/cpi-u";

cuppy.dataset(cpiU);

cuppy();
```

Then in your HTML, set the `data-from` and optionally `data-to` attributes to the years you want to adjust between and voilà!

```html
<span data-cuppy data-from="1969" data-to="2020">25400000000</span>
<!-- $179B -->
```

### Advanced usage

You can customize almost every aspect of the formatting by setting attributes on the element:

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
  25400000000
</span>
```

Cuppy uses `Intl.NumberFormat` under the hood, so you can use any of the options supported by that API. See the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) for more information.

<!-- All options table -->

<table>
  <thead>
    <tr>
      <th>Attribute</th>
      <th>Default value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>from</code></td>
      <td>The current year</td>
      <td>The year to adjust the value from.</td>
    </tr>
    <tr>
      <td><code>to</code></td>
      <td>The current year</td>
      <td>The year to adjust the value to. Either this or <code>from</code> must be set for inflation adjustment to occur.</td>
    </tr>
    <tr>
      <td><code>hint</code></td>
      <td><code>"none"</code></td>
      <td>The hint to display next to the value. Can be <code>"to"</code> (adjusted value as hint), <code>"from"</code> (source value as hint), or <code>"none"</code> (adjusted value only).</td>
    </tr>
    <tr>
      <td><code>hint-display</code></td>
      <td><code>"tooltip"</code></td>
      <td>The display mode for the hint. Can be <code>"inline"</code> or <code>"tooltip"</code>.</td>
    </tr>
    <tr>
      <td><code>year-display</code></td>
      <td><code>"ifFallback"</code></td>
      <td>The display mode for the year. Can be <code>"always"</code>, <code>"exceptCurrent"</code>, <code>"ifFallback"</code>, or <code>"never"</code>.</td>
    </tr>
    <tr>
      <td><code>hint-year-display</code></td>
      <td><code>"always"</code></td>
      <td>The display mode for the year in the hint. Can be <code>"always"</code>, <code>"exceptCurrent"</code>, <code>"ifFallback"</code>, or <code>"never"</code>.</td>
    </tr>
    <tr>
      <td><code>number-style</code></td>
      <td><code>"compactLong"</code></td>
      <td>The number style to use. Can be <code>"standard"</code>, <code>"scientific"</code>, <code>"engineering"</code>, <code>"compactShort"</code>, or <code>"compactLong"</code>. Combines the <code>notation</code> and <code>compactDisplay</code> options of <code>Intl.NumberFormat</code>.</td>
    </tr>
    <tr>
      <td><code>currency-style</code></td>
      <td><code>"symbol"</code></td>
      <td>The currency style to use. Can be <code>"symbol"</code>, <code>"narrowSymbol"</code>, <code>"code"</code>, or <code>"name"</code>. Corresponds to <code>currencyDisplay</code> in <code>Intl.NumberFormat</code>.</td>
    </tr>
    <tr>
      <td><code>sign-display</code></td>
      <td><code>"auto"</code></td>
      <td>The display mode for the sign. Can be <code>"auto"</code>, <code>"always"</code>, <code>"exceptZero"</code>, or <code>"never"</code>.</td>
    </tr>
    <tr>
      <td><code>use-grouping</code></td>
      <td>Same as in <code>Intl.NumberFormat</code></td>
      <td>Whether to use grouping separators. Any non-null value other than <code>"false"</code> (including an empty string) will be treated as <code>true</code>.</td>
    </tr>
    <tr>
      <td><code>precision-mode</code></td>
      <td><code>"significantDigits"</code></td>
      <td>The precision mode to use. Can be <code>"significantDigits"</code> or <code>"decimalPlaces"</code>.</td>
    </tr>
    <tr>
      <td><code>min-digits</code></td>
      <td>Same as in <code>Intl.NumberFormat</code></td>
      <td>The minimum number of digits to display. Equivalent to <code>minimumFractionDigits</code> if <code>precision-mode</code> is <code>"decimalPlaces"</code> and <code>minimumSignificantDigits</code> if <code>precision-mode</code> is <code>"significantDigits"</code>.</td>
    </tr>
    <tr>
      <td><code>max-digits</code></td>
      <td>Same as in <code>Intl.NumberFormat</code></td>
      <td>The maximum number of digits to display. Equivalent to <code>maximumFractionDigits</code> if <code>precision-mode</code> is <code>"decimalPlaces"</code> and <code>maximumSignificantDigits</code> if <code>precision-mode</code> is <code>"significantDigits"</code>.</td>
    </tr>
    <tr>
      <td><code>inflation-dataset</code></td>
      <td><code>"cpiU"</code></td>
      <td>The name of the inflation dataset to use.</td>
    </tr>
    <tr>
      <td><code>locale</code></td>
      <td><code>navigator.languages</code></td>
      <td>The locale to use for formatting. Must be a valid BCP 47 language tag.</td>
    </tr>
  </tbody>
</table>

You can also configure the default values for these options globally:

```ts
import cuppy from "@cuppy/core";
import cpiU from "@cuppy/cpi-u";

// Set global defaults
cuppy.options.hint = "to";
cuppy.options.currencyStyle = "code";
cuppy.options.numberStyle = "compactShort";
cuppy.options.useGrouping = false;
cuppy.options.maxDigits = 3;

// Load inflation dataset
cuppy.dataset(cpiU);

// Format all Cuppies on the page!
cuppy();
```

Note that per-element attributes will override global defaults.

You can modify how the year and hint are displayed by setting the `yearFormatter` and `inlineHintFormatter` options, respectively:

```ts
cuppy.options.yearFormatter = (value, year) => `${value} in ${year}`;
cuppy.options.inlineHintFormatter = (value, hint) => `${value} (${hint})`;
```

This will result in the following output:

```html
<span
  data-cuppy
  data-from="1969"
  data-hint-display="inline"
  data-year-display="always"
  data-hint-year-display="ifFallback"
  data-currency-style="name"
  data-min-digits="4"
  data-max-digits="5"
>
  25400000000
</span>
<!-- 25.40 billion US dollars in 1969 (210.88 billion US dollars in 2023) -->
```

## Browser support

Cuppy supports all modern browsers supporting ES6 and above. The availability of some options may vary depending on the browser. See the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) for more information.

## Contributing

If you like Cuppy and want to help make it better, please consider contributing! It can be as simple as opening an issue to report a bug or suggest an improvement, or as involved as implementing a new feature or fixing a bug yourself. For more information, see [CONTRIBUTING.md](https://github.com/moltinginstar/cuppy/blob/main/CONTRIBUTING.md).

## License

Cuppy is licensed under the [MIT License](https://github.com/moltinginstar/cuppy/blob/main/core/LICENSE).
