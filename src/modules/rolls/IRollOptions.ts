import type DiceExpression from "./diceExpression.js";


export default interface IRollOptions {
  dice: number[] | number | DiceExpression;
  modifier?: number | undefined;
  description?: string | undefined;
}
