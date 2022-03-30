import type { ButtonBuilder } from "discord.js";
import type DiceExpression from "./diceExpression.js";
import { dicePattern } from "./diceExpression.js";
import RollBase from "./RollBase.js";
import type { IRollPlaceValuesTaskParams } from "../tasks/ITaskParams.js";

export default class RollPlaceValues extends RollBase<IRollPlaceValuesTaskParams> {
  static isPlaceValues = true;
  static fromString(expression: DiceExpression, description?: string): RollPlaceValues {
    if (!expression.startsWith("d")) {
      throw RangeError();
    }
    // e.g. d36, d66, d666
    // TODO: better type checking
    const pattern = dicePattern.captures(expression);
    if (!pattern) {
      throw new RangeError("Unable to parse dice expression.");
    }
    return new RollPlaceValues(Number(pattern?.sides), description);
  }
  constructor(dieType: number, description?: string | undefined) {
    const dice = dieType.toString().split("")
      .map(item => Number(item));
    if (dice.some(item => item < 2)) {
      throw new RangeError("All digits must be at least 2, otherwise there's not much to roll.");
    }
    super({
      dice, modifier: 0, description
    });
  }
  toButton(isReroll: boolean): ButtonBuilder {
    throw new Error("Method not implemented.");
  }
  
  
  toParams(isReroll: boolean): IRollPlaceValuesTaskParams {
    throw new Error("Method not implemented.");
  }
  
  
  
  get total(): number {
    return Number(this.results.join(""));
  }
  override toDiceExpression(): DiceExpression {
    return `d${this.dice.join("")}` as DiceExpression;
  }
}