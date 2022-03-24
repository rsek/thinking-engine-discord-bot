import "reflect-metadata";
import { ModalSubmitInteraction } from "discord.js";
import { Discord, ModalComponent } from "discordx";
import _ from "lodash";
import submitModal from "../tasks/handleModal.js";

console.log("starting TaskModal");

@Discord()
export abstract class TaskModal {
  @ModalComponent(/.*/)
  async taskModal (interaction: ModalSubmitInteraction) {
    return submitModal(interaction);
  }
}