import { TypedRegEx } from "typed-regex";

export const roundPrefix = "Round: ";
export const turnPrefix = "Turn: ";
export const roundPattern = TypedRegEx(`${roundPrefix}(?<counter>[0-9]+)`);
export const turnPattern = TypedRegEx(`${turnPrefix}(?<counter>[0-9]+)`);

export const enemyToken = "Enemies";
export const henchmanToken = "Henchmen";
export const endOfRoundToken = "End of the Round";
export const pcTokenValue = 2;

export const nonPlayerTokens = [ enemyToken, henchmanToken, endOfRoundToken ];

export const addTokenMenuId = "addTokenMenu";
export const removeTokenMenuId = "removeTokenMenu";
export const returnTokenMenuId = "returnTokenMenu";
