export enum InflationDataset {
  cpiU = "CUUR0000SA0",
}

type InflationDatasetAlias = keyof typeof InflationDataset;

type YearDisplay = "never" | "always" | "exceptCurrent" | "ifFallback";

type PrecisionOptions =
  | {
      precisionMode: "decimalPlaces";
      minDigits?: Intl.NumberFormatOptions["minimumFractionDigits"];
      maxDigits?: Intl.NumberFormatOptions["maximumFractionDigits"];
    }
  | {
      precisionMode: "sigfigs";
      minDigits?: Intl.NumberFormatOptions["minimumSignificantDigits"];
      maxDigits?: Intl.NumberFormatOptions["maximumSignificantDigits"];
    };

export type CuppyOptions = {
  from?: number;
  to?: number;
  hint: "none" | "from" | "to";
  hintDisplay: "tooltip" | "inline";
  locale?: string | string[];
  currencyStyle?: "symbol" | "narrowSymbol" | "code" | "name";
  useGrouping?: Intl.NumberFormatOptions["useGrouping"];
  numberStyle?:
    | "standard"
    | "scientific"
    | "engineering"
    | "compactShort"
    | "compactLong";
  signDisplay?: Intl.NumberFormatOptions["signDisplay"];
  yearDisplay: YearDisplay;
  hintYearDisplay: YearDisplay;
  inflationDataset: InflationDatasetAlias;
  yearFormatter: (value: string, year: number) => string;
  hintFormatter: (value: string, hint: string) => string;
} & PrecisionOptions;

const defaults: CuppyOptions = {
  hint: "none",
  hintDisplay: "tooltip",
  currencyStyle: "symbol",
  numberStyle: "compactLong",
  yearDisplay: "ifFallback",
  hintYearDisplay: "always",
  precisionMode: "sigfigs",
  inflationDataset: "cpiU",
  yearFormatter: (value, year) => `${value} (${year})`,
  hintFormatter: (value, hint) => `${value} [${hint}]`,
};

type DatasetYear = string;
type DatasetPeriod = `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 0}`;
type DatasetValue = number;
type Dataset = Record<DatasetYear, Record<DatasetPeriod, DatasetValue>>;

const datasets: Partial<
  Record<
    InflationDatasetAlias,
    {
      data: Dataset;
      years: number[];
    }
  >
> = {};

type DatasetPlugin = (cuppy: { datasets: typeof datasets }) => void;

const registerDataset = (plugin: DatasetPlugin) => {
  plugin(cuppy);
};

const currentYear = new Date().getFullYear();

const withHint = (value: string, hint: string) => {
  return defaults.hintFormatter(value, hint);
};

const withYear = (
  value: string,
  options: { year: number; requestedYear?: number; yearDisplay: YearDisplay },
) => {
  const { year, requestedYear, yearDisplay } = options;

  const formattedValue = defaults.yearFormatter(value, year);

  if (yearDisplay === "never") {
    return value;
  } else if (yearDisplay === "always") {
    return formattedValue;
  } else if (yearDisplay === "exceptCurrent") {
    return year !== currentYear ? formattedValue : value;
  } else if (yearDisplay === "ifFallback") {
    return requestedYear != null && year !== requestedYear
      ? formattedValue
      : value;
  } else {
    throw new RangeError(`Invalid year display style: ${yearDisplay}.`);
  }
};

// Cache the Intl.NumberFormat instances for performance.
const formatterCache: Record<string, Intl.NumberFormat> = {};

const formatCurrency = (value: number, options: Partial<CuppyOptions>) => {
  const locale =
    options.locale ?? defaults.locale ?? (navigator.languages as string[]);

  const currency = "USD";

  const currencyDisplay = options.currencyStyle || defaults.currencyStyle;

  const useGrouping = defaults.useGrouping ?? options.useGrouping != null;

  const signDisplay = options.signDisplay || defaults.signDisplay;

  const precisionMode = options.precisionMode || defaults.precisionMode;

  const minDigits =
    options.minDigits != null ? +options.minDigits : defaults.minDigits;

  const maxDigits =
    options.maxDigits != null ? +options.maxDigits : defaults.maxDigits;

  let precisionOptions;
  if (precisionMode === "decimalPlaces") {
    precisionOptions = {
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maxDigits,
    };
  } else {
    precisionOptions = {
      minimumSignificantDigits: minDigits,
      maximumSignificantDigits: maxDigits,
    };
  }

  const numberStyle = options.numberStyle || defaults.numberStyle;

  let notation: Intl.NumberFormatOptions["notation"];
  let compactDisplay: Intl.NumberFormatOptions["compactDisplay"];
  if (numberStyle === "compactShort" || numberStyle === "compactLong") {
    notation = "compact";
    compactDisplay = numberStyle === "compactShort" ? "short" : "long";
  } else if (
    numberStyle === "standard" ||
    numberStyle === "scientific" ||
    numberStyle === "engineering"
  ) {
    notation = numberStyle;
  } else {
    throw new RangeError(`Invalid notation: ${numberStyle}.`);
  }

  const key = `${locale}|${currency}|${currencyDisplay}|${useGrouping}|${signDisplay}|${precisionMode}|${minDigits}|${maxDigits}|${notation}|${compactDisplay}`;
  let formatter;
  if (!formatterCache[key]) {
    formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay,
      useGrouping,
      signDisplay,
      notation,
      compactDisplay,
      ...precisionOptions,
    });

    formatterCache[key] = formatter;
  } else {
    formatter = formatterCache[key];
  }

  return formatter.format(value);
};

