import { Collection } from "discord.js";
import _ from "lodash";
import DamageInfo from "../modules/DamageRoll/DamageInfo.js";
import Item from "../modules/inventory/Item.js";

/**
 * Extracts DamageInfo objects from items and spells and keys them in their own collection.
 *
 * @export
 * @param {...Collection<string, Item>[]} dataCollections
 * @return {*}
 */
export default function getDamageInfo(...dataCollections: Collection<string, {Attacks?: DamageInfo[] | undefined }>[]) {
  const result: Collection<string, DamageInfo> = new Collection();
  dataCollections.forEach((collection) => {
    collection.forEach((item) => {
      if (item.Attacks) {
        item.Attacks.forEach(dmgInfo => result.set(dmgInfo.$id, dmgInfo));
      }
    });
  });
  return result;
}
