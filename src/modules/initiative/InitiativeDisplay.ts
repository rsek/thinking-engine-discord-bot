import { TypedRegEx } from "typed-regex";

export const roundPrefix = "Round: ";
export const turnPrefix = "Turn: ";
export const roundPattern = TypedRegEx(`${roundPrefix}(?<counter>[0-9]+)`);
export const turnPattern = TypedRegEx(`${turnPrefix}(?<counter>[0-9]+)`);
