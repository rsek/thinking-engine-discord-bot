import { InteractionReplyOptions } from "discord.js";
import GameObject from "../inventory/GameObject.js";
import WidgetOptions from "../widgets/WidgetOptions.js";
import ItemIn from "../../types/ItemIn.js";
import IBackground from "../../data/interfaces/IBackground.js";


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
