import "./style.css";
import cuppy from "@cuppy/core/src"; // TODO: import from @cuppy/core
import cpiU from "@cuppy/cpi-u/index"; // TODO: import from @cuppy/cpi-u

cuppy.options.hint = "to";
cuppy.options.currencyStyle = "code";
cuppy.options.numberStyle = "compactLong";
cuppy.options.useGrouping = false;
cuppy.options.maxDigits = 3;

cuppy.dataset(cpiU);

cuppy();
