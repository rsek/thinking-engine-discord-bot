import "reflect-metadata";

import type { AutocompleteInteraction, CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType, InteractionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { Bot } from "../../bot.js";
import { RefType, WidgetType } from "../../modules/widgets/WidgetType.js";
import queryCollection from "../autocomplete/queryCollection.js";

@Discord()
export abstract class RollTableCommand {
  @Slash("table", { description: "Roll on a table." })
  async rollTable(
    @SlashOption( "table-name",
      {
        description: "The table to be rolled on.",
        type: ApplicationCommandOptionType.String,
        autocomplete: true
      })
      id: string,
    @SlashOption("preview", {
      description: "Display a preview of the table instead of rolling on it. (default: false)",
      type: ApplicationCommandOptionType.Boolean,
      required: false
    })
      preview: boolean = false,
    interaction: CommandInteraction|AutocompleteInteraction
  ) {
    switch (interaction.type) {
      case InteractionType.ApplicationCommandAutocomplete: {
        interaction = interaction as AutocompleteInteraction;
        const focusedOption = interaction.options.getFocused(true);
        if (focusedOption.name === "table-name") {
          return interaction.respond(
            queryCollection(focusedOption.value as string, Bot.gameData[RefType.Table])
          );
        }
        break;
      }
      case InteractionType.ApplicationCommand: {
        interaction = interaction as CommandInteraction;
        const data = Bot.gameData[RefType.Table].get(id);
        if (!data) {
          await interaction.reply({
            content:`Couldn't find a table named ${id}.`,
            ephemeral: true
          });
          return;
        }
        if (preview) {
          await interaction.reply(data.toMessage(WidgetType.Table, true));
        } else {
          await interaction.reply(data.toMessage(WidgetType.TableRoll));
        }
        break;
      }
      default:
        break;
    }
  }
}
