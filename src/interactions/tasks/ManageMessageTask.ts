import "reflect-metadata";
import { InteractionReplyOptions, ButtonComponent, ButtonStyle, ActionRow, MessageComponentInteraction, GuildCacheMessage, CacheType, MessageActionRowComponent, Message } from "discord.js";
import deleteByCustomId from "../../modules/ux/removeByCustomId.js";
import { BotTask } from "../../modules/parseComponent/BotTask.js";
import { packParams } from "../../modules/parseComponent/packParams.js";
import { asEphemeral, stripEphemeral } from "../../modules/attributes/toEphemeral.js";
import { IManageMessageTaskParams, ManageMessageAction } from "../../modules/parseComponent/ITaskParams.js";
import assignToActionRow from "../../modules/attributes/assignToActionRow.js";

export default abstract class ManageMessageTask {
  static createButton(action: ManageMessageAction) {
    const customId = packParams(BotTask.ManageMessage, { action });
    const btn = new ButtonComponent().setCustomId(customId);

    switch (action) {
      case ManageMessageAction.Reveal:
        btn.setLabel("Reveal to channel")
          .setEmoji({ name: "👁" })
          .setStyle(ButtonStyle.Secondary);
        break;
      case ManageMessageAction.Delete:
        btn.setLabel("Dismiss message")
          .setEmoji({ name: "❌" })
          .setStyle(ButtonStyle.Secondary);
        break;
      default:
        throw new Error();
        break;
    }
    return btn;
  }
  static asRevealable<T extends GuildCacheMessage<CacheType>>(message: T) {
    const newMessage = asEphemeral(message);
    if (!newMessage.components) {
      newMessage.components = [];
    }
    newMessage.components = newMessage.components as ActionRow<MessageActionRowComponent>[];
    if (newMessage.components) {
      newMessage.components = assignToActionRow(newMessage.components, ManageMessageTask.createButton(ManageMessageAction.Reveal));
    }
    return newMessage;
  }
  static async exec(interaction: MessageComponentInteraction, params: IManageMessageTaskParams) {
    const msg = interaction.message as Message;
    switch (params.action) {
      case ManageMessageAction.Delete:
        if (msg.deletable) {
          return msg.delete();
        } else {
          throw new Error("Message is not deletable.");
        }
        break;
      case ManageMessageAction.Reveal:
        // TODO: fix stripEphemeral
        return interaction.reply({
          embeds: msg.embeds,
          components: [new ActionRow().addComponents(ManageMessageTask.createButton(ManageMessageAction.Delete))]
        });
        break;
      default:
        break;
    }

    // const message = stripEphemeral(interaction.message);
    // message.components = deleteByCustomId(message.components as ActionRow[], revealParams);
    // await interaction.reply(message as Omit<InteractionReplyOptions, "attachments">);
    // const msg = interaction.message as Message;
    // await msg.delete();
  }
}