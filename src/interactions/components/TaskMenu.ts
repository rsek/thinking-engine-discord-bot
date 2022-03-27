import "reflect-metadata";
import { SelectMenuInteraction } from "discord.js";
import { Discord, SelectMenuComponent } from "discordx";
import { routeTask } from "../../modules/parseComponent/BotTask.js";
import { unpackParams } from "../../modules/parseComponent/packParams.js";

export const taskMenuIdPrefix = "taskMenu";
/**
 * Handler for task menus: menus where a single option is selected to perform a task.
 *
 * @export
 * @abstract
 * @class TaskMenu
 */
@Discord()
export abstract class TaskMenu {
  @SelectMenuComponent(new RegExp(`^${taskMenuIdPrefix}`))
  async taskMenu(interaction: SelectMenuInteraction) {
    console.log("received interaction", interaction);
    const value = interaction.values[0];
    const params = unpackParams(value);
    return routeTask(params, interaction);
  }
}

