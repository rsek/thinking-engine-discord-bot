import Roll from "./Roll.js";

export default class RollUnder extends Roll {
  private _target: number;
  get target(): number { return this._target};
  isSuccess(this: RollUnder): boolean {
    if (this.every(die => die.result == 6)) {
      return false;
    }
    else if (this.valueOf() <= this.target) {
      return true;
    }
    return false;
  };
  constructor(targetNumber: number) {
    let rollUnderOptions = {
      quantity: 2,
      sides: 6,
      mods: 0
    };
    super(rollUnderOptions);
    this.isSuccess = this.isSuccess.bind(this);
    this._target = targetNumber;
  }
}