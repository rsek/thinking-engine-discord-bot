import type { ModalSubmitInteraction } from "discord.js";
import _ from "lodash-es";
import { unpackTaskParams } from "./packTaskParams.js";

/**
 * Extracts task parameters object from a submitted modal.
 *
 * @export
 * @param {ModalSubmitInteraction} interaction
 * @return {*}
 */
export default function unpackSubmittedModal(interaction: ModalSubmitInteraction) {
  const taskParams = unpackTaskParams(interaction.customId);
  // console.log("Modal submit interaction:", taskParams);
  interaction.fields.fields.forEach((fieldData) => {
    _.forEach(taskParams, (tp) => {
      const newKey = fieldData.customId;
      if (tp) {
        tp[newKey as keyof typeof tp] = fieldData.value;
      }
    });
  });
  return taskParams;
  // return routeTask(taskParams, interaction);
}