import type { ActionRow, MessageActionRowComponent, ModalActionRowComponent } from "discord.js";

// looks for a component with a matching Id; if it's present, returns the index of the component's row container, and the com
export default function findIndicesByCustomId(components: ActionRow<MessageActionRowComponent | ModalActionRowComponent>[], customId: string): { rowIndex: number; componentIndex: number; } {
  let rowIndex = -1;
  let componentIndex = -1;
  for (let i = 0; i < components.length; i++) {
    const row = components[i];
    const targetIndex = row.components.findIndex(item => item.customId === customId);
    if (targetIndex !== -1) {
      rowIndex = i;
      componentIndex = targetIndex;
    }
    if (rowIndex !== -1) {
      break;
    }
  }
  return {
    rowIndex,
    componentIndex
  };
}