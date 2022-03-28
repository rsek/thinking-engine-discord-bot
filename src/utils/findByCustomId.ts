import { ActionRow, MessageActionRowComponent, ModalActionRowComponent } from "discord.js";

export default function findByCustomId<T extends MessageActionRowComponent | ModalActionRowComponent>(components: ActionRow<T>[], customId: string): T | undefined {
  return components.find(row => row.components.some(item => item.customId === customId))?.components.find(item => item.customId === customId);
}