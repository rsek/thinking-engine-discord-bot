import { EmbedField } from "discord.js";
import Roll from "./Roll.js";
import IRoll from "./IRoll.js";

export default class OpponentRoll extends Roll implements IOpponentRoll {
  name: string;
  constructor(name: string, bonus: number) {
    super({ dice: [ 6, 6 ], modifier: bonus });
    this.name = name;
    this.toField = this.toField.bind(this);
  }
  toField() {
    const field: EmbedField = {
      name: this.name,
      value: this.toString(),
      inline: true
    };
    return field;
  }
}

export interface IOpponentRoll extends IRoll {
  name: string;
  toField: () => EmbedField;
}
