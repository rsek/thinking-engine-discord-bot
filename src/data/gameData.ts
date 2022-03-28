import "reflect-metadata";

import { RefType } from "../modules/widgets/WidgetType.js";
import { singleton, container } from "tsyringe";
import Backgrounds from "./Backgrounds.js";
import DamageTables from "./DamageTables.js";
import Items from "./Items.js";
import Skills from "./Skills.js";
import Spells from "./Spells.js";
import Tables from "./Tables.js";
import Bestiary from "./Bestiary.js";

@singleton()
export class GameData {
  [RefType.Background] = container.resolve(Backgrounds);
  [RefType.Bestiary] = container.resolve(Bestiary);
  [RefType.DamageTable] = container.resolve(DamageTables);
  [RefType.Item] = container.resolve(Items);
  [RefType.Skill] = container.resolve(Skills);
  [RefType.Spell] = container.resolve(Spells);
  [RefType.Table] = container.resolve(Tables);
}
