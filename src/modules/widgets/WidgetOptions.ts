import type { ActionRowBuilder } from "@discordjs/builders";
import type { EmbedBuilder, InteractionReplyOptions, InteractionUpdateOptions, MessageActionRowComponentBuilder } from "discord.js";

export type InteractionMessageOptions = InteractionUpdateOptions | InteractionReplyOptions;

export default interface WidgetOptions<T extends InteractionUpdateOptions | InteractionReplyOptions = InteractionReplyOptions> extends Pick<InteractionMessageOptions, "embeds" | "components" | "content" > {
  embeds?: EmbedBuilder[];
  components?: ActionRowBuilder<MessageActionRowComponentBuilder>[];
  content?: string;
  ephemeral?: T extends InteractionReplyOptions ? boolean : never;
}