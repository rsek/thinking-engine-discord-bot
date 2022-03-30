import { ButtonBuilder, ButtonStyle } from "discord.js";
import type DiceExpression from "./diceExpression.js";
import { dicePattern } from "./diceExpression.js";
import type IRollOptions from "./IRollOptions.js";
import parseDice from "./parseDice.js";
import RollBase from "./RollBase.js";
import { BotTask } from "../tasks/BotTask.js";
import type { IRollDiceTaskParams } from "../tasks/ITaskParams.js";
import { packTaskParams } from "../tasks/packTaskParams.js";
import { WidgetType } from "../widgets/WidgetType.js";

export default class RollDice extends RollBase<IRollDiceTaskParams> {
  static WidgetType: WidgetType = WidgetType.DiceRoll;
  static fromString(expression: DiceExpression, description?: string | undefined): RollDice {
    if (!dicePattern.match(expression)) {
      throw new RangeError("Invalid dice expression");
    }
    const options = parseDice(expression) as IRollOptions;
    if (description) {
      options.description = description;
    }
    return new RollDice(options);
  }
  toParams(isReroll: boolean = false): IRollDiceTaskParams {
    return {
      isReroll,
      dice: this.toDiceExpression()
    };
  }
  toButton(isReroll: boolean = false): ButtonBuilder {
    return new ButtonBuilder()
      .setLabel(`Roll ${this.toDiceExpression()}`)
      .setEmoji({ name: "🎲" })
      .setStyle(ButtonStyle.Primary)
      .setCustomId(
        packTaskParams(
          BotTask.RollDice,
          this.toParams(isReroll)
        )
      );
  }
}


