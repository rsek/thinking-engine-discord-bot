import { ActionRow } from "@discordjs/builders";
import { Modal, SelectMenuOption, TextInputComponent } from "discord.js";

export default function emptyInventorySlotMenuOption(slotNumber: number) {
  return new SelectMenuOption()
    .setLabel(`${slotNumber}. [Empty]`)
    .setDescription("Select this slot to add an item to it.")
    .setDefault(false)
    .setEmoji({ name: "➕" })
    .setValue("") // TODO: work out the json options for this
  ;
}

