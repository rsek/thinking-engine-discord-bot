import { EmbedField, MessageEmbed } from "discord.js";
import _ from "lodash";
import OpponentRoll from "./OpponentRoll.js";

export interface IRollVersus {
  opponents: Record<string, OpponentRoll>;
  description?: string | undefined;
  getWinner: () => OpponentRoll | null | undefined;
  isTied: () => boolean;
  toResultField: () => EmbedField;
  toEmbed: () => MessageEmbed;
}

export default class RollVersus implements IRollVersus {
  opponents: Record<string, OpponentRoll> = {};
  description?: string | undefined;
  constructor(opponent1bonus: number, opponent2bonus: number, opponent1name="Player", opponent2name = "Opponent", description?: string) {
    if (opponent1name == opponent2name) {
      opponent1name += " 1";
      opponent2name += " 2";
    }
    this.opponents[opponent1name] = new OpponentRoll(opponent1name, opponent1bonus);
    this.opponents[opponent2name] = new OpponentRoll(opponent2name, opponent2bonus);

    this.description = description;
    this.getWinner = this.getWinner.bind(this);
    this.isTied = this.isTied.bind(this);
    this.toResultField = this.toResultField.bind(this);
    this.toEmbed = this.toEmbed.bind(this);
    this.valueOf = this.valueOf.bind(this);
  }
  getWinner() {
    if (this.isTied() === true) {
      return null;
    } else {
      return _.reduce(this.opponents, (prev,curr) => prev > curr ? prev : curr);
    }
  }
  isTied(): boolean {
    const opponents = Object.values(this.opponents).map(item => item.valueOf()) as [number, number];
    return _.isEqual(...opponents);
  }
  toResultField() {
    let value;
    if (this.getWinner() != null) {
      value = this.getWinner()?.name;
      value += " wins";
    } else { value = "Tie";}
    const field: EmbedField = {
      name: "Result",
      value: value as string,
      inline: false
    };
    return field;
  }
  toEmbed() {
    const embed = new MessageEmbed()
      .setTitle("Roll Versus")
      .addFields(
        ..._.map(this.opponents, (opponent) => opponent.toField()),
        this.toResultField()
      )
      ;
    if (this.description) {
      embed.setDescription(this.description);
    }
    return embed;
  }
}