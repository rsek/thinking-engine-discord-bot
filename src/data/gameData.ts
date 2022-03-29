
import { RefType } from "../modules/widgets/WidgetType.js";
import type Backgrounds from "./Backgrounds.js";
import type DamageTables from "./DamageTables.js";
import type Items from "./Items.js";
import type Skills from "./Skills.js";
import type Spells from "./Spells.js";
import type Tables from "./Tables.js";
import type Bestiary from "./Bestiary.js";

export default class GameData {
  [RefType.Background]!: Backgrounds;
  [RefType.Bestiary]!: Bestiary;
  [RefType.DamageTable]!: DamageTables;
  [RefType.Item]!: Items;
  [RefType.Skill]!: Skills;
  [RefType.Spell]!: Spells;
  [RefType.Table]!: Tables;
  constructor(
    backgrounds: Backgrounds,
    bestiary: Bestiary,
    damageTables: DamageTables,
    items: Items,
    skills: Skills,
    spells: Spells,
    tables: Tables,
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

