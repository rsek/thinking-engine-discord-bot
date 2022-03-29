
import { ActionRowBuilder, TextInputBuilder } from "@discordjs/builders";
import type { APIMessage } from "discord-api-types/v10";
import type { Embed, GuildCacheMessage, InteractionUpdateOptions, MessageComponentInteraction, ModalMessageModalSubmitInteraction, ModalSubmitInteraction } from "discord.js";
import { InteractionType, ModalBuilder, TextInputStyle } from "discord.js";
import type IHasAttributes from "../../modules/attributes/IHasAttributes.js";
import NumericAttribute from "../../modules/attributes/NumericAttribute.js";
import { BotTask } from "../../modules/tasks/BotTask.js";
import type { IEditAttrTaskParams } from "../../modules/tasks/ITaskParams.js";
import { packParams } from "../../modules/tasks/packParams.js";
import { routeTask } from "../../modules/tasks/routeTask.js";
import Task from "../../modules/tasks/Task.js";
import unpackSubmittedModal from "../../modules/tasks/unpackSubmittedModal.js";
import type { IRendersMessage } from "../../modules/widgets/IRenders.js";
import parseWidget from "../../modules/widgets/parseWidget.js";

export default class EditAttributeTask extends Task<MessageComponentInteraction | ModalMessageModalSubmitInteraction, IEditAttrTaskParams> {
  static async promptForId(interaction: MessageComponentInteraction, params: IEditAttrTaskParams) {
    // console.log("[promptForId] no ID specified, prompting user with a modal");
    const textInput =
        new TextInputBuilder()
          .setCustomId("id")
          .setLabel("Please enter a name.")
          .setRequired(true)
          .setStyle(TextInputStyle.Short)
          .setMinLength(1)
        // TODO: get a maximum programmatically?
        // might be a pain in the ass to compute, tbh - cause it has to work for any token/init task
          .setMaxLength(50);
    const actionRow = new ActionRowBuilder<TextInputBuilder>()
      .addComponents(textInput);
    const modal = new ModalBuilder()
      .setCustomId(packParams(BotTask.EditAttribute, params))
      .setTitle("Add New Player Character")
      .addComponents(actionRow.toJSON())
      ;
    // console.log("[promptForId]", modal);
    return interaction.showModal(modal);
  }
  run() {
    // console.log("[Task.editAttribute]", params);
    const interactionWithEmbed = this.interaction as typeof this.interaction & { message: GuildCacheMessage<"cached"> & { embeds: Embed[]} };
    switch (interactionWithEmbed.type) {
      case InteractionType.MessageComponent: {
        // console.log("[Task.editAttribute] this.interaction is MessageComponent");
        if (!this.params.id) {
          return EditAttributeTask.promptForId(interactionWithEmbed as MessageComponentInteraction, this.params);
        }
        break;
      }
      case InteractionType.ModalSubmit: {
        // console.log("[Task.editAttribute] this.interaction is ModalSubmit");
        if (!this.params.id) {
          // FIXME: move deferUpdate to routeTask?
          // await interaction2.deferUpdate();
          const newParams = unpackSubmittedModal(interactionWithEmbed as ModalSubmitInteraction);
          return routeTask(newParams, interactionWithEmbed, this.gameData);
        }
        break;
      }
      default:
        throw new Error();
        break;
    }
    const widget = parseWidget(interactionWithEmbed.message as APIMessage) as IRendersMessage & IHasAttributes;
    if (!widget.attributes[this.params.id]) {
      widget.attributes[this.params.id] = new NumericAttribute(this.params.id, this.params.current ?? this.params.max ?? 0, this.params.max);
    } else {
      if (this.params.max) {
        widget.attributes[this.params.id].max += this.params.max;
      }
      if (this.params.current) {
        widget.attributes[this.params.id].current += this.params.current;
      }
      if (widget.attributes[this.params.id].current > widget.attributes[this.params.id].max) {
        widget.attributes[this.params.id].current = widget.attributes[this.params.id].max;
      }
    }
    return interactionWithEmbed.update(widget.toMessage() as InteractionUpdateOptions);
  }
}