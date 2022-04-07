
import { Collection } from "discord.js";
import type Items from "./Items.js";
import type Spells from "./Spells.js";
import type DamageTable from "../modules/reference/DamageTable.js";

export default class DamageTables extends Collection<string, DamageTable> {
  constructor(items: Items, spells: Spells) {
    super();
    [ spells, items ].forEach(collection =>
      collection.forEach((item) => {
        if (item.Attacks) {
          item.Attacks.forEach(dmgInfo => this.set(dmgInfo.$id, dmgInfo));
        }
      }));
  }
}

