import type { InteractionReplyOptions } from "discord.js";
import { Embed } from "discord.js";
import { titleCase } from "title-case";
import type IGameObject from "./IGameObject.js";
import type ItemIn from "../../types/ItemIn.js";
import buildWidgetStub from "../widgets/buildWidgetStub.js";
import { IRendersEmbed, IRendersMessage } from "../widgets/IRenders.js";
import type WidgetOptions from "../widgets/WidgetOptions.js";
import type { RefType } from "../widgets/WidgetType.js";
import { WidgetType } from "../widgets/WidgetType.js";

/**
 * Base class for static game data objects.
 */
export default abstract class GameObject implements IGameObject {
  readonly WidgetTypes: WidgetType[] = [];
  readonly Type!: RefType;
  $id: string;
  Name: string;
  Description?: string | undefined;
  constructor(id: string, name: string = id, description?: string | undefined) {
    this.$id = id;
    this.Name = name;
    this.Description = description;
  }
  abstract toMessage<T extends ItemIn<typeof this["WidgetTypes"]>>(type: T, ephemeral?: boolean): WidgetOptions<InteractionReplyOptions>;
  /**
   * Generates a stub embed to use in building embeds of descendent classes.
   * @param embedSubtype An optional subtype string to be appended to the widget type.
   * @returns An embed stub.
   */
  toEmbed(embedSubtype?: string | undefined) {
    const embed = buildWidgetStub(WidgetType[WidgetType[this.Type] as keyof typeof WidgetType], this.Name ?? this.$id, embedSubtype)
      .setDescription(this.Description ?? null)
    ;
    return embed;
  }
}