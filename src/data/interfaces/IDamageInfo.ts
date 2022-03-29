import type IGameDataBase from "./IGameObjectBase.js";
import type AttackType from "../../constants/AttackType.js";
import type Tuple from "../../types/Tuple.js";

export default interface IDamageInfo extends IGameDataBase {
  "Name"?: string | undefined;
  Damage: Tuple<number, 7>;
  "Attack type": AttackType; // default: other
  "Ignore armour"?: number | undefined; // default: 0; set to -1 to ignore all armour
}