import _ from "lodash-es";
import { NumericAttrFieldData, NumericAttrField } from "./NumericAttrFieldData";
import NumericAttribute from "./NumericAttribute.js";
import { NumericAttrHash, NumericAttrPattern } from "./NumericAttrConstants.js";

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