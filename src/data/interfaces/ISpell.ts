import type IDamageInfo from "./IDamageInfo.js";
import type IItem from "./IItem.js";

export default interface ISpell extends IItem {
  Description: string;
  "Casting cost"?: string | number | undefined;
  Attacks?: IDamageInfo[] | undefined;
}