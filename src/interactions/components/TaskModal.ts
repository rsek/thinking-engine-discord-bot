import { ModalSubmitInteraction } from "discord.js";
import { Discord, ModalComponent } from "discordx";
import unpackSubmittedModal from "../../modules/tasks/unpackSubmittedModal.js";

const modalPattern = new RegExp(/./);

@Discord()
export abstract class TaskModal {
  @ModalComponent(modalPattern)
  async taskModal (interaction: ModalSubmitInteraction) {
    // console.log("received interaction", interaction);
    return unpackSubmittedModal(interaction);
  }
}