import type { EmbedField } from "discord.js";

/**
 * It returns the length of the name and value of the embed field.
 * @param {EmbedField} embedField - EmbedField
 * @returns The length of the embed field name and value combined.
 */
export default function getEmbedFieldLength(embedField: EmbedField) {
  return embedField.name.length + embedField.value.length;
}