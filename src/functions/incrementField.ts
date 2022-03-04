import { MessageEmbed } from "discord.js";
import { currentMaxPattern, currentMaxSeparator } from "../modules/initiative/currentMax.js";

export const incrementFieldId = "incrementField";

export default function incrementField(embed: MessageEmbed, fieldName: string, incrementCurrent: number = 1, incrementMax: number = 0, createIfMissing: boolean = true) {
  const fieldIndex = embed.fields.findIndex(field => field.name == fieldName);
  const field = embed.fields[fieldIndex];
  if (fieldIndex != -1 && currentMaxPattern.isMatch(field?.value)) {
    const currentMaxData = currentMaxPattern.captures(field?.value);
    let current = Number(currentMaxData?.current);
    let max = Number(currentMaxData?.max);
    current += incrementCurrent;
    max += incrementMax;
    if (current > max) {
      current = max;
    }
    field.value = `${current}${currentMaxSeparator}${max}`;
  } else if (fieldIndex == -1 && createIfMissing === true) {
    const newCurrent = Math.max(incrementCurrent, 0);
    let newMax = incrementMax;
    if (newCurrent > newMax) {
      newMax = newCurrent;
    }
    const newField = {
      name: fieldName,
      value: `${newCurrent}${currentMaxSeparator}${newMax}`,
      inline: true
    }
    console.log("creating new field", newField);
    embed.fields.push(newField);
  }
  console.log("updated fields", embed.fields);
  return embed;
}