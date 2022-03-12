import Item from "./Item.js";

const maxInventorySpace = 12;

export default class Inventory extends Array<Item> {
  constructor(...items: Item[]) {
    super(...items);
    // if (this.length > maxInventorySpace) {

    // }
  }
}

// if there's at least one contiguous space available, it could prompt the user for the number of slots that are supposed to be consumed by the item
// *single* roll option for getting item from inventory: outputs result, plus a list of which items are accessible this turn
// procedure seems to suggest that it's something that's declared beforehand, tho; so it may make sense to have it prompt the user.
// can input modals be used to make a crude editing interface, by setting a default value?

// might be worth standardizing some components there, hmm.
// item string tag system? hmm.
