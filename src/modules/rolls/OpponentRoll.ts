import type { EmbedField } from "discord.js";
import type IRoll from "./IRoll.js";
import RollDice from "./RollDice.js";

export default class OpponentRoll extends RollDice implements IOpponentRoll {
  name: string;
  constructor(name: string, bonus: number) {
    super({ dice: [ 6, 6 ], modifier: bonus });
    this.name = name;
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
