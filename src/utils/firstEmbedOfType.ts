import { APIEmbed } from "discord-api-types/v10";
import { WidgetType } from "../modules/widgets/WidgetType.js";

/**
 * Attempts to parse the Thinking Engine-specific embed type from an embed's author text.
 * @param embed The embed to be parsed.
 * @returns The widget type. Throws an error if it's unable to parse.
 */
export function parseEmbedType(embed: APIEmbed): WidgetType {
  if (!embed.author) {
    throw new Error("Embed has no author text.");
  }
  const typeString = embed.author?.name.split(":")[0].replace(" ", "");
  if (Object.values(WidgetType)) {
    return WidgetType[typeString as keyof typeof WidgetType];
  }
  throw new Error(`Could not parse embed type from author text: ${embed.author.name}`);
}

/**
 * Tries to find the first embed of the supplied embed type.
 * @param widgetType The type of widget to search for.
 * @param embeds The array of embeds to search
 * @returns An embed, if any.
 */
export function firstEmbedOfType<T extends WidgetType>(widgetType: T, embeds: APIEmbed[]): APIEmbed|undefined {
  const result: APIEmbed|undefined = embeds.find(embed => parseEmbedType(embed) === widgetType);
  return result;
}
/**
 * Searches for the first embed of a given type and returns its index.
 * @param widgetType The type of widget to get the first index of.
 * @param embeds The array of embeds to search.
 * @returns The index of the embed, or -1 if it doesn't exist.
 */
export function firstEmbedOfTypeIndex<T extends WidgetType>(widgetType: T, embeds: APIEmbed[]): number {
  const result: number = embeds.findIndex(embed => parseEmbedType(embed) === widgetType);
  return result;
}