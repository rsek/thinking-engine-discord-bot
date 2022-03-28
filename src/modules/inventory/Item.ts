import { ButtonBuilder, InteractionReplyOptions } from "discord.js";
import IItem from "../../data/interfaces/IItem.js";
import { IRendersButton, IRendersMessage } from "../widgets/IRenders.js";
import WidgetOptions from "../widgets/WidgetOptions.js";
import { RefType, WidgetType } from "../widgets/WidgetType.js";
import GameObject from "./GameObject.js";
import ReferenceTask from "../../interactions/tasks/ReferenceTask.js";
import DamageInfo from "../reference/DamageInfo.js";

// might be fun to experiment with *light* nlp hre, for pluralizing items

export default class Item extends GameObject implements IItem, IRendersButton, IRendersMessage {
  readonly Type: RefType.Item = RefType.Item;
  Name: string;
  Charges?: number | undefined;
  Attacks?: DamageInfo[] | undefined;
  Hands?: number | undefined;
  constructor(id: string, data: IItem, name: string = id) {
    super(id, undefined, data.Description);
    this.Charges = data.Charges;
    this.Name = name;
    this.Hands = data.Hands;

    if (data.Attacks) {
      this.Attacks = data.Attacks.map((dmgInfo, index, attacks) => {
        const dmgId = `${dmgInfo.Name ?? this.Name} (${dmgInfo["Attack type"]} attack)`;
        let dmgName = dmgInfo.Name ?? this.Name;
        if (!dmgInfo.Name && attacks.length > 1 && index > 0) {
          dmgName += ` (${dmgInfo["Attack type"]})`;
        }
        return new DamageInfo(dmgId, dmgInfo, this, dmgName);
      });
      this.WidgetTypes.push(WidgetType.DamageTable);
    }
  }


  toEmbed() {
    const embed = super.toEmbed();
    if (this.Charges) {
      embed.addFields({
        name: "Charges",
        value: this.Charges.toString(),
        inline: true
      });
    }
    if (this.Hands && this.Hands > 1) {
      embed.addFields({
        name: "Hands",
        value: this.Hands.toString(),
        inline: true
      });
    }
    return embed;
  }
  toMessage(): WidgetOptions<InteractionReplyOptions> {
    const message = {
      embeds: [this.toEmbed()]
    };
    if (this.Attacks) {
      this.Attacks.forEach(attack => message.embeds.push(attack.toEmbed()));
    }
    return message;
  }
  toButton(ephemeral: boolean): ButtonBuilder {
    return ReferenceTask.createButton(this, ephemeral);
  }
  // TODO toString
}

// +2 to a skill