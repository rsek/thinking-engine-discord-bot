import troikaDice from "../../types/troikaDice.js";
import roll from "../functions/roll.js";

export default class Die {
  private _sides: troikaDice;
  private _result: number;
  get sides() {
    return this._sides;
  }
  get result() {
    return this._result;
  }
  constructor(sides: troikaDice) {
    this._sides = sides;
    this._result = roll(sides);
  }
  valueOf() {
    return this.result;
  }
}