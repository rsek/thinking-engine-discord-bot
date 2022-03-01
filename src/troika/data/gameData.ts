import { PathLike, readdirSync, readFileSync } from "fs";
import IItem from "./interfaces/IItem.js";
import ISpell from "./interfaces/ISpell.js";
import IWeapon from "./interfaces/IWeapon.js";
import YAML from "yamljs";
import _ from "lodash";
import Spell from "../classes/Spell.js";

let yamlRoot = "./dist/troika/data/yaml/";

// console.info(__dirname);

// console.log(readdirSync(yamlRoot));

function getYamlFiles(path: PathLike): PathLike[] {
  return readdirSync(path).filter(file => file.match(/^.*\.y(a)?ml/)).map(file => path+file) as PathLike[];
}


// let spellData = YAML.load(yamlRoot+"spells/core.yaml") as Record<string,ISpell>;

let spellData = getYamlFiles(yamlRoot+"spells/").map(file => YAML.load(file as string) as Record<string,ISpell>).reduce((obj1,obj2) => Object.assign(obj1, obj2));

const gameData = {
  spells: _.mapValues(spellData, (spell, spellName) => new Spell(spellName, spell)),
  // backgrounds: YAML.load(yamlRoot+"backgrounds/core.yaml") as Record<string,object>,
  weapons: YAML.load(yamlRoot+"weapons/core.yaml")as Record<string,IWeapon>,
  items: YAML.load(yamlRoot+"items/core.yaml") as Record<string,IItem>
};

export default gameData;