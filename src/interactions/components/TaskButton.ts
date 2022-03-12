import "reflect-metadata";

import { ButtonInteraction } from "discord.js";
import { Button, Discord } from "discordx";
import _ from "lodash";
import { routeTask } from "../../modules/parseComponent/BotTask.js";
import { unpackParams } from "../../modules/parseComponent/packParams.js";

console.log("starting TaskButton");

@Discord()
export default abstract class TaskButton {
  @Button(/.*/)
  async taskButton(interaction: ButtonInteraction) {
    const params = unpackParams(interaction.customId);
    console.log("Button Interaction:", params);
    return routeTask(params, interaction);
  }
}