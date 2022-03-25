import { NumericAttrHash } from "../ux/NumericAttrHash.js";

export default interface IHasAttributes {
  attributes: NumericAttrHash;
  sortAttributes(): void;
}