export const getInflationData = (
  dataset: InflationDatasetAlias,
  from: number,
  to: number,
) => {
  const { data, years } = datasets[dataset]!;

  const fromYear = data[from] ? from : years[0];
  const fromPeriod = 0; // Annual
  const fromValue = data[fromYear][fromPeriod];

  const toYear = data[to] ? to : years[years.length - 1];
  const toPeriod = 0; // Annual
  const toValue = data[toYear][toPeriod];

  return {
    from: {
      value: fromValue,
      year: +fromYear,
    },
    to: {
      value: toValue,
      year: +toYear,
    },
  };
};

const adjustForInflation = (
  value: number,
  yearRange: { from: number; to?: number } & { from?: number; to: number },
  dataset: InflationDatasetAlias = "cpiU",
) => {
  let { from, to } = yearRange;
  from ??= currentYear;
  to ??= currentYear;

  if (from === to) {
    return { adjustedValue: value, from, to };
  }

  const { from: fromData, to: toData } = getInflationData(dataset, from, to);

  return {
    adjustedValue: value * (toData.value / fromData.value),
    from: fromData.year,
    to: toData.year,
  };
};

const cuppy = () => {
  const cuppies = document.querySelectorAll<HTMLElement>("[data-cuppy]");
  cuppies.forEach((el) => {
    const options = el.dataset;
    const value = +el.innerText;

    const from = +(options.from || defaults.from || currentYear);
    const to = +(options.to || defaults.to || currentYear);

    const yearDisplay = (options.yearDisplay ||
      defaults.yearDisplay) as YearDisplay;

    if (from !== to) {
      const inflationDataset = (options.inflationDataset ||
        defaults.inflationDataset) as InflationDatasetAlias;

      const {
        adjustedValue,
        from: fromYear,
        to: toYear,
      } = adjustForInflation(value, { from, to }, inflationDataset);

      const hint = options.hint || defaults.hint;
      const hintDisplay = options.hintDisplay || defaults.hintDisplay;
      const hintYearDisplay = (options.hintYearDisplay ||
        defaults.hintYearDisplay) as YearDisplay;

      if (hint === "to") {
        const formattedValue = formatCurrency(value, options);
        const formattedValueWithYear = withYear(formattedValue, {
          year: fromYear,
          requestedYear: from,
          yearDisplay,
        });

        const formattedAdjustedValue = formatCurrency(adjustedValue, options);
        const formattedAdjustedValueWithYear = withYear(
          formattedAdjustedValue,
          {
            year: toYear,
            requestedYear: to,
            yearDisplay: hintYearDisplay,
          },
        );

        if (hintDisplay === "tooltip") {
          el.innerText = formattedValueWithYear;
          el.title = formattedAdjustedValueWithYear;
        } else {
          el.innerText = withHint(
            formattedValueWithYear,
            formattedAdjustedValueWithYear,
          );
        }
      } else if (hint === "from") {
        const formattedValue = formatCurrency(value, options);
        const formattedValueWithYear = withYear(formattedValue, {
          year: fromYear,
          requestedYear: from,
          yearDisplay: hintYearDisplay,
        });

        const formattedAdjustedValue = formatCurrency(adjustedValue, options);
        const formattedAdjustedValueWithYear = withYear(
          formattedAdjustedValue,
          {
            year: toYear,
            requestedYear: to,
            yearDisplay,
          },
        );

        if (hintDisplay === "tooltip") {
          el.innerText = formattedAdjustedValueWithYear;
          el.title = formattedValueWithYear;
        } else {
          el.innerText = withHint(
            formattedAdjustedValueWithYear,
            formattedValueWithYear,
          );
        }
      } else {
        const formattedAdjustedValue = formatCurrency(adjustedValue, options);
        el.innerText = withYear(formattedAdjustedValue, {
          year: toYear,
          requestedYear: to,
          yearDisplay,
        });
      }
    } else {
      const formattedValue = formatCurrency(value, options);
      el.innerText = withYear(formattedValue, {
        year: from,
        yearDisplay,
      });
    }
  });
};

cuppy.options = defaults;

cuppy.datasets = datasets;

cuppy.dataset = registerDataset;

cuppy.formatCurrency = formatCurrency;

cuppy.adjustForInflation = adjustForInflation;

export default cuppy;
