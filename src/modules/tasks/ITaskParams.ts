import type IGameData from "../../data/interfaces/IGameData";
import type KeyOfMap from "../../types/KeyOfMap.js";
import type DiceExpression from "../rolls/diceExpression.js";
import type { TaskParamsBase } from "./BotTask.js";
import type { RefType, WidgetType } from "../widgets/WidgetType.js";

export interface IEditAttrTaskParams extends TaskParamsBase {
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

export interface IEditTextTaskParams extends TaskParamsBase {
  type: EditTextType;
}
export interface IRefTaskParams extends TaskParamsBase {
  type: RefType;
  id: KeyOfMap<IGameData[this["type"]]>;
  ephemeral?: boolean | undefined;
}

export interface IRollDamageTaskParams extends TaskParamsBase {
  id: KeyOfMap<IGameData[RefType.DamageTable]>;
  bonus?: number;
  armour?: number;
}

export interface IRollTableTaskParams extends TaskParamsBase {
  id: KeyOfMap<IGameData[RefType.Table]>;
}

export interface IRollUnderTaskParams extends TaskParamsBase {

  /**
   * The target number.
   *
   * @type {number}
   * @memberof IRollUnderTaskParams
   */
  target: number;
}

export interface IRollVersusTaskParams extends TaskParamsBase {
  char1: string;
  char2: string;
  bonus1: number;
  bonus2: number;
}

export enum ManageMessageAction {
  Delete,
  Reveal
}

export interface IManageMessageTaskParams extends TaskParamsBase {
  action: ManageMessageAction;
}

export enum InitiativeAction {
  Draw,
  Shuffle
}

export interface IInitiativeTokenTaskParams extends TaskParamsBase {
  action: InitiativeAction
}

export interface IRebuildParams extends TaskParamsBase {
  embed?: WidgetType
}

export interface IRollDiceTaskParams extends TaskParamsBase {
  dice: DiceExpression
}

export interface IRollPlaceValuesTaskParams extends TaskParamsBase {
  dieType: number
}