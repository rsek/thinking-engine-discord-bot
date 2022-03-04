import { ButtonInteraction, InteractionReplyOptions, MessageActionRow, MessageButton } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import "reflect-metadata";
import deleteByCustomId from "../../functions/deleteByCustomId.js";

const revealMessageButton = new MessageButton()
  .setLabel("Reveal to channel")
  .setEmoji("👁")
  .setStyle("SECONDARY")
  .setCustomId("reveal-message");

export default revealMessageButton;

@Discord()
export abstract class RevealMessageButton {
  @ButtonComponent("reveal-message")
  async revealMessage(interaction: ButtonInteraction) {
    const message = interaction.message as Omit<InteractionReplyOptions, "attachments">;
    message.components = deleteByCustomId(interaction.message.components as MessageActionRow[],"reveal-message");
    // TODO: consider adding 'dismiss' button?
    message.ephemeral = false;
    await interaction.reply(message);
  }
}