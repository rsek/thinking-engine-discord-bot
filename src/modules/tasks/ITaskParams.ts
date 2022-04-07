import type { BotTaskRoll, TaskParamsBase } from "./BotTask.js";
import type GameData from "../../data/GameData.js";
import type KeyOfMap from "../../types/KeyOfMap.js";
import type DiceExpression from "../rolls/diceExpression.js";
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
  id: KeyOfMap<GameData[this["type"]]>;
  ephemeral?: boolean | undefined;
}

export interface RollTaskParamsBase extends TaskParamsBase {
  isReroll?: boolean | undefined;
}

export interface IRollDamageTaskParams extends RollTaskParamsBase {
  id: KeyOfMap<GameData[RefType.DamageTable]>;
  mods?: number[] | undefined;
  armour?: number | undefined;
  shield?: number | undefined;
  mightyBlow?: boolean | undefined;
}

export interface IRollTableTaskParams extends TaskParamsBase {
  id: KeyOfMap<GameData[RefType.Table]>;
}

export interface IRollUnderTaskParams extends RollTaskParamsBase {
  target: number;
}

export interface IRollVersusTaskParams extends RollTaskParamsBase {
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

export interface IRollDiceTaskParams extends RollTaskParamsBase {
  dice: DiceExpression;
  mods?: number[] | undefined
}

export interface IRollPlaceValuesTaskParams extends RollTaskParamsBase {
  dieType: number
}

export interface IRerollParams<T extends BotTaskRoll> extends TaskParamsBase {
  type: T,
  // make conditional for certain values of P? only needs to exist for certain ones...
  // alternatively, the task could just, like, prompt ppl in that case? might not telegraph the ability to reroll them individually very well, tho.
  field?: string | undefined
}