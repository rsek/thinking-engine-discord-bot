import { Collection } from "discord.js";
import _ from "lodash";
import YAML from "yamljs";
import readYamlFilePaths from "./readYamlFilePaths.js";
import YAML_ROOT from "./YAML_ROOT.js";
import Enemy from "../modules/reference/Enemy.js";
import type IEnemyYaml from "../modules/reference/IEnemyYaml.js";

export default class Bestiary extends Collection<string, Enemy> {
  constructor() {
    super();
    const enemyYaml = readYamlFilePaths(YAML_ROOT+"bestiary/").map(file => YAML.load(file as string) as Record<string,IEnemyYaml>)
      .reduce((obj1,obj2) => Object.assign(obj1, obj2));
    _.forEach(enemyYaml, (data, id) => this.set(id, new Enemy(id, data)));
  }
}

