import { ButtonComponent, ButtonStyle, Embed, InteractionType, MessageComponentInteraction, Modal, ModalSubmitInteraction, ActionRow, SelectMenuOption, TextInputComponent, TextInputStyle, GuildCacheMessage, ModalMessageModalSubmitInteraction } from "discord.js";
import NumericAttribute from "../../modules/attributes/NumericAttribute.js";
import { BotTask } from "../../modules/parseComponent/BotTask.js";
import { IEditAttrTaskParams } from "../../modules/parseComponent/ITaskParams.js";
import { packParams } from "../../modules/parseComponent/packParams.js";
import { WidgetType } from "../../modules/parseComponent/WidgetType.js";
import { firstEmbedOfType, firstEmbedOfTypeIndex } from "../../modules/ux/firstEmbedOfType.js";
import WithRequired from "../../types/WithRequired.js";
import { receiveSubmittedModal } from "../components/TaskModal.js";
import rebuildWidget from "./rebuildWidget.js";

type CreateType = typeof SelectMenuOption | typeof ButtonComponent;

export default abstract class EditAttributeTask {
  static create<T extends CreateType>(type: T, params: IEditAttrTaskParams, label: string) {
    const taskParamsString = packParams(BotTask.EditAttribute, params);
    switch (type) {
      case ButtonComponent:
        return new ButtonComponent()
          .setCustomId(taskParamsString)
          .setLabel(label)
          .setStyle(ButtonStyle.Secondary);
        break;
      case SelectMenuOption:
        return new SelectMenuOption()
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
          return receiveSubmittedModal(interaction as ModalSubmitInteraction);
        }
        break;
      }
      default:
        throw new Error();
        break;
    }

    // TODO: this is just set so i get it online; should be replaced ASAP
    const oldEmbed = firstEmbedOfType(WidgetType.InitiativeStack, interaction.message.embeds as Embed[]);
    const oldEmbedIndex = firstEmbedOfTypeIndex(WidgetType.InitiativeStack, interaction.message.embeds as Embed[]);
    if (!oldEmbed) {
      throw new Error();
    }
    // another quick fix
    params.add = true;
    const newEmbed = NumericAttribute.incrementByName(oldEmbed, params as WithRequired<IEditAttrTaskParams, "id">);
    console.log(newEmbed.fields);
    interaction.message.embeds[oldEmbedIndex] = newEmbed as Embed;
    return interaction.update(rebuildWidget(interaction.message));
  }
  static async promptForId(interaction: MessageComponentInteraction, params: IEditAttrTaskParams) {
    console.log("[promptForId] no ID specified, prompting user with a modal");
    const modal = new Modal()
      .setCustomId(packParams(BotTask.EditAttribute, params))
      .setTitle("Add New Player Character")
      .addComponents(
        new ActionRow<TextInputComponent>()
          .addComponents(
            new TextInputComponent()
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