import { TypedRegEx } from "typed-regex";
import NumericAttribute from "./NumericAttribute.js";


export const NumericAttrSeparator = " / ";

export const currentKeyName = "current";
export const maxKeyName = "max";

export type NumericAttrHash = Record<string, NumericAttribute>;

export type NumericAttrString = `${number}${typeof NumericAttrSeparator}${number}`;

export const NumericAttrPattern = TypedRegEx(`^(?<${currentKeyName}>[0-9]+)(${NumericAttrSeparator})?(?<${maxKeyName}>[0-9]+)?$`);
