import "reflect-metadata";
import { ModalSubmitInteraction } from "discord.js";
import { Discord, ModalComponent } from "discordx";
import _ from "lodash";
import { routeTask } from "../../modules/parseComponent/BotTask.js";
import { unpackParams } from "../../modules/parseComponent/packParams.js";
console.log("starting TaskModal");
@Discord()
export default abstract class TaskModal {
  @ModalComponent(/.*/)
  async receiveModal(interaction: ModalSubmitInteraction) {
    return receiveSubmittedModal(interaction);
  }
}
/**
 * Handles submitted modal text by passing it as a parameter of the modal's task.
 *
 * @export
 * @param {ModalSubmitInteraction} interaction
 * @return {*}  {Promise<void>}
 */
export async function receiveSubmittedModal(interaction: ModalSubmitInteraction): Promise<void> {
  console.log("[receiveSubmittedModal]",interaction);
  const taskParams = unpackParams(interaction.customId);
  interaction.fields.fields.forEach((fieldData) => {
    _.forEach(taskParams, (tp) => {
      const newKey = fieldData.customId;
      if (tp) {
        tp[newKey as keyof typeof tp] = fieldData.value;
      }
    });
  });
  console.log("Modal submit interaction:", taskParams);
  return routeTask(taskParams, interaction);
}