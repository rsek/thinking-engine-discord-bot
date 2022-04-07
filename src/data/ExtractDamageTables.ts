import { Collection } from "discord.js";
import type DamageTable from "../modules/reference/DamageTable.js";

/**
 * Extracts DamageInfo objects from items and spells and keys them in their own collection.
 *
 * @export
 * @param {...Collection<string, Item>[]} dataCollections
 * @return {*}
 */
export default function extractDamageTables(...dataCollections: Collection<string, { Attacks?: DamageTable[] | undefined; }>[]) {
  const result: Collection<string, DamageTable> = new Collection();
  dataCollections.forEach((collection) => {
    collection.forEach((item) => {
      if (item.Attacks) {
        item.Attacks.forEach(dmgInfo => result.set(dmgInfo.$id, dmgInfo));
      }
    });
  });
  return result;
}
