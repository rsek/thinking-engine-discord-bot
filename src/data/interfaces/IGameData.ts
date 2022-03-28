import { RefType } from "../../modules/widgets/WidgetType.js";
import { Collection } from "discord.js";
import Skill from "../../modules/PlayerCharacter/Skill.js";
import DamageInfo from "../../modules/reference/DamageInfo.js";
import Item from "../../modules/inventory/Item.js";
import Spell from "../../modules/reference/Spell.js";
import Background from "../../modules/reference/Background.js";
import Table from "../../modules/tables/Table.js";
import Enemy from "../../modules/reference/Enemy.js";

export default interface IGameData {
  [RefType.Background]: Collection<string, Background>;
  [RefType.Bestiary]: Collection<string, Enemy>;
  [RefType.DamageTable]: Collection<string, DamageInfo>;
  [RefType.Item]: Collection<string, Item>;
  [RefType.Skill]: Collection<string, Skill>;
  [RefType.Spell]: Collection<string, Spell>;
  [RefType.Table]: Collection<string, Table>;
}
