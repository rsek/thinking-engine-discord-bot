import { EmbedField, ButtonComponent, Embed, SelectMenuOption, SelectMenuComponent } from "discord.js";
import WithRequired from "../../types/WithRequired.js";
import WidgetOptions from "../initiative/WidgetOptions.js";

export interface IRendersEmbedField {
  toEmbedField(...args: any[]): EmbedField;
  // toEmbed(...args: any[]): Embed | never;
  // toMessage(...args: any[]): WithRequired<WidgetOptions, "embeds"> | never;
}

export interface IRendersEmbed {
  toEmbed(...args: any[]): Embed;
  // toMessage(...args: any[]): WithRequired<ReturnType<IRendersMessage["toMessage"]>, "embeds"> | never;
}

export interface IRendersMessage {
  toMessage(...args: any[]): WidgetOptions;
}

export interface IRendersSelectMenuOption {
  toSelectMenuOption(...args: any[]): SelectMenuOption;
  // toMessage(...args: any[]): WithRequired<ReturnType<IRendersMessage["toMessage"]>, "components"> | never;
}

export interface IRendersSelectMenuComponent {
  toSelectMenuComponent(...args: any[]): SelectMenuComponent;
  // toMessage(...args: any[]): WithRequired<ReturnType<IRendersMessage["toMessage"]>, "components"> | never;
}

export interface IRendersButtonComponent {
  toButtonComponent(...args: any[]): ButtonComponent;
  // toMessage(...args: any[]): WithRequired<ReturnType<IRendersMessage["toMessage"]>, "components"> | never;
}