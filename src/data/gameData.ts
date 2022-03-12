import spells from "./loadSpells.js";
import tables from "./loadTables.js";
import items from "./loadItems.js";
import { RefType } from "../modules/parseComponent/WidgetType.js";
import getDamageInfo from "./getDamageInfo.js";
import { Collection } from "discord.js";
import Skill from "../modules/PlayerCharacter/Skill.js";
import DamageInfo from "../modules/DamageRoll/DamageInfo.js";
import Item from "../modules/inventory/Item.js";
import Spell from "../modules/items/Spell.js";
import Table from "../modules/tables/Table.js";
import Background from "./Background.js";

const GameData: Record<RefType, Collection<string, Spell | Table | Item | DamageInfo | Skill | Background>> = {
  [RefType.Background]: new Collection<string, Background>(),
  [RefType.DamageTable]: getDamageInfo(items, spells),
  [RefType.Item]: items,
  [RefType.Skill]: new Collection<string, Skill>(),
  [RefType.Spell]: spells,
  [RefType.Table]: tables,
};

export default GameData;

