import type { RefType } from "../../modules/widgets/WidgetType.js";
import type { Collection } from "discord.js";
import type Skill from "../../modules/PlayerCharacter/Skill.js";
import type DamageInfo from "../../modules/reference/DamageInfo.js";
import type Item from "../../modules/inventory/Item.js";
import type Spell from "../../modules/reference/Spell.js";
import type Background from "../../modules/reference/Background.js";
import type Table from "../../modules/tables/Table.js";
import type Enemy from "../../modules/reference/Enemy.js";

export default interface IGameData {
  [RefType.Background]: Collection<string, Background>;
  [RefType.Bestiary]: Collection<string, Enemy>;
  [RefType.DamageTable]: Collection<string, DamageInfo>;
  [RefType.Item]: Collection<string, Item>;
  [RefType.Skill]: Collection<string, Skill>;
  [RefType.Spell]: Collection<string, Spell>;
  [RefType.Table]: Collection<string, Table>;
}
