
import type { MessageComponentInteraction, GuildCacheMessage, CacheType, Message, InteractionReplyOptions } from "discord.js";
import { ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
import { BotTask } from "../../modules/tasks/BotTask.js";
import { packParams } from "../../modules/tasks/packParams.js";
import { asEphemeral } from "../../modules/attributes/toEphemeral.js";
import type { IManageMessageTaskParams } from "../../modules/tasks/ITaskParams.js";
import { ManageMessageAction } from "../../modules/tasks/ITaskParams.js";
import { ActionRowBuilder } from "@discordjs/builders";
import type { APIActionRowComponent, APIMessageActionRowComponent } from "discord-api-types/v10";
import Task from "../../modules/tasks/Task.js";
import userErrorMessage from "../../modules/alerts/userErrorMessage.js";

export default class ManageMessageTask extends Task<MessageComponentInteraction<CacheType>,IManageMessageTaskParams> {
  static createButton(action: ManageMessageAction) {
    const customId = packParams(BotTask.ManageMessage, { action });
    const btn = new ButtonBuilder().setCustomId(customId);

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
    newMessage.components = newMessage.components as APIActionRowComponent<APIMessageActionRowComponent>[];
    if (newMessage.components) {
      for (let r = 0; r < newMessage.components.length; r++) {
        const row = newMessage.components[r];
        if (row.components.length > 5 && row.components.every(item => item.type === ComponentType.Button)) {
          const builder = new ActionRowBuilder<ButtonBuilder>(row).addComponents(ManageMessageTask.createButton(ManageMessageAction.Reveal));
          newMessage.components[r] = builder.toJSON();
          break;
        }
      }
      ManageMessageTask.createButton(ManageMessageAction.Reveal);
    }
    return newMessage;
  }
  run() {
    const msg = this.interaction.message as Message;
    switch (this.params.action) {
      case ManageMessageAction.Delete:
        if (msg.deletable) {
          return msg.delete();
        } else {
          throw new Error("Message is not deletable.");
        }
        break;
      case ManageMessageAction.Reveal: {
        const replyOptions: InteractionReplyOptions = {
          embeds: msg.embeds,
        };
        if (this.interaction.inGuild()) {
          replyOptions.components = [
            new ActionRowBuilder<ButtonBuilder>()
              .addComponents(
                ManageMessageTask.createButton(
                  ManageMessageAction.Delete
                )
              )
          ];
        }
        return this.interaction.reply(replyOptions);
        break;
      }
      default:
        return this.interaction.reply(userErrorMessage());
        break;
    }

    // const message = stripEphemeral(interaction.message);
    // await interaction.reply(message as Omit<InteractionReplyOptions, "attachments">);
    // const msg = interaction.message as Message;
    // await msg.delete();
  }
}