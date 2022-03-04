import { MessageActionRow, MessageComponent } from "discord.js";
import findIndicesByCustomId from "./findIndicesByCustomId.js";

export default function findByCustomId(components: MessageActionRow[], customId: string): MessageComponent | undefined {
  const indices = findIndicesByCustomId(components, customId);
  if (Object.values(indices).every(index => index == -1)) {
    return undefined;
  }
  return components[indices.rowIndex].components[indices.componentIndex];
}