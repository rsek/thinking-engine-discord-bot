import { EmbedField, EmbedFieldData } from "discord.js";
import { NumericAttrString } from "./NumericAttrConstants.js";


export interface NumericAttrFieldData extends EmbedFieldData {
  value: NumericAttrString;
}

export type NumericAttrField = EmbedField & NumericAttrFieldData;
