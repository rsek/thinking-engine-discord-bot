import { EmbedFieldData, MessageEmbed } from "discord.js";

export default function replaceField(embed: MessageEmbed, fieldNameOrIndex: string | number, newField: EmbedFieldData) {
  let fieldIndex;
  if (typeof fieldNameOrIndex == "number") {
    fieldIndex = fieldNameOrIndex;
  }
  else {
    fieldIndex = embed.fields.findIndex(field => field.name == fieldNameOrIndex);
  }
  embed.spliceFields(fieldIndex, 1, newField);
  return embed;
}