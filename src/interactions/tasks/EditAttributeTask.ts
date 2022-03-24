import { ActionRowBuilder, TextInputBuilder } from "@discordjs/builders";
import { APIEmbed,APIMessage } from "discord-api-types/v10";
import { ButtonBuilder, ButtonStyle, Embed, InteractionType, MessageComponentInteraction, ModalSubmitInteraction, SelectMenuOptionBuilder, TextInputStyle, GuildCacheMessage, ModalMessageModalSubmitInteraction, ModalBuilder } from "discord.js";
import NumericAttribute from "../../modules/attributes/NumericAttribute.js";
import { BotTask } from "../../modules/parseComponent/BotTask.js";
import { IEditAttrTaskParams } from "../../modules/parseComponent/ITaskParams.js";
import { packParams } from "../../modules/parseComponent/packParams.js";
import { WidgetType } from "../../modules/parseComponent/WidgetType.js";
import { firstEmbedOfType, firstEmbedOfTypeIndex } from "../../modules/ux/firstEmbedOfType.js";
import WithRequired from "../../types/WithRequired.js";
import submitModal from "./handleModal.js";

import rebuildWidget from "./rebuildWidget.js";

type CreateType = typeof SelectMenuOptionBuilder | typeof ButtonBuilder;

export default abstract class EditAttributeTask {
  static create<T extends CreateType>(type: T, params: IEditAttrTaskParams, label: string) {
    const taskParamsString = packParams(BotTask.EditAttribute, params);
    switch (type) {
      case ButtonBuilder:
        return new ButtonBuilder()
          .setCustomId(taskParamsString)
          .setLabel(label)
          .setStyle(ButtonStyle.Secondary);
        break;
      case SelectMenuOptionBuilder:
        return new SelectMenuOptionBuilder()
          .setValue(taskParamsString)
          .setDefault(false)
          .setLabel(label);
        break;
      default:
        break;
    }
  }
  static async exec(interactionData: MessageComponentInteraction | ModalMessageModalSubmitInteraction, params: IEditAttrTaskParams) {
    console.log("[Task.editAttribute]", params);
    // TODO: this is a kluge to work around the fact that the current development version of discord.js doesn't have a message key for component interactions (!)
    // TODO: above isn't actually true, i just didn't find the correct type. def needs a review though
    const interaction = interactionData as typeof interactionData & { message: GuildCacheMessage<"cached"> & {embeds: Embed[]} };
    switch (interaction.type) {
      case InteractionType.MessageComponent: {
        console.log("[Task.editAttribute] interaction is MessageComponent");
        if (!params.id) {
          return EditAttributeTask.promptForId(interaction as MessageComponentInteraction, params);
        }
        break;
      }
      case InteractionType.ModalSubmit: {
        console.log("[Task.editAttribute] interaction is ModalSubmit");
        if (!params.id) {
          await interaction.deferUpdate();
          return submitModal(interaction as ModalSubmitInteraction);
        }
        break;
      }
      default:
        throw new Error();
        break;
    }

    // TODO: this is just set so i get it online; should be replaced ASAP
    const oldEmbeds = interaction.message.embeds as (APIEmbed & Embed)[];
    const oldEmbed = firstEmbedOfType(WidgetType.InitiativeStack, oldEmbeds);
    const oldEmbedIndex = firstEmbedOfTypeIndex(WidgetType.InitiativeStack, oldEmbeds);
    if (!oldEmbed) {
      throw new Error();
    }
    // another quick fix
    params.add = true;
    const newEmbed = NumericAttribute.incrementByName(oldEmbed, params as WithRequired<IEditAttrTaskParams, "id">);
    console.log(newEmbed.fields);
    interaction.message.embeds[oldEmbedIndex] = newEmbed as Embed;
    return interaction.update(rebuildWidget(interaction.message as APIMessage));
  }
  static async promptForId(interaction: MessageComponentInteraction, params: IEditAttrTaskParams) {
    console.log("[promptForId] no ID specified, prompting user with a modal");
    const modal = new ModalBuilder()
      .setCustomId(packParams(BotTask.EditAttribute, params))
      .setTitle("Add New Player Character")
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>()
          .addComponents(
            new TextInputBuilder()
              .setCustomId("id")
              .setLabel("Please enter a name.")
              .setRequired(true)
              .setStyle(TextInputStyle.Short)
              .setMinLength(1)
            // TODO: get a maximum programmatically?
              .setMaxLength(50)
          )
      )
      ;
    console.log(modal);
    return interaction.showModal(modal);
  }
}