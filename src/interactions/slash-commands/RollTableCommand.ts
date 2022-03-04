import "reflect-metadata";
import { Discord, Slash, SlashGroup, SlashOption} from "discordx";
import { AutocompleteInteraction, CommandInteraction, InteractionReplyOptions, Message, MessageActionRow } from "discord.js";
import gameData from "../../data/gameData.js";
import queryRecord from "../autocomplete/queryRecord.js";
import revealMessageButton from "../components/revealMessageButton.js";
import tableRollButton from "../components/tableRollButton.js";
import dismissMessageButton from "../components/dismissMessageButton.js";

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
    @SlashOption("preview", {
      description: "Display a preview of the table instead of rolling on it. (default: false)",
      type: "BOOLEAN",
      required: false
    })
      preview: boolean = false,
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
        const result: InteractionReplyOptions = {};
        if (preview) {
          result.embeds = tableData.toPreviewEmbeds();
          result.ephemeral = true;
          result.components = [
            new MessageActionRow({components: [
              revealMessageButton,
              tableRollButton(tableName),
            ]})
          ];
        } else {
          result.embeds = [tableData.toRollEmbed()];
          result.components = [
            new MessageActionRow({components: [
              dismissMessageButton,
              tableRollButton(tableName, "Roll again"),
            ]})
          ];
        }
        await interaction.reply(result);
        break;
      }
      default:
        break;
    }
  }
}
