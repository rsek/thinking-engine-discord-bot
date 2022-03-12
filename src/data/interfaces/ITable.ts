/* eslint-disable require-jsdoc */
import { Collection } from "discord.js";
import _ from "lodash";
import DiceExpression from "../../modules/rolls/diceExpression.js";
import IGameDataBase from "./IGameDataBase.js";

export default interface ITable extends IGameDataBase {
  Roll?: DiceExpression | undefined;
  Table: Record<number, string> | string[] | Collection<number, string>;
}

// make it optional and have it infer roll type?
// leave row content as something to be commented - making it just an array of strings?

export enum TableType {
  d6 = "d6",
  d36 = "d36",
  d66 = "d66",
  d666 = "d666",
}

export enum TableRowCount {
  d6 = 6,
  d36 = 18,
  d66 = 36,
  d666 = 216,
}

export function allOrderedPairs<T>(arr1: Array<T>, arr2: Array<T>): [T,T][] {
  return arr1.map(item1 => arr2.map(item2 => [ item1, item2 ] as [T,T])).flat(1);
}

export function getValueRollTableRange(dieType: number) {
  const digits = dieType
    .toString()
    .split("")
    .map(Number);
  const digitRanges = digits.map(digit => _.range(1, digit));
  let currentColumn = digitRanges[0];
  const otherColumns = digitRanges.slice(1);
  if (otherColumns.length > 0) {
    for (let i = 0; i < otherColumns.length; i++) {
      const colToCombine = otherColumns[i];
      currentColumn = allOrderedPairs(currentColumn,colToCombine).map(pair => Number(pair.join("")));
    }
  }
  return currentColumn;
}