import * as Discord from "discord.js"
import IAttack from "../data/interfaces/IAttack.js";
import ISpell from "../data/interfaces/ISpell.js"
import Attack from "./Attack.js";

export default class Spell implements ISpell {
  Name: string;
  "Casting cost"?: number | undefined;
  Description: string;
  Attacks?: Attack[] | undefined;
  constructor(name: string, spell: ISpell) {
    this.Name = name;
    this["Casting cost"] = spell["Casting cost"];
    this.Description = spell.Description;
    // this.Attacks = spell.Attacks;
    if (spell.Attacks) {
      this.Attacks = spell.Attacks.map(attack => new Attack(this.Name, attack));
    }
    this.toEmbeds = this.toEmbeds.bind(this);
  }
  toEmbeds() {
    let spellEmbed = new Discord.MessageEmbed()
      .setAuthor({name: "Spell"})
      .setTitle(this.Name)
      .setDescription(this.Description)
      // TODO: footer source
      ;
    let embeds = [spellEmbed];
    if (this["Casting cost"]) {
      spellEmbed.addField("Casting Cost",this["Casting cost"].toString(), true);
    }
    if (this["Attacks"]) {
      this["Attacks"].forEach(attack => embeds.push(attack.toEmbed()))
    }
    return embeds;
  }
}
