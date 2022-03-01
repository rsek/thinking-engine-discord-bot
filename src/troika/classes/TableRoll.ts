import _ from "lodash";
import { TypedRegEx } from "typed-regex";
import troikaDice from "../../types/troikaDice.js";
import troikaTableDice from "../../types/troikaTableDice.js";
import troikaTableDiceNotation from "../../types/troikaTableDiceNotation.js";
import Roll from "./Roll.js";

export interface ITableRollOptions {
  type: troikaTableDice;
  mods: number;
}

export default class TableRoll extends Roll {
  get result(): number {
    let numberString: string = this.map(item => item.valueOf()).join("");
    let number: number = Number(numberString);
    return number + this.mods;
  }
  constructor(options: ITableRollOptions|troikaTableDiceNotation)
  {
    let tableRollOptions: ITableRollOptions;
    if (typeof options == "string") {
      tableRollOptions = parseTableDice(options);
    } else {
      tableRollOptions = options;
    }
    let realSides = tableRollOptions.type.toString().split("").map(Number);
    if (uniqueItems(realSides).length > 1) {
      throw new Error();
    }
    super({
      quantity: realSides.length,
      sides: realSides[0] as troikaDice,
      mods: tableRollOptions.mods ?? 0
    });
  }
}

export function uniqueItems(arr: any[]) {
  return Array.from(new Set(arr));
}

const tableRollPattern = TypedRegEx("^d(?<type>[0-9]+)(?<mods>[\+\-][0-9]+)?$");

export function parseTableDice(notation: troikaTableDiceNotation): ITableRollOptions {
  let defaults = {
    mods: "0"
  }
  let subStrings = tableRollPattern.captures(notation);
  if (!subStrings) {
    throw new Error();
  }
  subStrings = Object.assign(defaults, subStrings);
  if (!subStrings.type) {
    throw new Error();
  }
  let result = _.mapValues( subStrings, (value,key) => {
    return Number(value);
  }
  ) as ITableRollOptions;
  if (!(result.type in troikaTableDice)) {
    throw new Error();
  }
  return result;
}