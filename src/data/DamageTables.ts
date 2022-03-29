
import { Collection } from "discord.js";
import type Items from "./Items.js";
import type Spells from "./Spells.js";
import type DamageInfo from "../modules/reference/DamageInfo.js";

export default class DamageTables extends Collection<string, DamageInfo> {
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

