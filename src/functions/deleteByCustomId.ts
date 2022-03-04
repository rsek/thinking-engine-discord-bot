import { MessageActionRow } from "discord.js";
import findIndicesByCustomId from "./findIndicesByCustomId.js";

export default function deleteByCustomId(components:  MessageActionRow[], customId: string) {
  const indices = findIndicesByCustomId(components, customId);
  components[indices.rowIndex].spliceComponents(indices.componentIndex, 1);
  return components;
}