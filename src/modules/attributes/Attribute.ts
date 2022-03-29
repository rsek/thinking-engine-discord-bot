import type { EmbedField } from "discord.js";
import type IAttribute from "./IAttribute.js";
import type { IRendersEmbedField } from "../widgets/IRenders.js";

export default abstract class Attribute implements IAttribute, IRendersEmbedField {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  abstract toEmbedField(inline: boolean): EmbedField;
}