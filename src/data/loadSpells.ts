import getYamlFiles from "./getYamlFiles.js";
import ISpell from "./interfaces/ISpell.js";
import YAML from "yamljs";
import yamlRoot from "./yamlRoot.js";
import Spell from "../modules/items/Spell.js";
import _ from "lodash";
import { Collection } from "discord.js";

let spellData = getYamlFiles(yamlRoot+"spells/").map(file => YAML.load(file as string) as Record<string,ISpell>)
  .reduce((obj1,obj2) => Object.assign(obj1, obj2));

spellData = _.mapValues(spellData, (data, id) => new Spell(id, data));

const spells: Collection<string, Spell> = new Collection(Object.entries(spellData as Record<string, Spell>));

export default spells;