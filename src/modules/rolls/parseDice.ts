import type DiceExpression from "./diceExpression.js";
import { dicePattern } from "./diceExpression.js";

/**
 * Attempts to parse dice notation into options suitable for use with Roll constructors.
 *
 * @export
 * @param {DiceExpression} expression
 * @return {*}
 */
export default function parseDice(expression: DiceExpression): { dice: number[]; modifiers: number[]; } {
  let modifier = 0;
  const dice: number[] = [];
  const parse = dicePattern.captureAll(expression);
  parse.forEach(item => {
    const quantity = Number(item?.quantity ?? 1);
    const sides = Number(item?.sides);
    for (let i = 0; i < quantity; i++) {
      dice.push(sides);
    }
    modifier += Number(item?.modifier) ?? 0;
  });
  return {
    dice,
    modifiers: [modifier]
  };
}


