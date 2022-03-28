import IGameDataBase from "../../data/interfaces/IGameObjectBase.js";
import Table from "../tables/Table.js";


export default interface IEnemyBase extends IGameDataBase {
  "Damage as": string;
  Mien: Table | Record<number, string>;
  Description: string;
  Special?: string | undefined;

}
