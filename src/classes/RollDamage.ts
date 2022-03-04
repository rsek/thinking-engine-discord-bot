import { MessageOptions } from "child_process";
import { EmbedField, InteractionReplyOptions, MessageEmbed } from "discord.js";
import _ from "lodash";
import Armour from "../constants/Armour.js";
import Attack from "./Attack.js";
import Roll from "./Roll.js";
import { titleCase } from "title-case";

export default class RollDamage extends Roll {
  // alternately: mighty blow toggle via button?
  attack: Attack;
  armour: Armour;
  isMightyBlow: boolean;
  shield: boolean;
  constructor(attack: Attack, bonus: number, armour: Armour, shield: boolean, isMightyBlow = false) {
    super(1, 6, bonus);
    this.attack = attack;
    this.armour = armour;
    this.isMightyBlow = isMightyBlow;
    this.shield = shield;
  }
  getDamageReduction() {
    return this.shield? this.armour + 1 : this.armour;
  }
  getRawRoll() {
    return this.total - this.getDamageReduction();
  }
  getDamage() {
    let column = Math.min(1, this.getRawRoll());
    column = Math.max(column, 7);
    const damage = this.attack.Damage[column - 1];
    return damage;
  }
  shieldField(): EmbedField {
    return {
      name: "Shield",
      value: "-1",
      inline: true
    }
  }
  armourField(): EmbedField {
    return {
      name: "Armour",
      value: `${Armour[this.armour]} (-${this.armour})`,
      inline: true
    };
  }
  toString(): string {
    let result = `[${this.dice.map(die => die.valueOf()).join(", ")}]`;
    if (this.armour > 0) {
      result += ` - ${this.armour}`;
    }
    result += ` + ${this.modifier.toString()}`;
    result += ` = **${this.valueOf()}**`;
    return result;
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
      inline: false
    }
  }
  toEmbed(): MessageEmbed {
    const footerText: string[] = [];
    const embed = new MessageEmbed()
      .setAuthor({name: titleCase(this.attack.Origin)})
      .setTitle(this.isMightyBlow ? "Damage Roll: A Mighty Blow!" : "Damage Roll");
    if (this.armour > 0) {
      embed.addFields(this.armourField());
    }
    if (this.shield) {
      embed.addFields(this.shieldField());
    }
    embed.addFields(this.rollField());

    const result = this.resultField();
    // result.inline = embed.fields.length > 1;
    embed.addFields(result);

    switch (true) {
      case (this.attack["Ignore armour"] == -1): // magic number for ignoring all armour
        footerText.push("This attack ignores armour.");
        break;
      case (!_.isUndefined(this.attack["Ignore armour"]) && this.attack["Ignore armour"] > 0):
        footerText.push(`This attack ignores ${this.attack["Ignore armour"] as number} armour.`);
        break;
      default:
        break;
    }
    if (this.isMightyBlow) {
      footerText.push ("When striking a Mighty Blow you double the amount of Stamina lost as a result of a Damage Roll.");
    }
    if (footerText.length) {
      embed.setFooter({text: footerText.join("\n")});
    }


    return embed;
  }
  // toMessage(): InteractionReplyOptions {
  //   const options = {
  //     embeds: [this.toEmbed()]
  //   };
  //   return options;
  // }
}