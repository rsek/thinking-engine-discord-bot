import { endOfRoundToken, enemyToken, nonPlayerTokens } from "./InitiativeConstants.js";
import type { NumericAttrHash } from "../attributes/NumericAttrConstants.js";

/**
 * Is the token a player token?
 * @param {string} token - the token to check
 * @returns A boolean value.
 */
export function isPlayerToken(token: string) {
  return !nonPlayerTokens.includes(token);
}

/**
 * Is the token an ally of the player?
 * @param {string} token - The token to check.
 * @returns A boolean value.
 */
export function isAllyOfPlayer(token: string) {
  if (token !== enemyToken && token !== endOfRoundToken) {
    return true;
  }
  return false;
}

/**
 * Given a hash of tokens, return the number of factions that have tokens left.
 * @param {NumericAttrHash} tokens - NumericAttrHash
 * @returns The number of factions left in the game.
 */
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