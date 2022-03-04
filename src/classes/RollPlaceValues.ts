import _ from "lodash";
import diceExpression from "../types/diceExpression.js";
import Roll from "./Roll.js";

export default class RollPlaceValues extends Roll {
  constructor(sides = 6, places = 2, description?: string | undefined) {
    if (sides > 9) {
      throw new RangeError("Sides must be no greater than 9.");
    }
    if (places < 2) {
      throw new RangeError("Must have at least two places (otherwise just use a normal roll). For example, 2 places (d66) is valid, but 1 place (d6) is not.");
    }
    super(places, sides, 0, description);
  }
  get total(): number {
    return Number(this.dice.join(""));
  }
  toDiceExpression(): diceExpression {
    return `d${_.repeat(this.sides.toString(), this.quantity)}` as diceExpression;
  }
}