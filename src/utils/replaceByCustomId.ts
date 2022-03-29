import type { ActionRow, MessageActionRowComponent, ModalActionRowComponent } from "discord.js";
// import findIndicesByCustomId from "./findIndicesByCustomId.js";

export default function replaceByCustomId(components: ActionRow<MessageActionRowComponent | ModalActionRowComponent>[], customId: string, newComponent: MessageActionRowComponent) {
  // const indices = findIndicesByCustomId(components, customId);
  // components[indices.rowIndex].components.splice(indices.componentIndex, 1, newComponent);
  // return components;
  return components.map(row => {
    if (row.components.some(item => item.customId === customId)) {
      row.components.map(item => {
        if (item.customId === customId) {
          item = newComponent;
        }
        return item;
      });
    }
    return row;
  });
}