import type { ActionRow, MessageActionRowComponent, ModalActionRowComponent } from "discord.js";
/**
 * Find a component by its customId
 * @param {ActionRow<T>[]} components - The array of components to search through.
 * @param {string} customId - The custom ID of the component you want to find.
 * @returns The component that has the customId that matches the one passed in.
 */
export default function findByCustomId<T extends MessageActionRowComponent | ModalActionRowComponent>(components: ActionRow<T>[], customId: string): T | undefined {
  return components.find(row => row.components.some(item => item.customId === customId))?.components.find(item => item.customId === customId);
}