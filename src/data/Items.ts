import { Collection } from "discord.js";
import _ from "lodash-es";
import YAML from "yamljs";
import type IItem from "./interfaces/IItem.js";
import readYamlFilePaths from "./readYamlFilePaths.js";
import YAML_ROOT from "./YAML_ROOT.js";
import Item from "../modules/inventory/Item.js";

export default class Items extends Collection<string, Item> {
  constructor() {
    super();
    const itemYaml = readYamlFilePaths(YAML_ROOT+"items/").map(file => YAML.load(file as string) as Record<string,IItem>)
      .reduce((obj1,obj2) => Object.assign(obj1, obj2));
    _.forEach(itemYaml, (data, id) => this.set(id, new Item(id, data)));
  }
}