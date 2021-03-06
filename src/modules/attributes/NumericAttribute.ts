import type { APIEmbed } from "discord-api-types/v10";
import type { EmbedField, EmbedFieldData } from "discord.js";
import { ButtonBuilder, ButtonStyle, SelectMenuOptionBuilder } from "discord.js";
import Attribute from "./Attribute.js";
import type INumericAttribute from "./INumericAttribute.js";
import { currentKeyName, maxKeyName, NumericAttrPattern, NumericAttrSeparator } from "./NumericAttrConstants.js";
import type PartialBy from "../../types/PartialBy.js";
import type WithRequired from "../../types/WithRequired.js";
import { BotTask } from "../tasks/BotTask.js";
import type { IHasTask } from "../tasks/IHasTask.js";
import type { IEditAttrTaskParams } from "../tasks/ITaskParams.js";
import { packTaskParams } from "../tasks/packTaskParams.js";
import type { IRendersButton, IRendersSelectMenuOption } from "../widgets/IRenders.js";

export default class NumericAttribute extends Attribute implements INumericAttribute, IRendersButton, IRendersSelectMenuOption, IHasTask<BotTask.EditAttribute> {
  static incrementEmbedByName(embed: APIEmbed, {
    id,  current = 1, max = 0, add = true
  }: WithRequired<IEditAttrTaskParams, "id">) {
    if (embed.fields) {
      const fieldIndex = embed.fields.findIndex(field => field.name === id);
      const field = embed.fields[fieldIndex];
      if (fieldIndex !== -1 && NumericAttrPattern.isMatch(field?.value)) {
        // console.log("[NumericAttribute] Field is valid. Incrementing...");
        const attr = NumericAttribute.fromField(field);
        attr[currentKeyName] += current;
        attr[maxKeyName] += max;
        if (attr[currentKeyName] > attr[maxKeyName]) {
          attr[currentKeyName] = attr[maxKeyName];
        }
        // console.log("[NumericAttribute] Built new attribute", attr);
        embed.fields[fieldIndex] = attr.toEmbedField();
      } else if (fieldIndex === -1 && add === true) {
        const newCurrent = Math.max(current, 0);
        let newMax = max;
        if (newCurrent > newMax) {
          newMax = newCurrent;
        }
        const newAttr = new NumericAttribute(id, newCurrent,newMax);
        // console.log("creating new field", newField);
        embed.fields.push(newAttr.toEmbedField());
      }
    }
    // console.log("[NumericAttribute] updated fields", embed.fields);
    return embed;
  }
  static fromField(field: EmbedFieldData): NumericAttribute {
    // TODO: typeguard on value string
    if (field.value.includes(NumericAttrSeparator)){
      const currentMaxData = NumericAttrPattern.captures(field?.value);
      const current = Number(currentMaxData?.current);
      const max = Number(currentMaxData?.max ?? current);
      return new NumericAttribute(field.name, current, max);
    } else {
      return new NumericAttribute(field.name, Number(field.value));
    }
  }
  [maxKeyName]: number;
  [currentKeyName]: number;
  constructor(name: string, current: number, max: number = current) {
    super(name);
    this[currentKeyName] = current;
    this[maxKeyName] = max;
  }
  // incrementByName() {

  // }


  toEmbedField(inline: boolean = true): EmbedField {
    const value = this[currentKeyName] === this[maxKeyName] ? this[maxKeyName].toString() : `${this[currentKeyName]}${NumericAttrSeparator}${this[maxKeyName]}`;
    return {
      name: this.name,
      value: value,
      inline
    };
  }
  packTaskParams(params: PartialBy<IEditAttrTaskParams, "id"> = { current: 1, max: 0 }) {
    params.id = this.name;
    return packTaskParams(BotTask.EditAttribute, params as IEditAttrTaskParams);
  }
  toButton(params: PartialBy<IEditAttrTaskParams, "id"> = { current: 1, max: 0 }) {
    const customId = this.packTaskParams(params);
    return new ButtonBuilder()
      .setCustomId(customId)
      .setStyle(ButtonStyle.Secondary);
  }
  toSelectMenuOption(params: PartialBy<IEditAttrTaskParams, "id"> = { current: 1, max: 0 }): SelectMenuOptionBuilder {
    const value = this.packTaskParams(params);
    return new SelectMenuOptionBuilder()
      .setValue(value)
      .setDefault(false)
    ;
  }
}