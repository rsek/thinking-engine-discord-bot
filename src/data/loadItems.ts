import { Collection } from "discord.js";
import _ from "lodash";
import YAML from "yamljs";
import Item from "../modules/inventory/Item.js";
import getYamlFiles from "./getYamlFiles.js";
import IItem from "./interfaces/IItem.js";
import yamlRoot from "./yamlRoot.js";

let itemData = getYamlFiles(yamlRoot+"items/").map(file => YAML.load(file as string) as Record<string,IItem>)
  .reduce((obj1,obj2) => Object.assign(obj1, obj2));

itemData = _.mapValues(itemData, (data, id) => new Item(id, data));

const items = new Collection(Object.entries(itemData as Record<string,Item>));

export default items;