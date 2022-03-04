import { MessageSelectOptionData, SelectMenuInteraction } from "discord.js";
import "reflect-metadata";
import { TypedRegEx } from "typed-regex";
import { incrementFieldId } from "../../functions/incrementField.js";
import { actionSeparator, paramSeparator } from "../../functions/parseBotAction.js";

export function incrementFieldOption(fieldName: string, incrementCurrent: number = 1, incrementMax: number = 0, label: string = `${incrementCurrent >= 0 ? "+" : "-"}${incrementCurrent} ${fieldName}`): MessageSelectOptionData {
  return {
    label,
    value: `${typeof incrementFieldId}:${incrementCurrent}${paramSeparator}${incrementMax}${paramSeparator}${fieldName}`
  };
}

const incrementFieldRegex = `^${typeof incrementFieldId}${actionSeparator}(?<incrementCurrent>-?[1-9][0-9]*)${paramSeparator}(?<incrementMax>-?[1-9][0-9]*)${paramSeparator}(?<fieldName>.+)$`;

export type IncrementFieldString = `${typeof incrementFieldId}${typeof actionSeparator}${"-"|""}${number}${typeof paramSeparator}${"-"|""}${number}${typeof paramSeparator}${string}`;


// TODO: prob needs an escaped version
export const incrementFieldType = TypedRegEx(incrementFieldRegex);

export const incrementFieldPattern = new RegExp(incrementFieldRegex);