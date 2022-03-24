import { ModalSubmitInteraction } from "discord.js";
import _ from "lodash";
import { routeTask } from "../../modules/parseComponent/BotTask.js";
import { unpackParams } from "../../modules/parseComponent/packParams.js";


export default async function submitModal(interaction: ModalSubmitInteraction) {
  const taskParams = unpackParams(interaction.customId);
  console.log("Modal submit interaction:", taskParams);
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