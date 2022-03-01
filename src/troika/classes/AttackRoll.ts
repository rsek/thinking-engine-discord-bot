import OpponentRoll, { IOpponentRoll } from "./OpponentRoll.js";




export class AttackRoll extends OpponentRoll implements IAttackRoll {
  constructor(name: string, bonus: number) {
    super(name, bonus);
  }
  isMightyBlow() {
    return this.dice.every(die => die == 6);
  }
  isFumble() {
    return this.dice.every(die => die == 1);
  }
}

export interface IAttackRoll extends IOpponentRoll {
  isMightyBlow: () => boolean;
  isFumble: () => boolean;
}
