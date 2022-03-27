import "reflect-metadata";

import { ButtonInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { routeTask } from "../../modules/parseComponent/BotTask.js";
import { unpackParams } from "../../modules/parseComponent/packParams.js";

@Discord()
export abstract class TaskButton {
  @ButtonComponent(new RegExp(/./))
  async taskButton(interaction: ButtonInteraction) {
    console.log("received interaction", interaction);
    const params = unpackParams(interaction.customId);
    return routeTask(params, interaction);
  }
}