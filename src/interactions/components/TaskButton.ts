// // not currently in use - see Bot.ts
// import { ButtonInteraction } from "discord.js";
// import { ButtonComponent, Discord } from "discordx";
// import { routeTask } from "../../modules/tasks/routeTask.js";
// import { unpackParams } from "../../modules/tasks/packParams.js";

// const buttonPattern = new RegExp(/./);

// @Discord()
// export abstract class TaskButton {
//   @ButtonComponent(buttonPattern)
//   async taskButton(interaction: ButtonInteraction) {
//     // console.log("received interaction", interaction);
//     const params = unpackParams(interaction.customId);
//     return routeTask(params, interaction);
//   }
// }