import { TypedRegEx } from "typed-regex";
import troikaDice from "../../types/troikaDice.js";
import troikaDiceNotation from "../../types/troikaDiceNotation.js";
import Die from "./Die.js";
import _ from "lodash-es";


export default class Roll extends Array<Die> {
  private _mods: number;
  get mods(): number {
    return this._mods;
  }
  get result(): number {
    return _.sum(this.dice) + this.mods;
  }
  // toString
  get dice(): Array<Die> {
    return Array.from(this.values());
  }
  valueOf(): number {
    return this.result;
  }
  constructor(options: IRollOptions|troikaDiceNotation)
  {
    let rollOptions: IRollOptions;
    if (typeof options == "string") {
      rollOptions = parseDice(options);
    } else {
      rollOptions = options;
    }
    let dice = new Array(rollOptions.quantity).map(die => new Die(rollOptions.sides));
    super(...dice);
    this._mods = rollOptions.mods;
  }
}

export interface IRollOptions {
  quantity: number;
  sides: troikaDice;
  mods: number;
}

const rollPattern = TypedRegEx("^(?<quantity>[0-9]+)?d(?<sides>(2|3|6|66|666)(?<mods>[\+\-][0-9]+)?$");

export function parseDice(notation: troikaDiceNotation): IRollOptions {
  let defaults = {
    quantity: "1",
    mods: "0",
  };
  let subStrings = rollPattern.captures(notation);
  if (!subStrings) {
    throw new Error();
  }
  subStrings = Object.assign(defaults, subStrings);
  if (!subStrings.sides) {
    throw new Error();
  }
  let result = _.mapValues(subStrings, (value,key) => Number(value)) as IRollOptions;
  return result;
}