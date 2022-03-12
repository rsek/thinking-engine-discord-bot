import { EmbedField, Embed } from "discord.js";
import WithRequired from "../../types/WithRequired.js";

export default function replaceFieldByName(embed: WithRequired<Embed, "fields">, fieldName: string, newField: EmbedField) {
  if (embed.fields.some(field => field.name === fieldName)) {
    embed.fields.forEach(field => {
      if (field.name === fieldName) { field = newField; }
    });
  }
  return embed;
}