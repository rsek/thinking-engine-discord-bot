import type { maxKeyName, currentKeyName } from "./NumericAttrConstants.js";
import type IAttribute from "./IAttribute.js";

export default interface INumericAttribute extends IAttribute {
  [maxKeyName]: number;
  [currentKeyName]: number;
}
