import type { EmbedField, EmbedFieldData } from "discord.js";
import type { NumericAttrString } from "./NumericAttrConstants.js";


export interface NumericAttrFieldData extends EmbedFieldData {
  value: NumericAttrString;
}

export type NumericAttrField = EmbedField & NumericAttrFieldData;
