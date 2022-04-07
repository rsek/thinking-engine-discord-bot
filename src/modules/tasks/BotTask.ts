import type { IEditAttrTaskParams, IEditTextTaskParams, IInitiativeTokenTaskParams, IManageMessageTaskParams, IRefTaskParams, IRollDamageTaskParams, IRollDiceTaskParams, IRollPlaceValuesTaskParams, IRollTableTaskParams, IRollUnderTaskParams, IRollVersusTaskParams } from "./ITaskParams.js";

export enum BotTask {
  EditAttribute = "editAttr",
  EditText = "editTxt",
  Initiative = "init",
  ManageMessage = "manageMsg",
  Reference = "ref",
  RollDamage = "rollDmg",
  RollDice = "roll",
  RollPlaceValues = "rollPV",
  RollUnder = "rollUnder",
  RollVersus = "rollVs",
  RollTable = "rollTbl",
  Reroll = "reroll"
}



export type TaskParamsBase = Record<string,(number|boolean|string|undefined|number[]|string[])>;

export interface IBotTasksParams extends Record<BotTask, TaskParamsBase> {
  [BotTask.EditAttribute]: IEditAttrTaskParams;
  [BotTask.EditText]: IEditTextTaskParams;
  [BotTask.Initiative]: IInitiativeTokenTaskParams
  [BotTask.ManageMessage]: IManageMessageTaskParams;
  [BotTask.Reference]: IRefTaskParams;
  [BotTask.RollDamage]: IRollDamageTaskParams;
  [BotTask.RollDice]: IRollDiceTaskParams;
  [BotTask.RollPlaceValues]: IRollPlaceValuesTaskParams;
  [BotTask.RollUnder]: IRollUnderTaskParams;
  [BotTask.RollVersus]: IRollVersusTaskParams;
  [BotTask.RollTable]: IRollTableTaskParams;
}

export type BotTaskRoll = BotTask.RollDamage|
  BotTask.RollDice|
  BotTask.RollPlaceValues|
  BotTask.RollUnder|
  BotTask.RollVersus;
