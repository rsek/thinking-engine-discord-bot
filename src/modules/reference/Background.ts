import type { InteractionReplyOptions } from "discord.js";
import type IBackground from "../../data/interfaces/IBackground.js";
import type ItemIn from "../../types/ItemIn.js";
import GameObject from "../inventory/GameObject.js";
import type WidgetOptions from "../widgets/WidgetOptions.js";


export default class Background extends GameObject implements IBackground {
  override Description: string;
  constructor(id: string, data: IBackground) {
    super(id, id);
    this.Description = data.Description;
  }
  toMessage<T extends ItemIn<this["WidgetTypes"]>>(type: T, ephemeral?: boolean): WidgetOptions<InteractionReplyOptions> {
    throw new Error("Method not implemented.");
  }
}
