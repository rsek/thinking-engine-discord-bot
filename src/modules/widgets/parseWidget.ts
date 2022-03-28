import { APIMessage } from "discord-api-types/v10";
import { IRendersMessage } from "./IRenders.js";
import InitiativeStack from "../initiative/InitiativeStack.js";
import { WidgetType } from "./WidgetType.js";
import { parseEmbedType } from "../../utils/firstEmbedOfType.js";
/**
 * Attempts to parse a widget message back into its corresponding object.
 * @param message The message to parse into an object.
 * @returns The parsed object.
 */
export default function parseWidget(message: APIMessage): IRendersMessage {
  const embed = message.embeds[0];
  const widgetType = parseEmbedType(embed);
  if (!widgetType) {
    throw new RangeError("Unable to parse widget type from first embed.");
  }
  switch (widgetType) {
    case WidgetType.InitiativeStack:
      return InitiativeStack.fromEmbed(embed);
      break;
    default:
      throw new RangeError(`Widget parsing not implemented for type: ${WidgetType[widgetType]}`);
      break;
  }
}