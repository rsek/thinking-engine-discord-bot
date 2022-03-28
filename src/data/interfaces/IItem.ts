import IDamageInfo from "./IDamageInfo.js";
import IGameDataBase from "./IGameObjectBase.js";

export default interface IItem extends IGameDataBase {
  Description?: string | undefined;
  Charges?: number | undefined;
  Attacks?: IDamageInfo[] | undefined;
  Hands?: number | undefined; // default: 1
}