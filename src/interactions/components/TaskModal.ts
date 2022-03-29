// // not currently in use - see Bot.ts
// import { ModalSubmitInteraction } from "discord.js";
// import { Discord, ModalComponent } from "discordx";
// import { routeTask } from "../../modules/tasks/routeTask.js";
// import unpackSubmittedModal from "../../modules/tasks/unpackSubmittedModal.js";

// const modalPattern = new RegExp(/./);

// @Discord()
// export abstract class TaskModal {
//   @ModalComponent(modalPattern)
//   async taskModal (interaction: ModalSubmitInteraction) {
//     const newParams = unpackSubmittedModal(interaction);
//     return routeTask(newParams, interaction);
//   }
// }