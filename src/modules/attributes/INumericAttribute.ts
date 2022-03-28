import { maxKeyName, currentKeyName } from "./NumericAttrConstants.js";
import IAttribute from "./IAttribute.js";

export default interface INumericAttribute extends IAttribute {
  [maxKeyName]: number;
  [currentKeyName]: number;
}
