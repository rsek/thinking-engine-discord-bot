import { MessageActionRow, MessageActionRowComponent } from "discord.js";
import findIndicesByCustomId from "./findIndicesByCustomId.js";

export default function replaceByCustomId(components: MessageActionRow[], customId: string, newComponent: MessageActionRowComponent) {
  const indices = findIndicesByCustomId(components, customId);
  components[indices.rowIndex].spliceComponents(indices.componentIndex, 1, newComponent);
  return components;
}