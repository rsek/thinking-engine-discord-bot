import type { SelectMenuBuilder } from "@discordjs/builders";
import type { ButtonBuilder, EmbedBuilder, EmbedField, SelectMenuOptionBuilder } from "discord.js";
import type WidgetOptions from "./WidgetOptions.js";

export interface IRendersEmbedField {
  toEmbedField(...args: any[]): EmbedField;
  // toEmbed(...args: any[]): Embed | never;
  // toMessage(...args: any[]): WithRequired<WidgetOptions, "embeds"> | never;
}

export interface IRendersEmbed {
  toEmbed(...args: any[]): EmbedBuilder;
  // toMessage(...args: any[]): WithRequired<ReturnType<IRendersMessage["toMessage"]>, "embeds"> | never;
}
export interface IRendersEmbedGroup {
  toEmbedGroup(...args: any[]): EmbedBuilder[];
  // toMessage(...args: any[]): WithRequired<ReturnType<IRendersMessage["toMessage"]>, "embeds"> | never;
}

export interface IRendersMessage {
  toMessage(...args: any[]): WidgetOptions;
}

export interface IRendersSelectMenuOption {
  toSelectMenuOption(...args: any[]): SelectMenuOptionBuilder;
  // toMessage(...args: any[]): WithRequired<ReturnType<IRendersMessage["toMessage"]>, "components"> | never;
}

export interface IRendersSelectMenu {
  toSelectMenu(...args: any[]): SelectMenuBuilder;
  // toMessage(...args: any[]): WithRequired<ReturnType<IRendersMessage["toMessage"]>, "components"> | never;
}

export interface IRendersButton {
  toButton(...args: any[]): ButtonBuilder;
  // toMessage(...args: any[]): WithRequired<ReturnType<IRendersMessage["toMessage"]>, "components"> | never;
}