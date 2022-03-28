import { EmbedField } from "discord.js";
import IAttribute from "./IAttribute.js";
import { IRendersEmbedField } from "../widgets/IRenders.js";

export default abstract class Attribute implements IAttribute, IRendersEmbedField {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  abstract toEmbedField(inline: boolean): EmbedField;
}