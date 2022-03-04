import { EmbedField, MessageEmbed } from "discord.js";
import _ from "lodash-es";
import diceExpression from "../types/diceExpression.js";

export default class Roll implements IRoll {
  private _quantity: number;
  private _sides: number;
  private _modifier: number;
  private _dice!: number[];
  private _description?: string | undefined;
  constructor(quantity = 1, sides = 6, modifier = 0, description?: string | undefined)
  {
    if (this.quantity < 1) {
      throw new RangeError("Quantity of dice must be at least 1.");
    }
    if (this.sides < 2) {
      throw new RangeError("Dice must have at least 2 sides.");
    }
    this._description = description;
    this._quantity = quantity;
    this._sides = sides;
    this._modifier = modifier;
    this.roll();
  }
  public get description(): string | undefined {
    return this._description;
  }
  public set description(value: string | undefined) {
    this._description = value;
  }

  roll() {
    const newRoll = [];
    for (let i = 0; i < this._quantity; i++) {
      newRoll.push(_.random(1, this._sides));
    }
    this._dice = newRoll;
    return this.dice;
  }
  toDiceExpression(): diceExpression {
    let expression = `${this.quantity}d${this.sides}`;
    if (this.modifier != 0) {
      if (this.modifier > 0) {
        expression += `+${this.modifier}`;
      }
      else {
        expression += this.modifier;
      }
    }
    return expression as diceExpression;
  }
  public get sides(): number {
    return this._sides;
  }
  public get quantity(): number {
    return this._quantity;
  }
  public get dice(): number[] {
    return this._dice;
  }
  get modifier(): number {
    return this._modifier;
  }
  get total(): number {
    // console.log(this.dice);
    return _.sum(this.dice) + this.modifier;
  }
  toModifierString(): string {
    let string = `${this.modifier}`;
    if (this.modifier >= 0) {
      string = `+ ${string}`
    }
    return string;
  }
  toDiceString(): string {
    return `[${this.dice.map(die => die.valueOf()).join(", ")}]`;
  }
  toString(): string {
    return `${this.toDiceString()} ${this.toModifierString()} = **${this.valueOf()}**`;
  }
  toRollField(): EmbedField {
    return {
      name: "Roll",
      value: `${this.toDiceString()} ${this.toModifierString()}`,
      inline: true
    }
  }
  toTotalField(): EmbedField {
    return {
      name: "Total",
      value: this.total.toString(),
      inline: true
    }
  }
  valueOf(): number {
    return this.total;
  }

  toEmbed(): MessageEmbed {
    const embed = new MessageEmbed()
      .setTitle(`Roll ${this.toDiceExpression()}`)
      .addFields(
        this.toRollField(),
        this.toTotalField()
      )
    ;
    if (this.description) {
      embed.setDescription(this.description);
    }
    return embed;
  }
}

export interface IRoll {
  dice: number[];
  modifier: number;
  total: number;
  description?: string | undefined;
  valueOf: () => number;
}
