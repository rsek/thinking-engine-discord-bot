import spells from "./loadSpells.js";
import tables from "./loadTables.js";
import items from "./loadItems.js";
import { RefType } from "../modules/parseComponent/WidgetType.js";
import getDamageTables from "./getDamageTables.js";
import { Collection } from "discord.js";
import Skill from "../modules/PlayerCharacter/Skill.js";
import DamageInfo from "../modules/DamageRoll/DamageInfo.js";
import Item from "../modules/inventory/Item.js";
import Spell from "../modules/items/Spell.js";
import Background from "./Background.js";
import Table from "../modules/tables/Table.js";
import Enemy from "../modules/bestiary/Enemy.js";
import bestiary from "./loadBestiary.js";
import getMienTables from "./getMienTables.js";
import _ from "lodash";

const GameData: Record<RefType, Collection<string, (Spell | Table | Item | DamageInfo | Skill | Background | Enemy)>> = {
  [RefType.Background]: new Collection<string, Background>(),
  [RefType.Bestiary]: bestiary,
  [RefType.DamageTable]: getDamageTables(items, spells),
  [RefType.Item]: items,
  [RefType.Skill]: new Collection<string, Skill>(),
  [RefType.Spell]: spells,
  [RefType.Table]: tables.concat(getMienTables(bestiary)),
};

export default GameData;

