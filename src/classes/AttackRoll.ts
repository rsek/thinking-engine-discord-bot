import OpponentRoll, { IOpponentRoll } from "./OpponentRoll.js";


// On your Turn you may decide to take Aim with your ranged Weapon. To do so hold onto your Initiative Token. When your next Initiative Token is drawn you may roll twice and pick the best roll. If the End of the Round Token comes up and you haven’t used your Aim Token you may decide to hold onto it for the next Round.


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

  // In a tie both parties have avoided hurting each other.
  // If you roll a double 6 while attacking you strike a Mighty Blow, win the exchange, and inflict Double Damage (8.1).
  /// If both parties strike a Mighty Blow a spectacular clinch is formed, shattering both Weapons (in the case of beastly claws, tentacles, and so on they will lose 1d6 Stamina instead).
  // A roll of double 1s in combat results in the roller losing the exchange and their opponent adding 1 to their Damage Roll. If both parties Fumble they each deal Damage to the other, adding 1 to their Damage Roll.
  // Shields reduce Damage Rolls by 1 to a minimum of 1.
}

export interface IAttackRoll extends IOpponentRoll {
  isMightyBlow: () => boolean;
  isFumble: () => boolean;
}
