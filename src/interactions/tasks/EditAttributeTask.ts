import { ActionRowBuilder, TextInputBuilder } from "@discordjs/builders";
import { APIMessage } from "discord-api-types/v10";
import { InteractionUpdateOptions } from "discord.js";
import { ButtonBuilder, ButtonStyle, Embed, InteractionType, MessageComponentInteraction, ModalSubmitInteraction, SelectMenuOptionBuilder, TextInputStyle, GuildCacheMessage, ModalMessageModalSubmitInteraction, ModalBuilder } from "discord.js";
import { IRendersMessage } from "../../modules/attributes/IRenders.js";
import NumericAttribute from "../../modules/attributes/NumericAttribute.js";
import IHasAttributes from "../../modules/initiative/IHasAttributes.js";
import { BotTask } from "../../modules/parseComponent/BotTask.js";
import { IEditAttrTaskParams } from "../../modules/parseComponent/ITaskParams.js";
import { packParams } from "../../modules/parseComponent/packParams.js";
import submitModal from "./handleModal.js";
import parseWidget from "./parseWidget.js";

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
    // console.log("[Task.editAttribute]", params);
    const interaction = interactionData as typeof interactionData & { message: GuildCacheMessage<"cached"> & {embeds: Embed[]} };
    switch (interaction.type) {
      case InteractionType.MessageComponent: {
        // console.log("[Task.editAttribute] interaction is MessageComponent");
        if (!params.id) {
          return EditAttributeTask.promptForId(interaction as MessageComponentInteraction, params);
        }
        break;
      }
      case InteractionType.ModalSubmit: {
        // console.log("[Task.editAttribute] interaction is ModalSubmit");
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
    const widget = parseWidget(interaction.message as APIMessage) as IRendersMessage & IHasAttributes;
    if (!widget.attributes[params.id]) {
      widget.attributes[params.id] = new NumericAttribute(params.id, params.current ?? params.max ?? 0, params.max);
    } else {
      if (params.max) {
        widget.attributes[params.id].max += params.max;
      }
      if (params.current) {
        widget.attributes[params.id].current += params.current;
      }
      if (widget.attributes[params.id].current > widget.attributes[params.id].max) {
        widget.attributes[params.id].current = widget.attributes[params.id].max;
      }
    }
    return interaction.update(widget.toMessage() as InteractionUpdateOptions);
  }
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
}