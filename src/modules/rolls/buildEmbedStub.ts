import { EmbedBuilder } from "discord.js";
import { titleCase } from "title-case";
import { WidgetType } from "../parseComponent/WidgetType.js";
import splitCamelCase from "../text/splitCamelCase.js";

/**
 * Builds a basic embed for use in building widgets.
 * @param widgetType The corresponding widget type.
 * @param uncasedTitle The title string, to be converted to title case.
 * @param widgetSubtype The widget subtype to append to the widgetType, if anything.
 * @returns The embed stub.
 */
export default function buildWidgetStub(widgetType: WidgetType, uncasedTitle: string, widgetSubtype?: string | undefined) {
  let embedTypeString = splitCamelCase(WidgetType[widgetType]);
  if (widgetSubtype) {
    embedTypeString += ": " + widgetSubtype;
  }
  const embed = new EmbedBuilder()
    .setAuthor({ name: titleCase(embedTypeString) })
    .setTitle(titleCase(uncasedTitle))
    ;
  return embed;
}