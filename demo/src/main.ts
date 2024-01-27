import "./style.css";
import cuppy from "@cuppy/core";
import cpiU from "@cuppy/cpi-u";

cuppy.options.hint = "to";
cuppy.options.currencyStyle = "code";
cuppy.options.numberStyle = "compactLong";
cuppy.options.useGrouping = false;
cuppy.options.maxDigits = 3;

cuppy.dataset(cpiU);

const years = cuppy.datasets["cpiU"]!.years;
const minYear = years[0].toString();
const maxYear = new Date().getFullYear().toString();

const input = document.getElementById("to-year");
const minLabel = document.getElementById("min-label");
const maxLabel = document.getElementById("max-label");

input?.setAttribute("min", minYear);
minLabel?.append(minYear);

input?.setAttribute("max", maxYear);
maxLabel?.append(maxYear);

input?.setAttribute("value", maxYear);

const yearValues = document.getElementById("year-values");
yearValues?.append(
  ...years.map((year) => {
    const option = document.createElement("option");
    option.value = year.toString();
    option.append(year.toString());

    return option;
  }),
);

input?.addEventListener(
  "input",
  function (this: HTMLInputElement) {
    cuppy.options.to = +this.value;
    cuppy();
  },
  false,
);

cuppy();
