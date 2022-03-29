import type { NumericAttrHash } from "../attributes/NumericAttrConstants.js";
import { endOfRoundToken, enemyToken, nonPlayerTokens } from "./InitiativeConstants.js";



export function isPlayerToken(token: string) {
  return !nonPlayerTokens.includes(token);
}

export function isAllyOfPlayer(token: string) {
  if (token !== enemyToken && token !== endOfRoundToken) {
    return true;
  }
  return false;
}

export function tokenFactionsLeft(tokens: NumericAttrHash) {
  let factionsLeft = 0;
  const actorTokens = Object.keys(tokens).filter(token => token !== endOfRoundToken);
  if (actorTokens.includes(enemyToken)) {
    factionsLeft++;
  }
  if (actorTokens.some(token => token !== enemyToken)) {
    factionsLeft++;
  }
  return factionsLeft;
}