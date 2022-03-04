import IAttack from "./IAttack.js";
import IItem from "./IItem.js";

export default interface IWeapon extends IItem {
  Attacks: IAttack[];
}

export enum AttackType {
  melee = "melee",
  ranged = "ranged",
  beastly = "beastly",
  other = "other",
  spell = "spell",
}