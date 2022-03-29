import type ISpell from "../../data/interfaces/ISpell.js";
import { RefType, WidgetType } from "../widgets/WidgetType.js";
import GameObject from "../inventory/GameObject.js";
import DamageInfo from "./DamageInfo.js";
import type { IRendersMessage } from "../widgets/IRenders.js";
import type { InteractionReplyOptions } from "discord.js";
import type WidgetOptions from "../widgets/WidgetOptions.js";
import type ItemIn from "../../types/ItemIn.js";

export default class Spell extends GameObject implements ISpell, IRendersMessage {
  readonly WidgetTypes: WidgetType[] = [WidgetType.Spell];
  readonly Type: RefType.Spell = RefType.Spell;
  "Casting cost"?: string | number | undefined;
  Name: string;
  Description: string;
  Attacks?: DamageInfo[] | undefined;
  constructor(id: string, data: ISpell, name: string = id) {
    super(id, id, data.Description);
    this.Name = name;
    this["Casting cost"] = data["Casting cost"]?.toString();
    this.Description = data.Description;
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
  toMessage<T extends ItemIn<this["WidgetTypes"]>>(type: T, ephemeral?: boolean): WidgetOptions<InteractionReplyOptions> {
    const message = {
      embeds: [this.toEmbed()],
      ephemeral
    };
    if (this.Attacks) {
      this.Attacks.forEach(attack => message.embeds.push(attack.toEmbed()));
    }
    return message;
  }
  override toEmbed() {
    const embed = super.toEmbed();
    if (this["Casting cost"]) {
      embed.addFields({
        name: "Casting cost",
        value: this["Casting cost"].toString(),
        inline: true
      });
    }
    return embed;
  }
}
