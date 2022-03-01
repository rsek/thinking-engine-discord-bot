import IAttack from "./IAttack.js";
import IItem from "./IItem.js";

export default interface IWeapon extends IItem {
  Type: Omit<AttackType, "Spell">;
  Attacks: IAttack[];
}

export enum AttackType {
  Melee = "Melee",
  Ranged = "Ranged",
  Beastly = "Beastly",
  Other = "Other",
  Spell = "Spell",
}