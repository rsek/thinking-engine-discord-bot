import { EmbedField, EmbedFieldData } from "discord.js";
import StaticImplements from "../decorators/StaticImplements.js";
import IAttribute from "./IAttribute.js";
import { IRendersEmbedField } from "./IRenders.js";

export default abstract class Attribute implements IAttribute, IRendersEmbedField {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  abstract toEmbedField(inline: boolean): EmbedField;
}