import { InteractionReplyOptions } from "discord.js";
import GameObject from "../modules/inventory/GameObject.js";
import WidgetOptions from "../modules/initiative/WidgetOptions.js";
import ItemIn from "../types/ItemIn.js";
import IBackground from "./IBackground.js";


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
