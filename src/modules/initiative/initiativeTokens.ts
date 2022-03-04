// get round + turn count with typed regex
// timer element - component? lasts a set number of turns or rounds.

import { CurrentMaxHash } from "./currentMax.js";



export const enemyToken = "Enemies";
export const henchmanToken = "Henchmen";
export const endOfRoundToken = "End of the Round";
export const pcTokenValue = 2;

const nonPlayerTokens = [enemyToken, henchmanToken, endOfRoundToken];

export function isPlayerToken(token: string) {
  return !nonPlayerTokens.includes(token);
}

export function isAllyOfPlayer(token: string) {
  if (token != enemyToken && token != endOfRoundToken) {
    return true;
  }
  return false;
}

export function tokenFactionsLeft(tokens: CurrentMaxHash) {
  let factionsLeft = 0;
  const actorTokens = Object.keys(tokens).filter(token => token != endOfRoundToken);
  if (actorTokens.includes(enemyToken)) {
    factionsLeft++;
  }
  if (actorTokens.some(token => token != enemyToken)) {
    factionsLeft++;
  }
  return factionsLeft;
}