import type { Embed, EmbedField } from "discord.js";
import type WithRequired from "../types/WithRequired.js";

/**
 * Replace a field in an embed by name
 * @param embed - The embed object to modify.
 * @param {string} fieldName - The name of the field to replace.
 * @param {EmbedField} newField - The new field to replace the old one with.
 * @returns The embed with the field replaced.
 */
export default function replaceFieldByName(embed: WithRequired<Embed, "fields">, fieldName: string, newField: EmbedField) {
  if (embed.fields.some(field => field.name === fieldName)) {
    embed.fields.forEach(field => {
      if (field.name === fieldName) { field = newField; }
    });
  }
  return embed;
}