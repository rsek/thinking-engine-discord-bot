import { Collection } from "discord.js";
import _ from "lodash";
import YAML from "yamljs";
import getYamlFiles from "./getYamlFiles.js";
import yamlRoot from "./yamlRoot.js";
import Item from "../modules/inventory/Item.js";
import type IItem from "./interfaces/IItem.js";

export default class Items extends Collection<string, Item> {
  constructor() {
    super();
    const itemYaml = getYamlFiles(yamlRoot+"items/").map(file => YAML.load(file as string) as Record<string,IItem>)
      .reduce((obj1,obj2) => Object.assign(obj1, obj2));
    _.forEach(itemYaml, (data, id) => this.set(id, new Item(id, data)));
  }
}