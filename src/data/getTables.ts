import { Collection } from "discord.js";
import type Enemy from "../modules/reference/Enemy.js";
import type Table from "../modules/tables/Table.js";

/**
 * Extracts Mien Table objects from enemies and keys them in their own collection.
 *
 * @export
 * @param {...Collection<string, Enemy>[]} dataCollections
 * @return {*}
 */
export default function getTables(...dataCollections: Collection<string, Enemy>[]) {
  const result: Collection<string, Table> = new Collection();
  dataCollections.forEach((collection) => {
    collection.forEach((enemy) => {
      result.set(enemy.Mien.$id, enemy.Mien);
    });
  });
  return result;
}
