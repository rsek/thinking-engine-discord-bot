import "reflect-metadata";
import { ModalSubmitInteraction } from "discord.js";
import { Discord, ModalComponent } from "discordx";
import submitModal from "../tasks/handleModal.js";

@Discord()
export abstract class TaskModal {
  @ModalComponent(new RegExp(/./))
  async taskModal (interaction: ModalSubmitInteraction) {
    console.log("received interaction", interaction);
    return submitModal(interaction);
  }
}