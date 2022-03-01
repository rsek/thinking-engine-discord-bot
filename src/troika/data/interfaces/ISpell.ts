import IAttack from "./IAttack.js";

export default interface ISpell {
  "Casting cost"?: number | undefined;
  Description: string;
  Attacks?: IAttack[] | undefined;
}