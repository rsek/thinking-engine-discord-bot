import "reflect-metadata";
import { Discord, Slash, SlashGroup, SlashOption} from "discordx";
import { AutocompleteInteraction, CommandInteraction } from "discord.js";
import gameData from "../../troika/data/gameData.js";
import queryRecord from "../autocomplete/queryRecord.js";

@Discord()
export default abstract class RollTableCommand {
  @Slash("table", {description: "Roll on a table."})
  @SlashGroup("roll")
  async rollTable(
    @SlashOption( "table-name",
      {
        description: "The table to be rolled on.",
        type: "STRING",
        autocomplete: true
      })
      tableName: string,
      interaction: CommandInteraction|AutocompleteInteraction
  ): Promise<void> {
    switch (interaction.type) {
      case "APPLICATION_COMMAND_AUTOCOMPLETE": {
        interaction = interaction as AutocompleteInteraction;
        const focusedOption = interaction.options.getFocused(true);
        if (focusedOption.name === "table-name") {
          return interaction.respond(
            queryRecord(focusedOption.value as string, gameData.tables)
          );
        }
        break;
      }
      case "APPLICATION_COMMAND": {
        interaction = interaction as CommandInteraction;
        const tableData = gameData.tables[tableName];
        if (!tableData) {
          await interaction.reply({
            content:`Couldn't find a table named ${tableName}.`,
            ephemeral: true});
          return;
        }
        await interaction.reply({
          embeds: [tableData.toEmbed()],
        });
        break;
      }
      default:
        break;
    }
  }
}
