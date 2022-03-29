import type { InteractionReplyOptions } from "discord.js";
import type ItemIn from "../../types/ItemIn.js";
import type WidgetOptions from "../widgets/WidgetOptions.js";
import GameObject from "../inventory/GameObject.js";
import type ISkill from "./ISkill.js";

export default class Skill extends GameObject implements ISkill {
  $id: string;
  Name: string;
  Description?: string | undefined;
  constructor(id: string, data: ISkill) {
    super(id);
    this.$id = id;
    this.Name = data.Name;
    this.Description = data.Description;
  }
  toMessage<T extends ItemIn<this["WidgetTypes"]>>(type: T, ephemeral?: boolean): WidgetOptions<InteractionReplyOptions> {
    throw new Error("Method not implemented.");
  }
}