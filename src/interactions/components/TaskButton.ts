import "reflect-metadata";

import { ButtonInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import _ from "lodash";
import { routeTask } from "../../modules/parseComponent/BotTask.js";
import { unpackParams } from "../../modules/parseComponent/packParams.js";

console.log("starting TaskButton");

@Discord()
export abstract class TaskButton {
  @ButtonComponent(/.*/)
  async taskButton(interaction: ButtonInteraction) {
    const params = unpackParams(interaction.customId);
    console.log("Button Interaction:", params);
    return routeTask(params, interaction);
  }
}