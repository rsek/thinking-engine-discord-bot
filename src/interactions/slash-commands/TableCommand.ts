import "reflect-metadata";

import { Discord, Slash, SlashOption } from "discordx";
import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction, InteractionType } from "discord.js";
import { WidgetType } from "../../modules/widgets/WidgetType.js";
import queryCollection from "../autocomplete/queryCollection.js";
import Table from "../../modules/tables/Table.js";
import { container } from "tsyringe";
import Tables from "../../data/Tables.js";

@Discord()
export abstract class RollTableCommand {
  readonly _gameData = container.resolve(Tables);
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
            queryCollection(focusedOption.value as string, this._gameData)
          );
        }
        break;
      }
      case InteractionType.ApplicationCommand: {
        interaction = interaction as CommandInteraction;
        const data = this._gameData.get(id) as Table;
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
