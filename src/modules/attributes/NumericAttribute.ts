import { APIEmbed } from "discord-api-types/v9";
import { ButtonComponent, Embed, EmbedField, EmbedFieldData, SelectMenuOption } from "discord.js";
import PartialBy from "../../types/PartialBy.js";
import WithRequired from "../../types/WithRequired.js";
import { BotTask } from "../parseComponent/BotTask.js";
import { IHasTask } from "../parseComponent/IHasTask.js";
import { IEditAttrTaskParams } from "../parseComponent/ITaskParams.js";
import { packParams } from "../parseComponent/packParams.js";
import { currentKeyName, maxKeyName, NumericAttrPattern, NumericAttrSeparator } from "../ux/NumericAttrHash.js";
import Attribute from "./Attribute.js";
import INumericAttribute from "./INumericAttribute.js";
import { IRendersButtonComponent, IRendersSelectMenuOption } from "./IRenders.js";

export default class NumericAttribute extends Attribute implements INumericAttribute, IRendersButtonComponent, IRendersSelectMenuOption, IHasTask<BotTask.EditAttribute> {
  static incrementByName(embed: Embed | APIEmbed, {
    id,  current = 1, max = 0, add = true
  }: WithRequired<IEditAttrTaskParams, "id">) {
    if (embed.fields) {
      const fieldIndex = embed.fields.findIndex(field => field.name === id);
      const field = embed.fields[fieldIndex];
      if (fieldIndex !== -1 && NumericAttrPattern.isMatch(field?.value)) {
        console.log("[NumericAttribute] Field is valid. Incrementing...");
        const attr = NumericAttribute.fromField(field);
        attr[currentKeyName] += current;
        attr[maxKeyName] += max;
        if (attr[currentKeyName] > attr[maxKeyName]) {
          attr[currentKeyName] = attr[maxKeyName];
        }
        console.log("[NumericAttribute] Built new attribute", attr);
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
    console.log("[NumericAttribute] updated fields", embed.fields);
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
  toEmbedField(inline: boolean = true): EmbedField {
    const value = this[currentKeyName] === this[maxKeyName] ? this[maxKeyName].toString() : `${this[currentKeyName]}${NumericAttrSeparator}${this[maxKeyName]}`;
    return {
      name: this.name,
      value: value,
      inline
    };
  }
  getTaskString(params: PartialBy<IEditAttrTaskParams, "id"> = { current: 1, max: 0 }) {
    params.id = this.name;
    return packParams(BotTask.EditAttribute, params as IEditAttrTaskParams);
  }
  toButtonComponent(params: PartialBy<IEditAttrTaskParams, "id"> = { current: 1, max: 0 }) {
    const customId = this.getTaskString(params);
    return new ButtonComponent()
      .setCustomId(customId);
  }
  toSelectMenuOption(params: PartialBy<IEditAttrTaskParams, "id"> = { current: 1, max: 0 }): SelectMenuOption {
    const value = this.getTaskString(params);
    const selectMenuOption = new SelectMenuOption()
      .setDefault(false)
      .setValue(value);
    return selectMenuOption;
  }
}