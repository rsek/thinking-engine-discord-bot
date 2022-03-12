import { APIMessage } from "discord-api-types/v10";
import { InteractionUpdateOptions, Message } from "discord.js";
import InitiativeStack from "../../modules/initiative/InitiativeStack.js";
import { WidgetType } from "../../modules/parseComponent/WidgetType.js";

/**
 * Attempts to rebuild a GameObject from its message output.
 * @param message The message to rebuild as a GameObject.
 * @returns The game object.
 */
export default function rebuildWidget(message: Message): Omit<InteractionUpdateOptions,"fetchReply"> {
  if (!message.embeds) {
    throw new RangeError();
  }
  const embed = message.embeds[0];
  if (!embed || !embed.author?.name) {
    throw new RangeError();
  }

  // lazy version: check the author of the first embed and assume the whole post is like that. should be fine for the mo
  // TODO: something that can scale a bit better
  const embedType = WidgetType[embed.author.name.split(":")[0].replace(" ", "") as keyof typeof WidgetType];
  switch (embedType) {
    case WidgetType.InitiativeStack:
      return {
        embeds: [
          InitiativeStack
            .fromEmbed(embed)
            .toEmbed()]
      };
      break;
    default:
      return message as Omit<typeof message, "attachments">;
  }
}