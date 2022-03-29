import _ from "lodash-es";
import type { NumericAttrHash } from "./NumericAttrConstants.js";
import { NumericAttrPattern } from "./NumericAttrConstants.js";
import type { NumericAttrField, NumericAttrFieldData } from "./NumericAttrFieldData";
import NumericAttribute from "./NumericAttribute.js";

/**
 * Given a list of NumericAttrFieldData, return a hash of NumericAttrHash
 * @param {NumericAttrFieldData[]} fields - an array of NumericAttrFieldData objects.
 * @returns A hash of NumericAttribute objects.
 */
export function fieldsToNumericAttrHash(...fields: NumericAttrFieldData[]): NumericAttrHash {
  const hash: NumericAttrHash = {};
  fields.forEach((field) => {
    if (NumericAttrPattern.isMatch(field.value)) {
      hash[field.name] = NumericAttribute.fromField(field);
    }
  });
  return hash;
}

/**
 * Given a hash of numeric attribute values, return an array of EmbedField objects
 * @param {NumericAttrHash} hash - The hash of numeric attributes to be converted to fields.
 * @param {boolean} [inline=true] - whether the field should be inline or not.
 * @returns An array of embed fields.
 */
export function numericAttrHashToFields(hash: NumericAttrHash, inline: boolean = true): NumericAttrField[] {
  const fields: NumericAttrField[] = _.map(hash, (values) => values.toEmbedField(inline)) as NumericAttrField[];
  return fields;
}