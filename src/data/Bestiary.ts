import { Collection } from "discord.js";
import _ from "lodash";
import YAML from "yamljs";
import Enemy from "../modules/reference/Enemy.js";
import type IEnemyYaml from "../modules/reference/IEnemyYaml.js";
import getYamlFiles from "./getYamlFiles.js";
import yamlRoot from "./yamlRoot.js";

export default class Bestiary extends Collection<string, Enemy> {
  constructor() {
    super();
    const enemyYaml = getYamlFiles(yamlRoot+"bestiary/").map(file => YAML.load(file as string) as Record<string,IEnemyYaml>)
      .reduce((obj1,obj2) => Object.assign(obj1, obj2));
    _.forEach(enemyYaml, (data, id) => this.set(id, new Enemy(id, data)));
  }
}

