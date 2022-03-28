import { ModalSubmitInteraction } from "discord.js";
import _ from "lodash-es";
import { routeTask } from "./routeTask.js";
import { unpackParams } from "./packParams.js";


export default async function unpackSubmittedModal(interaction: ModalSubmitInteraction) {
  const taskParams = unpackParams(interaction.customId);
  // console.log("Modal submit interaction:", taskParams);
  interaction.fields.fields.forEach((fieldData) => {
    _.forEach(taskParams, (tp) => {
      const newKey = fieldData.customId;
      if (tp) {
        tp[newKey as keyof typeof tp] = fieldData.value;
      }
    });
  });
  return routeTask(taskParams, interaction);
}