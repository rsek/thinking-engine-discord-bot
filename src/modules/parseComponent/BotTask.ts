/* eslint-disable @typescript-eslint/require-await */
import { CommandInteraction, Interaction, MessageComponentInteraction, ModalMessageModalSubmitInteraction } from "discord.js";
import _ from "lodash";
import EditAttributeTask from "../../interactions/tasks/EditAttributeTask.js";
import ReferenceTask from "../../interactions/tasks/ReferenceTask.js";
import ManageMessageTask from "../../interactions/tasks/ManageMessageTask.js";
import RollTableTask from "../../interactions/tasks/RollTableTask.js";
import { IEditAttrTaskParams, IEditTextTaskParams, IManageMessageTaskParams, IRefTaskParams, IRollDamageTaskParams, IRollTableTaskParams, IRollVersusTaskParams, IInitiativeTokenTaskParams, IRollDiceTaskParams, IRollPlaceValuesTaskParams } from "./ITaskParams.js";
import { unpackParams } from "./packParams.js";
import InitiativeTask from "../../interactions/tasks/InitiativeTask.js";

export enum BotTask {
  EditAttribute = "editAttr",
  EditText = "editTxt",
  ManageMessage = "manageMsg",
  Reference = "ref",
  RollDamage = "rollDmg",
  RollTable = "rollTbl",
  RollVersus = "rollVs",
  RollDice = "roll",
  Initiative = "init",
  RollPlaceValues = "rollPV"
}

export type TaskParams = Record<string,(number|boolean|string|undefined)>;

export interface IBotTasksParams extends Record<BotTask, TaskParams> {
  [BotTask.EditAttribute]: IEditAttrTaskParams;
  [BotTask.EditText]: IEditTextTaskParams;
  [BotTask.ManageMessage]: IManageMessageTaskParams;
  [BotTask.Reference]: IRefTaskParams;
  [BotTask.RollDamage]: IRollDamageTaskParams;
  [BotTask.RollTable]: IRollTableTaskParams;
  [BotTask.RollVersus]: IRollVersusTaskParams;
  [BotTask.Initiative]: IInitiativeTokenTaskParams
  [BotTask.RollDice]: IRollDiceTaskParams;
  [BotTask.RollPlaceValues]: IRollPlaceValuesTaskParams;
}

/**
 * Routes interactions to the corresponding handler.
 *
 * @export
 * @param {ReturnType<typeof unpackParams>} tasksParams
 * @param {Interaction} interaction
 */
export async function routeTask(tasksParams: ReturnType<typeof unpackParams>, interaction: Interaction) {
  console.log("[routeTask]", tasksParams, interaction);
  _.forEach(tasksParams, async (task, taskId) => {
    switch (taskId) {
      case BotTask.EditAttribute:
        return EditAttributeTask.exec(interaction as MessageComponentInteraction | ModalMessageModalSubmitInteraction, task as IEditAttrTaskParams);
        break;
      case BotTask.Initiative: {
        if (!interaction.isMessageComponent()) {
          throw new Error();
        }
        await InitiativeTask.exec(interaction, task as IInitiativeTokenTaskParams);
        break;
      }
      // case BotTask.EditText:
      //   break;
      case BotTask.ManageMessage:
        return ManageMessageTask.exec(interaction as MessageComponentInteraction, task as IManageMessageTaskParams);
        break;
      case BotTask.Reference:
        return ReferenceTask.exec(interaction as MessageComponentInteraction, task as IRefTaskParams);
        break;
      // case BotTask.RollDamage:
      //   break;
      case BotTask.RollTable:
        return RollTableTask.exec(interaction as MessageComponentInteraction | CommandInteraction, task as IRollTableTaskParams);
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




