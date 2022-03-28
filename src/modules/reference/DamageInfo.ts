import { InteractionReplyOptions } from "discord.js";
import AttackType from "../../constants/AttackType.js";
import Tuple from "../../types/Tuple.js";
import { IRendersEmbed } from "../widgets/IRenders.js";
import { RefType, WidgetType } from "../widgets/WidgetType.js";
import Item from "../inventory/Item.js";
import GameObject from "../inventory/GameObject.js";
import IDamageInfo from "../../data/interfaces/IDamageInfo.js";
import Spell from "./Spell.js";
import ItemIn from "../../types/ItemIn.js";
import WidgetOptions from "../widgets/WidgetOptions.js";
import toSentenceCase from "../text/toSentenceCase.js";

export default class DamageInfo extends GameObject implements IDamageInfo, IRendersEmbed {
  Type: RefType = RefType.DamageTable;
  WidgetTypes: WidgetType[] = [WidgetType.DamageTable];
  "Source": Item | Spell;
  Damage: Tuple<number, 7>;
  "Attack type": AttackType;
  "Ignore armour": number;
  constructor(id: string, data: IDamageInfo, damageSource: Item|Spell, name: string) {
    // const id = data.$id ?? `${damageSource.$id} (${data["Attack type"]?.toLowerCase() ?? "unknown"} attack)`;
    const newName = name ?? damageSource.Name ?? damageSource.Name ?? damageSource.$id;
    super(id, newName);
    this["Source"] = damageSource;
    this.Damage = data.Damage;
    this["Attack type"] = data["Attack type"] ?? AttackType.Other;
    this["Ignore armour"] = data["Ignore armour"] ?? 0;
    this.Description = this.Source.Description;
  }
  getAsciiTable() {
    const cellJoiner = "|";
    const tableHeadElements = [ "ROLL", ...this.Damage ].map((_,index) => {
      if (typeof _ === "string") {
        return _;
      }
      let rollString = (index).toString();
      if (rollString === "7") {
        rollString += "+";
      }
      return rollString;
    } );

    const tableBodyElements = [ "DAMAGE", ...this.Damage ].map((item) => item.toString()
    );

    tableHeadElements.forEach((cell, colIndex) => {
      const targetLength = Math.max(cell.length, tableBodyElements[colIndex].length);
      tableHeadElements[colIndex] = tableHeadElements[colIndex].padStart(targetLength, " ");
      tableBodyElements[colIndex] = tableBodyElements[colIndex].padStart(targetLength, " ");
    });
    const tableBody = " " + tableBodyElements.join(" " + cellJoiner + " ") + " ";
    const tableHead = " " + tableHeadElements.join(" " + cellJoiner + " ") + " ";

    const tableInteriorBorder = tableHead.replace(/[^|]/g, "-");
    const tableBorder = tableHead.replace(/./g, "-");
    const result = [
      "```",
      tableBorder,
      tableHead,
      tableInteriorBorder,
      tableBody,
      tableBorder,
      "```"
    ].join("\n");
    return result;
  }
  override toMessage<T extends ItemIn<typeof this["WidgetTypes"]>>(type: T, ephemeral?: boolean): WidgetOptions<InteractionReplyOptions> {
    return {
      embeds: [this.toEmbed()],
      ephemeral,
    };
  }
  override toEmbed() {
    const embed = super.toEmbed()
      .setDescription(
        this.getAsciiTable()
      )
      .addFields({
        name: "Type",
        value: toSentenceCase(this["Attack type"]),
        inline: true
      });
    if (this["Ignore armour"] !== 0) {
      const armorIgnoreString = this["Ignore armour"] === -1 ? "All" : this["Ignore armour"].toString();
      embed.addFields({
        name: "Ignore armour", value: armorIgnoreString, inline: true
      });
    }
    return embed;
  }
}