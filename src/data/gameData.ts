
import { RefType } from "../modules/widgets/WidgetType.js";
import type Background from "../modules/reference/Background.js";
import type { Collection } from "discord.js";
import type Enemy from "../modules/reference/Enemy.js";
import type DamageInfo from "../modules/reference/DamageInfo.js";
import type Item from "../modules/inventory/Item.js";
import type Skill from "../modules/PlayerCharacter/Skill.js";
import type Spell from "../modules/reference/Spell.js";
import type Table from "../modules/tables/Table.js";

export default class GameData {
  [RefType.Background]!: Collection<string, Background>;
  [RefType.Bestiary]!: Collection<string, Enemy>;
  [RefType.DamageTable]!: Collection<string, DamageInfo>;
  [RefType.Item]!: Collection<string, Item>;
  [RefType.Skill]!: Collection<string, Skill>;
  [RefType.Spell]!: Collection<string, Spell>;
  [RefType.Table]!: Collection<string, Table>;
  constructor(
    backgrounds: Collection<string, Background>,
    bestiary: Collection<string, Enemy>,
    damageTables: Collection<string, DamageInfo>,
    items: Collection<string, Item>,
    skills: Collection<string, Skill>,
    spells: Collection<string, Spell>,
    tables: Collection<string, Table>,
  ) {
    this[RefType.Background] = backgrounds;
    this[RefType.Bestiary] = bestiary;
    this[RefType.DamageTable] = damageTables;
    this[RefType.Item] = items;
    this[RefType.Skill] = skills;
    this[RefType.Spell] = spells;
    this[RefType.Table] = tables;
  }
}

