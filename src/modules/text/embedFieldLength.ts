import type { EmbedField } from "discord.js";

export default function embedFieldLength(embedField: EmbedField) {
  return embedField.name.length + embedField.value.length;
}