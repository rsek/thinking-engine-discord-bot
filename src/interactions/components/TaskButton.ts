import "reflect-metadata";

import { ButtonInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { routeTask } from "../../modules/parseComponent/BotTask.js";
import { unpackParams } from "../../modules/parseComponent/packParams.js";

@Discord()
export abstract class TaskButton {
  @ButtonComponent(/.*/)
  async taskButton(interaction: ButtonInteraction) {
    const params = unpackParams(interaction.customId);
    return routeTask(params, interaction);
  }
}