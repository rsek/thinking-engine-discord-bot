import "reflect-metadata";

import { Collection } from "discord.js";
import { singleton, container } from "tsyringe";
import DamageInfo from "../modules/reference/DamageInfo.js";
import Items from "./Items.js";
import Spells from "./Spells.js";

@singleton()
export default class DamageTables extends Collection<string, DamageInfo> {
  constructor() {
    super();
    const items: Collection<string, {Attacks?: DamageInfo[] | undefined}> = container.resolve(Items);
    const spells: Collection<string, {Attacks?: DamageInfo[] | undefined}> = container.resolve(Spells);
    const collection = items.concat(spells);
    collection.forEach((item) => {
      if (item.Attacks) {
        item.Attacks.forEach(dmgInfo => this.set(dmgInfo.$id, dmgInfo));
      }
    });
  }
}