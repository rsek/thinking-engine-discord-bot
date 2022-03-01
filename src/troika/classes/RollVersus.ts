import Tuple from "../../types/Tuple.js";
import Roll from "./Roll.js";

export default class RollVersus {
  opponent1: Opponent;
  opponent2: Opponent;
  getWinner() {
    if (this.isTied()) {
      return null;
    }
    let result = this.opponent1.valueOf() > this.opponent2.valueOf() ? this.opponent1 : this.opponent2;
    return result;
  }
  isTied() {
    return this.opponent1.valueOf() == this.opponent2.valueOf();
  }
  constructor(opponent1mod: number, opponent2mod: number, opponent1name="Opponent 1", opponent2name = "Opponent 2") {
    this.opponent1 = new Opponent(opponent1name, opponent1mod);
    this.opponent2 = new Opponent(opponent2name,opponent2mod);
  }
}

export class Opponent implements IOpponent {
  name: string;
  roll: Roll;
  constructor(name: string, mods: number) {
    this.name = name;
    this.roll = new Roll(
      {quantity: 2,
      sides: 6,
      mods: mods
    });
  }
  valueOf() {
    return this.roll.valueOf;
  }
}

export interface IOpponent {
  name: string,
  roll: Roll
}