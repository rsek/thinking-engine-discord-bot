import Roll from "./Roll.js";

export default class D66 extends Roll {
  constructor() {
    super(2, 6);
  }
  valueOf(): number {
    const str = this.dice.map(die => die.valueOf()).join();
    return Number(str);
  }
  toString(): string {
    return `d66: **${this.valueOf()}**`;
  }
}