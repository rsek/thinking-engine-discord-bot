import type IAttribute from "./IAttribute.js";
import type { currentKeyName, maxKeyName } from "./NumericAttrConstants.js";

export default interface INumericAttribute extends IAttribute {
  [maxKeyName]: number;
  [currentKeyName]: number;
}
