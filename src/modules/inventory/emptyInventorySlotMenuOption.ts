import { SelectMenuOptionBuilder } from "discord.js";

export default function emptyInventorySlotMenuOption(slotNumber: number) {
  return new SelectMenuOptionBuilder()
    .setLabel(`${slotNumber}. [Empty]`)
    .setDescription("Select this slot to add an item to it.")
    .setDefault(false)
    .setEmoji({ name: "➕" })
    .setValue("") // TODO: work out the json options for this
  ;
}

