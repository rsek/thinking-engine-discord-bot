import { EmbedField, EmbedFieldData } from "discord.js";
import _ from "lodash";
import { TypedRegEx } from "typed-regex";
import NumericAttribute from "../attributes/NumericAttribute.js";

export const NumericAttrSeparator = " / ";

export const currentKeyName = "current";
export const maxKeyName = "max";

export type NumericAttrHash = Record<string, NumericAttribute>;

export type NumericAttrString = `${number}${typeof NumericAttrSeparator}${number}`;

export const NumericAttrPattern = TypedRegEx(`^(?<${currentKeyName}>[0-9]+)(${NumericAttrSeparator})?(?<${maxKeyName}>[0-9]+)?$`);

export interface NumericAttrFieldData extends EmbedFieldData {
  value: NumericAttrString;
}

export type NumericAttrField = EmbedField & NumericAttrFieldData;

export function fieldsToNumericAttrHash(...fields: NumericAttrFieldData[]): NumericAttrHash {
  const hash: NumericAttrHash = {};
  fields.forEach((field) => {
    if (NumericAttrPattern.isMatch(field.value)) {
      hash[field.name] = NumericAttribute.fromField(field);
    }
  });
  return hash;
}

export function numericAttrHashToFields(hash: NumericAttrHash, inline: boolean = true): NumericAttrField[] {
  const fields: NumericAttrField[] = _.map(hash, (values) => values.toEmbedField(inline)) as NumericAttrField[];
  return fields;
}