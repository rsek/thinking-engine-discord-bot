import _ from "lodash";
import diceExpression, { dicePattern } from "../types/diceExpression.js";

interface IRollOptions {
  quantity: number;
  sides: number;
  modifier: number;
}

export default function parseDice(diceNotation: diceExpression): IRollOptions {
  const values = _.mapValues(dicePattern.captures(diceNotation), (value) => isNaN(Number(value)) ? 0 : Number(value));
  if (!values.quantity) {
    values.quantity = 1;
  }
  if (!values.modifier) {
    values.modifier = 0;
  }
  return values as IRollOptions;
}


