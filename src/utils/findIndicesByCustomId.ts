import type { ActionRow, MessageActionRowComponent, ModalActionRowComponent } from "discord.js";

// looks for a component with a matching Id; if it's present, returns the index of the component's row container, and the com


/**
 * Find the index of the component with the given customId in the given array of components
 * @param {ActionRow<MessageActionRowComponent | ModalActionRowComponent>[]} components - The array of
 * action rows that you want to search.
 * @param {string} customId - The id of the component you want to find.
 * @returns An object with two properties: the index of the row, and the index of the component in the row.
 */
export default function findIndicesByCustomId(components: ActionRow<MessageActionRowComponent | ModalActionRowComponent>[], customId: string): { rowIndex: number; componentIndex: number; } {
  let actionRowIndex = -1;
  let componentIndex = -1;
  for (let i = 0; i < components.length; i++) {
    const row = components[i];
    const targetIndex = row.components.findIndex(item => item.customId === customId);
    if (targetIndex !== -1) {
      actionRowIndex = i;
      componentIndex = targetIndex;
    }
    if (actionRowIndex !== -1) {
      break;
    }
  }
  return {
    rowIndex: actionRowIndex,
    componentIndex
  };
}