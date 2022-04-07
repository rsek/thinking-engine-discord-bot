import type { EmbedField } from "discord.js";
import type { InteractionReplyOptions } from "discord.js";
import { ActionRowBuilder, ButtonStyle } from "discord.js";
import { ButtonBuilder } from "discord.js";
import _ from "lodash-es";
import type DiceExpression from "./diceExpression.js";
import type IRoll from "./IRoll.js";
import type IRollBase from "./IRollBase.js";
import type RollWidgetType from "./RollWidgetType";
import type { BotTaskRoll, IBotTasksParams } from "../tasks/BotTask.js";
import { packTaskParams } from "../tasks/packTaskParams.js";
import buildWidgetStub from "../widgets/buildWidgetStub.js";
import type WidgetOptions from "../widgets/WidgetOptions.js";
import { WidgetType } from "../widgets/WidgetType.js";

export default abstract class RollBase<T extends BotTaskRoll> implements IRoll, IRollBase<T> {
  description?: string | undefined;
  title?: string | undefined;
  params: IBotTasksParams[T];
  constructor({ params, description }: { params: IBotTasksParams[T]; description?: string | undefined; }) {
    this.params = params;
    this.description = description;
  }

  abstract readonly widgetType: RollWidgetType;
  abstract readonly botTask: T;
  abstract dice: number[];
  abstract modifiers: number[];
  abstract results: number[];
  toTaskParams(isReroll: boolean): IBotTasksParams[T] {
    const params = _.clone(this.params);
    params.isReroll = isReroll;
    return params;
  }
  //   this.roll();
  packTaskParams(isReroll: boolean): string {
    return packTaskParams(this.botTask, this.toTaskParams(isReroll));
  }
  get total(): number {
    return _.sum([ ...this.results, ...this.modifiers ]);
  }
  roll(): this {
    this.results = this.dice.map(die => _.random(1,die));
    return this;
  }
  toDiceExpression(): DiceExpression {
    const diceCount = _.countBy(this.dice);
    // console.log("diceCount", diceCount);
    const expressionFragments = _.map(diceCount, (count, dieSides) => `${count}d${dieSides}`);
    let expression = expressionFragments.join("+");
    if (this.modifiers.length > 0) {
      _.compact(this.modifiers).forEach(mod => expression+= mod > 0 ? `+${mod}` : mod.toString());
    }
    return expression as DiceExpression;
  }
  protected toModifiersString(): string {
    const mods = _.compact(this.modifiers);
    let string = "";
    if (mods.length > 0) {
      mods.forEach(mod => string += mod > 0 ? `+${mod}` : mod.toString());
    }
    return string;
  }
  toEmbed() {
    const embed = buildWidgetStub(
      WidgetType.RollDice,
      this.toDiceExpression()
    ).addFields(
      this.toResultField(),
      this.toTotalField()
    )
      ;
    if (this.description) {
      embed.setDescription(this.description);
    }
    return embed;
  }
  valueOf(): number {
    return this.total;
  }
  toString(): string {
    return `${this.toRollString()} = **${this.valueOf()}**`;
  }
  protected toRollString(): string {
    let str = `[${this.results.map(die => die.valueOf()).join(", ")}]`;
    if (this.toModifiersString().length > 0) {
      str += " " + this.toModifiersString();
    }
    return str;
  }

  toEmbedField(type: "roll" | "total"): EmbedField {
    let result: EmbedField;
    switch (type) {
      case "roll":
        result = this.toResultField();
        break;
      case "total":
        result = this.toTotalField();
        break;
      default:
        throw new Error("Embed field type must be specified.");
    }
    return result;
  }
  protected toResultField(): EmbedField {
    let value = this.toRollString();
    if (this.toModifiersString().length) {
      value += this.toModifiersString();
    }
    return {
      name: "Result",
      value,
      inline: true
    };
  }
  protected toTotalField(): EmbedField {
    return {
      name: "Total",
      value: this.total.toString(),
      inline: true
    };
  }
  toMessage(): WidgetOptions<InteractionReplyOptions> {
    const message = {
      embeds: [this.toEmbed()],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          this.toButton(true)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Reroll")
        )
      ]
    };
    return message;
  }
  add(...dice: number[]) {
    dice.forEach(die => {
      this.dice.push(die);
      this.results.push(_.random(1, die));
    });
    return this;
  }
  toButton(isReroll: boolean = false): ButtonBuilder {
    {
      return new ButtonBuilder()
        .setLabel(`Roll ${this.toDiceExpression()}`)
        .setEmoji({ name: "🎲" })
        .setStyle(ButtonStyle.Primary)
        .setCustomId(
          packTaskParams(
            this.botTask,
            this.toTaskParams(isReroll))
        )
      ;
    }
  }
  protected toModifiersField(): EmbedField {
    return {
      name: "Modifiers",
      value: this.toModifiersString(),
      inline: true,
    };
  }
}



// constructor({ dice, modifier, description }: IRollOptions, botTask: T) {
//   this.botTask = botTask;
//   this.description = description;
//   if (typeof dice === "string") {
//     const parsed = parseDice(dice);
//     this._dice = parsed.dice;
//     this._modifier +=  (modifier ?? 0);
//   } else if (Array.isArray(dice)) {
//     this._dice = dice;
//   } else {
//     this._dice = [dice];
//   }