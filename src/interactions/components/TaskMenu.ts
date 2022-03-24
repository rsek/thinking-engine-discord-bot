import "reflect-metadata";
import { SelectMenuInteraction } from "discord.js";
import { Discord, SelectMenuComponent } from "discordx";
import _ from "lodash";
import { routeTask } from "../../modules/parseComponent/BotTask.js";
import { unpackParams } from "../../modules/parseComponent/packParams.js";

export const taskMenuIdPrefix = "taskMenu";
console.log("starting TaskMenu");
/**
 * Handler for task menus: menus where a single option is selected to perform a task.
 *
 * @export
 * @abstract
 * @class TaskMenu
 */
@Discord()
export abstract class TaskMenu {
  @SelectMenuComponent(new RegExp(`^${taskMenuIdPrefix}.*$`))
  async taskMenu(interaction: SelectMenuInteraction) {
    const value = interaction.values[0];
    const params = unpackParams(value);
    console.log("Interaction:", interaction.customId, params);
    return routeTask(params, interaction);
  }
}

