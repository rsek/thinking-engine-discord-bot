import _ from "lodash-es";
import parseDice from "./parseDice.js";
import RollBase from "./RollBase.js";
import { BotTask } from "../tasks/BotTask.js";
import type { IRollDiceTaskParams } from "../tasks/ITaskParams.js";
import { WidgetType } from "../widgets/WidgetType.js";

export default class RollDice extends RollBase<BotTask.RollDice> {
  readonly botTask = BotTask.RollDice;
  readonly widgetType = WidgetType.RollDice;
  results!: number[];
  constructor(params: IRollDiceTaskParams, description?: string|undefined) {
    super({ params, description });
    this.roll();
  }
  get modifiers() {
    return this.params.mods ?? [];
  }
  get dice() {
    return parseDice(this.params.dice).dice;
  }
  toTaskParams(isReroll: boolean = false): IRollDiceTaskParams {
    const params = _.clone(this.params);
    params.isReroll = isReroll;
    return params;
  }
}
