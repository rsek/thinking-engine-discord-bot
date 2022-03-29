import type { ActionRow, MessageActionRowComponent, ModalActionRowComponent } from "discord.js";
// import findIndicesByCustomId from "./findIndicesByCustomId.js";

/**
 * Replace a component in a row by its customId
 * @param {ActionRow<MessageActionRowComponent | ModalActionRowComponent>[]} components - The array of
 * action rows that you want to replace the component in.
 * @param {string} customId - The customId of the component you want to replace.
 * @param {MessageActionRowComponent} newComponent - The new component that will replace the old one.
 * @returns The components array with the replaced component.
 */
export default function replaceByCustomId(components: ActionRow<MessageActionRowComponent | ModalActionRowComponent>[], customId: string, newComponent: MessageActionRowComponent) {
  // const indices = findIndicesByCustomId(components, customId);
  // components[indices.rowIndex].components.splice(indices.componentIndex, 1, newComponent);
  // return components;
  return components.map(actionRow => {
    if (actionRow.components.some(item => item.customId === customId)) {
      actionRow.components.map(item => {
        if (item.customId === customId) {
          item = newComponent;
        }
        return item;
      });
    }
    return actionRow;
  });
}