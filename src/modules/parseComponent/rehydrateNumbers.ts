import _ from "lodash";
import validNumber from "./validNumber.js";
/**
 * Iterates over a record to convert string values that represent numbers into actual numbers.
 *
 * @export
 * @template T
 * @param {T} obj
 * @return {*}  {T}
 */
export default function rehydrateNumbers<T extends Record<string|number|symbol, string|number|object>>(obj: T): T {
  const result = _.mapValues(obj, (value) => {
    if (typeof value === "string" && validNumber.test(value)) {
      return Number(value);
    }
    return value;
  }) as T;
  return result;
}