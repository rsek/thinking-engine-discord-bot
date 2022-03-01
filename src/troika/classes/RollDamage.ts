import { EmbedField, MessageEmbed } from "discord.js";
import Armour from "../constants/Armour.js";
import Attack from "./Attack.js";
import Roll from "./Roll.js";

export default class RollDamage extends Roll {
  // alternately: mighty blow toggle via button?
  attack: Attack;
  armour: Armour;
  isMightyBlow: boolean;
  constructor(attack: Attack, bonus: number, armour: Armour, isMightyBlow = false) {
    super(1, 6, bonus);
    this.attack = attack;
    this.armour = armour;
    this.isMightyBlow = isMightyBlow;
  }
  getRawRoll() {
    return this.total - this.armour;
  }
  getDamage() {
    let column = Math.min(1, this.getRawRoll());
    column = Math.max(column, 7);
    const damage = this.attack.Damage[column - 1];
    return damage;
  }
  armourField(): EmbedField {
    return {
      name: "Armour",
      value: `${Armour[this.armour]} (-${this.armour})`,
      inline: true
    };
  }
  toString(): string {
    let result = `[${this.dice.map(die => die.valueOf()).join(", ")}] + ${this.bonus}`;
    if (this.armour > 0) {
      result += ` - ${this.armour}`;
    }
    const sum = `**${this.valueOf()}**`;
    return [result, sum].join(" ");
  }
  rollField(): EmbedField {
    return {
      name: "Roll",
      value: this.toString(),
      inline: true
    }
  }
  resultField(): EmbedField {
    return {
      name: "Damage",
      value: this.getDamage().toString(),
      inline: true
    }
  }
  toEmbed(): MessageEmbed {
    const embed = new MessageEmbed()
      .setAuthor({name: this.attack.Origin})
      .setTitle(this.isMightyBlow ? "Damage Roll: A Mighty Blow!" : "Damage Roll")
      .addFields(
        this.armourField(),
        this.rollField(),
        this.resultField()
      );
    if (this.isMightyBlow) {
      embed.setFooter({text: "When striking a Mighty Blow you double the amount of Stamina lost as a result of a Damage Roll."});
    }
    return embed;
  }
}