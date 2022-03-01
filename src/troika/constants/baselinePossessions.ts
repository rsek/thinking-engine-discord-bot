import Roll from "../classes/Roll.js";
import Item from "../classes/Item.js";


// TODO: make this a yaml file insttead so it's configurable
const baselinePossessions = [
  new Item(
    "silver pence", new Roll(2,6).valueOf()),
  new Item("knife"),
  new Item("lantern"),
  new Item("flask of oil"),
  new Item("rucksack"),
  new Item("provision", 6)
];

export default baselinePossessions;