import Tuple from "../../types/Tuple.js";
import { AttackType } from "./IWeapon.js";

export default interface IAttack {
  Damage: Tuple<number, 7>;
  Type?: AttackType | undefined;
  // to ignore all armour, set to -1
  "Ignore armour"?: number | undefined;
  Hands?: number | undefined;
}