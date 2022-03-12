import { Embed, ActionRow, MessageActionRowComponent, InteractionReplyOptions, InteractionUpdateOptions } from "discord.js";

export type InteractionMessageOptions = InteractionUpdateOptions | InteractionReplyOptions;

export default interface WidgetOptions<T extends InteractionUpdateOptions | InteractionReplyOptions = InteractionReplyOptions> extends Pick<InteractionMessageOptions, "embeds" | "components" | "content" > {
  embeds?: Embed[];
  components?: ActionRow<MessageActionRowComponent>[];
  content?: string;
  ephemeral?: T extends InteractionReplyOptions ? boolean : never;
}