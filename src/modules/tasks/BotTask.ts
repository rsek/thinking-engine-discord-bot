/* eslint-disable @typescript-eslint/require-await */
import { IEditAttrTaskParams, IEditTextTaskParams, IManageMessageTaskParams, IRefTaskParams, IRollDamageTaskParams, IRollTableTaskParams, IRollVersusTaskParams, IInitiativeTokenTaskParams, IRollDiceTaskParams, IRollPlaceValuesTaskParams } from "./ITaskParams.js";

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


