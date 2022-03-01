import { PathLike, readdirSync } from "fs";
import IItem from "./interfaces/IItem.js";
import ISpell from "./interfaces/ISpell.js";
import IWeapon from "./interfaces/IWeapon.js";
import YAML from "yamljs";
import _ from "lodash";
import Spell from "../classes/Spell.js";
import Attack from "../classes/Attack.js";
import Weapon from "../classes/Weapon.js";
import ITable from "./interfaces/ITable.js";
import Table from "../classes/Table.js";

const yamlRoot = "./dist/troika/data/yaml/";

// console.info(__dirname);

// console.log(readdirSync(yamlRoot));

function getYamlFiles(path: PathLike): PathLike[] {
  return readdirSync(path).filter(file => file.match(/^.*\.y(a)?ml/)).map(file => `${path.toString()}${file}`) as PathLike[];
}

const spellData = getYamlFiles(yamlRoot+"spells/").map(file => YAML.load(file as string) as Record<string,ISpell>).reduce((obj1,obj2) => Object.assign(obj1, obj2));

const weaponData = getYamlFiles(yamlRoot+"weapons/").map(file => YAML.load(file as string) as Record<string,IWeapon>).reduce((obj1,obj2) => Object.assign(obj1, obj2));

const itemData =  getYamlFiles(yamlRoot+"items/").map(file => YAML.load(file as string) as Record<string,IItem>).reduce((obj1,obj2) => Object.assign(obj1, obj2));

const tableData =  getYamlFiles(yamlRoot+"tables/").map(file => YAML.load(file as string) as Record<string,ITable>).reduce((obj1,obj2) => Object.assign(obj1, obj2));

const gameData = {
  spells: _.mapValues(spellData, (spell, spellName) => new Spell(spellName, spell)),
  // backgrounds: YAML.load(yamlRoot+"backgrounds/core.yaml") as Record<string,object>,
  weapons: _.mapValues(weaponData, (weapon, weaponName) => new Weapon(weaponName, weapon)),
  items: itemData,
  tables: _.mapValues(tableData, (table, tableName) => new Table(tableName, table)),
};

export default gameData;