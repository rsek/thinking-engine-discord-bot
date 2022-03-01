import * as Discord from "discord.js"
import Tuple from "../../types/Tuple.js";
import IAttack from "../data/interfaces/IAttack.js";
import { AttackType } from "../data/interfaces/IWeapon.js";

export default class Attack implements IAttack {
  Origin: string;
  Damage: Tuple<number, 7>;
  Type?: AttackType | undefined;
  "Ignore armour" ?: number | undefined;
  Hands?: number | undefined;
  constructor(origin: string, attack: IAttack) {
    this.Origin = origin;
    this.Damage = attack.Damage;
    this.Type = attack.Type;
    this["Ignore armour"] = attack["Ignore armour"];
    this.Hands = attack.Hands;
    this.getDamageString = this.getDamageString.bind(this);
    this.toEmbed = this.toEmbed.bind(this);
  }
  getDamageString() {
    const cellWidth = 2
    const tableHead = this.Damage.map((_,index) => {
      let rollString = (index+1).toString();
      if (rollString == "7") {
        rollString += "+";
      }
      return rollString.padEnd(cellWidth);
    } ).join(" | ");

    const tableBody = this.Damage.map((item) => {
      const dmgString = item.toString();
      return dmgString.padEnd(cellWidth);
    } ).join(" | ");
    const tableBorder = tableHead.replace(/[^|]/g, "-");
    const result = [tableHead, tableBorder, tableBody].join("\n");
    return "```" + result + "```";
  }
  toEmbed() {
    const embed = new Discord.MessageEmbed()
      .setAuthor({name: this.Origin})
      .setTitle(this.Type ? this.Type +" Attack": "Attack")
      ;
    if (this.Hands) {
      embed.addField("Hands", this.Hands.toString(), true)
    }
    if (typeof this["Ignore armour"] != "undefined") {
      const armorIgnoreString = this["Ignore armour"] == -1 ? "All" : this["Ignore armour"].toString();
      embed.addField("Ignore armour",armorIgnoreString, true);
    }
    embed.addField("Damage", this.getDamageString())
    return embed;
  }
}