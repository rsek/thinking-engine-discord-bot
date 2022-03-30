import type { IEditAttrTaskParams, IEditTextTaskParams, IInitiativeTokenTaskParams, IManageMessageTaskParams, IRefTaskParams, IRollDamageTaskParams, IRollDiceTaskParams, IRollPlaceValuesTaskParams, IRollTableTaskParams, IRollUnderTaskParams, IRollVersusTaskParams } from "./ITaskParams.js";

export enum BotTask {
  EditAttribute = "editAttr",
  EditText = "editTxt",
  ManageMessage = "manageMsg",
  Reference = "ref",
  RollDamage = "rollDmg",
  RollTable = "rollTbl",
  RollUnder = "rollUnder",
  RollVersus = "rollVs",
  RollDice = "roll",
  Initiative = "init",
  RollPlaceValues = "rollPV"
}

export type TaskParamsBase = Record<string,(number|boolean|string|undefined)>;

export interface IBotTasksParams extends Record<BotTask, TaskParamsBase> {
  [BotTask.EditAttribute]: IEditAttrTaskParams;
  [BotTask.EditText]: IEditTextTaskParams;
  [BotTask.ManageMessage]: IManageMessageTaskParams;
  [BotTask.Reference]: IRefTaskParams;
  [BotTask.RollDamage]: IRollDamageTaskParams;
  [BotTask.RollTable]: IRollTableTaskParams;
  [BotTask.RollUnder]: IRollUnderTaskParams;
  [BotTask.RollVersus]: IRollVersusTaskParams;
  [BotTask.Initiative]: IInitiativeTokenTaskParams
  [BotTask.RollDice]: IRollDiceTaskParams;
  [BotTask.RollPlaceValues]: IRollPlaceValuesTaskParams;
}


