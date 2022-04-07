import type DiceExpression from "./diceExpression.js";
import RollBase from "./RollBase.js";
import { BotTask } from "../tasks/BotTask.js";
import type { IRollPlaceValuesTaskParams } from "../tasks/ITaskParams.js";
import { WidgetType } from "../widgets/WidgetType.js";

export default class RollPlaceValues extends RollBase<BotTask.RollPlaceValues> {
  static isPlaceValues = true;
  readonly botTask = BotTask.RollPlaceValues;
  modifiers: number[] = [];
  results!: number[];
  readonly widgetType = WidgetType.RollDice;
  constructor( params: IRollPlaceValuesTaskParams, description?: string | undefined) {
    super({ params, description });
    if (this.dice.some(die => die < 2)) {
      throw new RangeError("All digits must be at least 2, otherwise there's not much to roll.");
    }
    this.roll();
  }


  public get dieType() {
    return this.params.dieType;
  }
  public get dice() {
    return this.params.dieType.toString().split("")
      .map(die => Number(die));
  }
  public get total(): number {
    return Number(this.results.join(""));
  }

  toTaskParams(isReroll: boolean=false): IRollPlaceValuesTaskParams {
    return {
      dieType: this.dieType,
      isReroll
    };
  }

  override toDiceExpression(): DiceExpression {
    return `D${this.dieType}` as DiceExpression;
  }
}

// const test = new RollPlaceValues({ params: { dieType: 66 } });
// console.log(test);