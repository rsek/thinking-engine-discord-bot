/* eslint-disable require-jsdoc */
import { Collection } from "discord.js";
import _ from "lodash-es";
import type IGameDataBase from "./IGameObjectBase.js";
import DiceExpression from "../../modules/rolls/diceExpression.js";
import type TableDieType from "../../modules/tables/TableDieType.js";

// TODO: extend Collection to a Table class
// TODO: use paging mechanism for table display?

export default interface ITableYaml extends IGameDataBase {
  Dice: keyof typeof TableDieType;
  Table: Record<number, string>;
}

// make it optional and have it infer roll type?
// leave row content as something to be commented - making it just an array of strings?
