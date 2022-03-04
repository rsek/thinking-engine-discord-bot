import { EmbedFieldData } from "discord.js";
import _ from "lodash";
import { TypedRegEx } from "typed-regex";

export const currentMaxSeparator = " / ";

export const currentKeyName = "current";
export const maxKeyName = "max";

export type CurrentMaxHash = Record<string, { [currentKeyName]: number; [maxKeyName]: number; }>;

export type currentMaxString = `${number}${typeof currentMaxSeparator}${number}`;

export const currentMaxPattern = TypedRegEx(`^(?<${currentKeyName}>[0-9]+)${currentMaxSeparator}(?<${maxKeyName}>[0-9]+)$`);

export interface CurrentMaxFieldData extends EmbedFieldData {
  value: currentMaxString;
}

export function fieldsToCurrentMaxHash(...fields: CurrentMaxFieldData[]): CurrentMaxHash {
  const hash: CurrentMaxHash = {};
  fields.forEach((field) => {
    if (currentMaxPattern.isMatch(field.value)) {
      const values = currentMaxPattern.captures(field.value);
      if (!values) {
        throw new Error();
      }
      hash[field.name] = {
        [currentKeyName]: Number(values.current),
        [maxKeyName]: Number(values.max)
      }}
  });
  return hash;
}

export function currentMaxHashToFields(hash: CurrentMaxHash, inline: boolean = true): CurrentMaxFieldData[] {
  const fields: CurrentMaxFieldData[] = _.map(hash, (values, key) => ({name: key, value: `${values.current}${currentMaxSeparator}${values.max}`, inline}));
  return fields;
}