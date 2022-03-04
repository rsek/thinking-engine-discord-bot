import { ButtonInteraction, Message, MessageButton } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import "reflect-metadata";

const dismissMessageButton = new MessageButton()
  .setLabel("Dismiss message")
  .setEmoji("❌")
  .setStyle("SECONDARY")
  .setCustomId("dismiss-message");
export default dismissMessageButton;

@Discord()
export abstract class DismissMessageButton {
  @ButtonComponent("dismiss-message")
  async revealMessage(interaction: ButtonInteraction) {
    const msg = interaction.message as Message;
    await msg.delete();
  }
}