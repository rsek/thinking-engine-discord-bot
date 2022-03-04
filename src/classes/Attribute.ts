import { EmbedField } from "discord.js";

export interface IAttribute {
  Name: string;
  Max: number;
  Current: number;
}

export default class Attribute implements IAttribute{
  Name: string;
  Max: number;
  Current: number;
  constructor(name: string, max: number, current: number = max) {
    this.Name = name;
    this.Max = max;
    this.Current = current;
    this.toEmbedField = this.toEmbedField.bind(this);
  }
  toEmbedField(inline = false): EmbedField {
    return {
      name: this.Name,
      value: `${this.Max} / ${this.Current}`,
      inline
    }
  }
}