import { ActionRow, ComponentType, MessageActionRowComponent, ModalActionRowComponent } from "discord.js";
import _ from "lodash";

type ActionRowComponent = ModalActionRowComponent|MessageActionRowComponent;

const actionRowSize = 5;
const maxRows = 5;

export function consumesSpacesInActionRow<T extends ActionRowComponent["type"]>(type: T) {
  let result: number;
  switch (type) {
    case ComponentType.Button:
      result = 1;
      break;
    case ComponentType.SelectMenu:
      result = 5;
      break;
    case ComponentType.TextInput:
      result = 5;
      break;
    default:
      throw new Error("Unknown");
      break;
  }
  return result;
}

export function spacesLeftForComponents(rows: ActionRow<ActionRowComponent>[]) {
  let counter = actionRowSize * maxRows;
  rows.forEach(row => counter -= spacesLeftInActionRow(row));
  return counter;
}

export function spacesLeftInActionRow(row: ActionRow<ActionRowComponent>) {
  const spacesUsed = _.sum(row.components.map(item => consumesSpacesInActionRow(item.type)));
  const spacesRemaining = actionRowSize - spacesUsed;
  return spacesRemaining;
}

export default function assignToActionRow<T extends ActionRowComponent>(rows: ActionRow<T>[], component: T) {
  let componentHasBeenAssigned = false;
  const spacesNeeded = consumesSpacesInActionRow(component.type);
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const spacesRemaining = spacesLeftInActionRow(row);
    if (spacesNeeded <= spacesRemaining) {
      row.addComponents(component);
      componentHasBeenAssigned = true;
      break;
    }
  }
  if (!componentHasBeenAssigned) {
    if (rows.length <= maxRows) {
      rows.push(new ActionRow<T>().addComponents(component));
    } else {
      throw new Error("No space left for this item in action rows!");
    }
  }
  return rows;
}