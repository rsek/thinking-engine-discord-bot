// // not currently in use: see bot.ts

// import { SelectMenuInteraction } from "discord.js";
// import { Discord, SelectMenuComponent } from "discordx";
// import { routeTask } from "../../modules/tasks/routeTask.js";
// import { unpackParams } from "../../modules/tasks/packParams.js";
// import { taskMenuIdPrefix } from "./taskMenuIdPrefix.js";

// const taskMenuPattern = new RegExp(`^${taskMenuIdPrefix}`);

// /**
//  * Handler for task menus: menus where a single option is selected to perform a task.
//  *
//  * @export
//  * @abstract
//  * @class TaskMenu
//  */
// @Discord()
// export abstract class TaskMenu {
//   @SelectMenuComponent(taskMenuPattern)
//   async taskMenu(interaction: SelectMenuInteraction) {
//     // console.log("received interaction", interaction);
//     const value = interaction.values[0];
//     const params = unpackParams(value);
//     return routeTask(params, interaction);
//   }
// }

