import { Collection } from "discord.js";
import _ from "lodash";
import YAML from "yamljs";
import Enemy from "../modules/bestiary/Enemy.js";
import IEnemyYaml from "../modules/bestiary/IEnemyYaml.js";
import getYamlFiles from "./getYamlFiles.js";
import yamlRoot from "./yamlRoot.js";

const enemyYaml = getYamlFiles(yamlRoot+"bestiary/").map(file => YAML.load(file as string) as Record<string,IEnemyYaml>)
  .reduce((obj1,obj2) => Object.assign(obj1, obj2));

const enemyData = _.mapValues(enemyYaml, (data, id) => new Enemy(id, data));

const bestiary = new Collection(Object.entries(enemyData as Record<string,Enemy>));

export default bestiary;