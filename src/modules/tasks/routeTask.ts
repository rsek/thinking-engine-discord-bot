/* eslint-disable @typescript-eslint/require-await */
import type { CommandInteraction, Interaction, MessageComponentInteraction, ModalMessageModalSubmitInteraction } from "discord.js";
import _ from "lodash-es";
import EditAttributeTask from "../../interactions/tasks/EditAttributeTask.js";
import ReferenceTask from "../../interactions/tasks/ReferenceTask.js";
import ManageMessageTask from "../../interactions/tasks/ManageMessageTask.js";
import RollTableTask from "../../interactions/tasks/RollTableTask.js";
import type { IEditAttrTaskParams, IManageMessageTaskParams, IRefTaskParams, IRollTableTaskParams, IInitiativeTokenTaskParams } from "./ITaskParams.js";
import type { unpackParams } from "./packParams.js";
import InitiativeTask from "../../interactions/tasks/InitiativeTask.js";
import { BotTask } from "./BotTask.js";
import type GameData from "../../data/GameData.js";

/**
 * Routes interactions to the corresponding handler.
 *
 * @export
 * @param {ReturnType<typeof unpackParams>} tasksParams
 * @param {Interaction} interaction
 */
export async function routeTask(tasksParams: ReturnType<typeof unpackParams>, interaction: Interaction, gameData: GameData): Promise<void> {
  // console.log("[routeTask]", tasksParams);
  _.forEach(tasksParams, async (task, taskId) => {
    switch (taskId) {
      case BotTask.EditAttribute:
        return new EditAttributeTask(interaction as MessageComponentInteraction | ModalMessageModalSubmitInteraction, task as IEditAttrTaskParams, gameData).run();
        break;
      case BotTask.Initiative: {
        if (!interaction.isMessageComponent()) {
          throw new Error();
        }
        return new InitiativeTask(interaction, task as IInitiativeTokenTaskParams, gameData).run();
        break;
      }
      // case BotTask.EditText:
      //   break;
      case BotTask.ManageMessage:
        return new ManageMessageTask(interaction as MessageComponentInteraction, task as IManageMessageTaskParams, gameData).run();
        break;
      case BotTask.Reference:
        return new ReferenceTask(interaction as MessageComponentInteraction, task as IRefTaskParams, gameData).run();
        break;
      // case BotTask.RollDamage:
      //   break;
      case BotTask.RollTable:
        return new RollTableTask(interaction as MessageComponentInteraction | CommandInteraction, task as IRollTableTaskParams, gameData).run();
        break;
      // case BotTask.RollVersus:
      //   break;
      default:
        if (interaction.isRepliable()) {
          return interaction.reply({ content: "NYI", ephemeral: true });
        } else {
          throw new Error("Unable to route task.");
        }
    }
  });
}
