import type { EmbedBuilder } from "@discordjs/builders";



/**
 * Counts the number of characters in an embed's user-facing text.
 * @param embed The embed builder to calculate the length of.
 * @returns The total length of all text in the embed.
 */
export default function embedLength(embed: EmbedBuilder) {
  return (
    (embed.data.title?.length ?? 0) +
      (embed.data.description?.length ?? 0) +
      (embed.data.fields?.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0) ?? 0) +
      (embed.data.footer?.text.length ?? 0) +
      (embed.data.author?.name.length ?? 0)
  );
}