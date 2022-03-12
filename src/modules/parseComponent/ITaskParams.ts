import GameData from "../../data/GameData.js";
import KeyOfMap from "../../types/KeyOfMap.js";
import DiceExpression from "../rolls/diceExpression.js";
import { TaskParams } from "./BotTask.js";
import { WidgetType, RefType } from "./WidgetType.js";

export interface IEditAttrTaskParams extends TaskParams {
  id?: string; // field's name
  current: number | undefined;
  max?: number | undefined;
  add?: boolean | undefined;
  embed: WidgetType;
}

export enum EditTextType {
  Title,
  Author,
  Description,
  Footer
}

export interface IEditTextTaskParams extends TaskParams {
  type: EditTextType;
}
export interface IRefTaskParams extends TaskParams {
  type: RefType;
  id: KeyOfMap<typeof GameData[this["type"]]>;
  ephemeral?: boolean | undefined;
}

export interface IRollDamageTaskParams extends TaskParams {
  id: KeyOfMap<typeof GameData[RefType.DamageTable]>;
  bonus?: number;
  armour?: number;
}

export interface IRollTableTaskParams extends TaskParams {
  id: KeyOfMap<typeof GameData[RefType.Table]>;
}

export interface IRollUnderTaskParams extends TaskParams {

  /**
   * The target number.
   *
   * @type {number}
   * @memberof IRollUnderTaskParams
   */
  target: number;
}

export interface IRollVersusTaskParams extends TaskParams {
  char1: string;
  char2: string;
  bonus1: number;
  bonus2: number;
}

export enum ManageMessageAction {
  Delete,
  Reveal
}

export interface IManageMessageTaskParams extends TaskParams {
  action: ManageMessageAction;
}

export enum TokenStackAction {
  Draw,
  Shuffle
}

export interface IInitiativeTokenTaskParams extends TaskParams {
  action: TokenStackAction
}

export interface IRebuildParams extends TaskParams {
  embed?: WidgetType
}

export interface IRollDiceTaskParams extends TaskParams {
  dice: DiceExpression
}

export interface IRollPlaceValuesTaskParams extends TaskParams {
  dieType: number
}