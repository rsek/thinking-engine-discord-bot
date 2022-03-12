import DiceExpression from "./diceExpression.js";


/**
 * Generates a dice expression from numeric input.
 *
 * @export
 * @param {({ quantity: number; sides: number; modifier?: number | undefined; })} { quantity, sides, modifier }
 * @return {*}  {DiceExpression}
 */
export default function toDiceExpression({ quantity, sides, modifier }: { quantity: number; sides: number; modifier?: number | undefined; }): DiceExpression {
  let str = `${quantity}d${sides}`;
  if (modifier) {
    if (modifier > 0) {
      str += `+${modifier}`;
    } else {
      str += modifier.toString();
    }
  }
  return str as DiceExpression;
}