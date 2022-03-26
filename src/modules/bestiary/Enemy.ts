import { EmbedBuilder, InteractionReplyOptions } from "discord.js";
import { IRendersEmbed } from "../attributes/IRenders.js";
import NumericAttribute from "../attributes/NumericAttribute.js";
import IHasAttributes from "../initiative/IHasAttributes.js";
import WidgetOptions from "../initiative/WidgetOptions.js";
import IGameObject from "../inventory/IGameObject.js";
import { WidgetType, RefType } from "../parseComponent/WidgetType.js";
import buildWidgetStub from "../rolls/buildWidgetStub.js";
import Roll from "../rolls/Roll.js";
import Table from "../tables/Table.js";
import { NumericAttrHash, numericAttrHashToFields } from "../ux/NumericAttrHash.js";
import IEnemyYaml from "./IEnemyYaml.js";
import IEnemyBase from "./IEnemyBase.js";
import ReferenceTask from "../../interactions/tasks/ReferenceTask.js";

export type EnemyAttrHash = NumericAttrHash & {
  Skill: NumericAttribute,
  Stamina: NumericAttribute,
  Initiative: NumericAttribute,
  Armour: NumericAttribute
};

export default class Enemy implements IEnemyBase, IGameObject, IRendersEmbed, IHasAttributes {
  $id: string;
  Name: string;
  attributes: EnemyAttrHash;
  "Damage as": string;
  Mien: Table;
  Description: string;
  Special?: string | undefined;
  WidgetTypes: WidgetType[] = [WidgetType.Bestiary];
  Type: RefType = RefType.Bestiary;
  constructor(name: string, data: IEnemyYaml) {
    this.Name = name;
    this.$id = name;
    this.attributes = {
      Skill: new NumericAttribute("Skill", data.Skill),
      Stamina: new NumericAttribute("Stamina", data.Stamina),
      Initiative: new NumericAttribute("Initiative", data.Initiative),
      Armour: new NumericAttribute("Armour", data.Armour),
    };
    // TODO: change this to reference the actual table... or just include a method to, like, look it up based on whatever the string is set to.
    this["Damage as"] = data["Damage as"];
    this.Mien = new Table(`Mien: ${this.$id}`, data.Mien as Record<number, string>, () => new Roll({ dice: "1d6" }).valueOf());
    this.Description = data.Description;
    this.Special = data.Special;
  }
  toEmbed(): EmbedBuilder {
    const embed = buildWidgetStub(this.WidgetTypes[0], this.Name)
      .setDescription(this.Description)
    ;
    embed.addFields(
      ...numericAttrHashToFields(this.attributes, true),
      {
        name: "Damage as",
        value: this["Damage as"],
        inline: true
      }
    );
    if (this.Special) {
      embed.addFields(
        { name: "Special", value: this.Special }
      );
    }
    return embed;
  }
  toMessage(ephemeral: boolean = true): WidgetOptions<InteractionReplyOptions> {
    const enemyEmbed = this.toEmbed();
    const tableMsg = this.Mien.toPreviewMessage(ephemeral);
    tableMsg.embeds.unshift(enemyEmbed);
    return tableMsg;
  }
}