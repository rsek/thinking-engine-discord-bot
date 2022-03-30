import { ActionRowBuilder, ButtonStyle } from "discord.js";
import type { EmbedField } from "discord.js";
import type { InteractionReplyOptions } from "discord.js";
import type { ButtonBuilder } from "discord.js";
import _ from "lodash-es";
import type DiceExpression from "./diceExpression.js";
import type IRoll from "./IRoll.js";
import type IRollOptions from "./IRollOptions.js";
import parseDice from "./parseDice.js";
import type { RollTaskParamsBase } from "../tasks/ITaskParams.js";
import buildWidgetStub from "../widgets/buildWidgetStub.js";
import type { IRendersButton, IRendersEmbed, IRendersEmbedField, IRendersMessage } from "../widgets/IRenders.js";
import type WidgetOptions from "../widgets/WidgetOptions.js";
import { WidgetType } from "../widgets/WidgetType.js";

export default abstract class RollBase<T extends RollTaskParamsBase> implements IRoll, IRendersEmbed, IRendersEmbedField, IRendersMessage, IRendersButton {
  static WidgetType: WidgetType;
  description?: string | undefined;
  title?: string | undefined;
  private _dice: number[];
  private _results!: number[];
  private _modifier: number = 0;
  constructor({ dice, modifier, description }: IRollOptions) {
    this.description = description;
    if (typeof dice === "string") {
      const parsed = parseDice(dice);
      this._dice = parsed.dice;
      this._modifier +=  (modifier ?? 0);
    } else if (Array.isArray(dice)) {
      this._dice = dice;
    } else {
      this._dice = [dice];
    }
    this._modifier += (modifier ?? 0);
    this.roll();
  }
  public get dice() {
    return this._dice;
  }
  public set dice(value: number[]) {
    this._dice = value;
  }

  public get results(): number[] {
    return this._results;
  }
  public set results(value: number[]) {
    this._results = value;
  }
  get total(): number {
    return _.sum(this.results) + this.modifier;
  }
  get modifier(): number {
    return this._modifier;
  }
  roll() {
    this.results = this.dice.map(die => _.random(1,die));
    return this;
  }
  toDiceExpression(): DiceExpression {
    const diceCount = _.countBy(this.dice);
    // console.log("diceCount", diceCount);
    const expressionFragments = _.map(diceCount, (count, dieSides) => `${count}d${dieSides}`);
    let expression = expressionFragments.join("+");
    if (this.modifier !== 0) {
      if (this.modifier > 0) {
        expression += `+${this.modifier}`;
      } else {
        expression += this.modifier;
      }
    }
    return expression as DiceExpression;
  }
  toEmbed() {
    const embed = buildWidgetStub(
      WidgetType.DiceRoll,
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
    if (this.toModifierString().length > 0) {
      str += " " + this.toModifierString();
    }
    return str;
  }
  protected toModifierString(): string {
    if (this.modifier === 0 ) {
      return "";
    }
    let string = `${this.modifier}`;
    if (this.modifier >= 0) {
      string = `+ ${string}`;
    }
    return string;
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
    if (this.toModifierString().length) {
      value += this.toModifierString();
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
  abstract toButton(isReroll: boolean): ButtonBuilder;
  abstract toParams(isReroll: boolean): T;
  protected toModifierField(): EmbedField {
    return {
      name: "Modifier",
      value: this.toModifierString().replace(" ",""),
      inline: true,
    };
  }
}