import _ from "lodash-es";

export default class Roll implements IRoll {
  private _bonus: number;
  private _dice: number[];
  constructor(quantity = 1, sides = 6, bonus = 0)
  {
    this._dice = [];
    for (let i = 0; i < quantity; i++) {
      this._dice.push(_.random(1, sides));
    }
    this._bonus = bonus ?? 0;
    this.valueOf = this.valueOf.bind(this);
  }
  public get dice(): number[] {
    return this._dice;
  }
  get bonus(): number {
    return this._bonus;
  }
  get total(): number {
    // console.log(this.dice);
    return _.sum(this.dice) + this.bonus;
  }

  toString(): string {
    const result = `[${this.dice.map(die => die.valueOf()).join(", ")}] + ${this.bonus} = **${this.valueOf()}**`;
    return result;
  }
  valueOf(): number {
    return this.total;
  }

}

export interface IRoll {
  dice: number[];
  bonus: number;
  total: number;
  valueOf: () => number;
}
