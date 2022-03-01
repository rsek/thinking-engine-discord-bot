// cmight be fun to experiment with *light* nlp hre, for pluralizing items

export default class Item {
  Name: string;
  Quantity: number;
  Description: string | undefined;
  constructor(name: string, quantity: number = 1, description?: string) {
    this.Name = name;
    this.Quantity = quantity;
    this.Description = description;
  }
  // TODO toString
}

// +2 to a skill